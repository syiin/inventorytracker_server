const mongoose = require("mongoose");
const util = require("util");
const InvItem = require("../models/InvItem");

exports.getAllItems = async (req, res) => {
  const item = await InvItem.find();
  res.status(200).json(item);
};

exports.createItem = async (req, res) => {
  const item = await new InvItem(req.body).save();
  console.log(req.body);
  res.status(200).json({ item });
};

exports.editItem = async (req, res) => {
  const item = await InvItem.findOne({ _id: req.params.id });
  res.status(200).json({ item });
};

exports.updateItem = async (req, res) => {
  const foundItem = await InvItem.findOneAndUpdate(
    {
      _id: req.params.id
    },
    {
      name: req.body.name,
      amount: req.body.amount,
      unit: req.body.unit,
      categories: req.body.categories,
      $push: { history: { ...req.body } }
    },
    {
      upsert: true,
      new: true
    }
  ).exec();

  // const item = await InvItem.findOne({ _id: req.params.id });
  // item.history.append(req.body);

  res.status(200).json({ foundItem });
};

exports.deleteItem = async (req, res, next) => {
  let foundItem = await InvItem.findById(req.params.id);
  await foundItem.remove();
  return res.status(200).json(foundItem);
};

exports.getItemsByCat = async (req, res) => {
  const category = req.params.category;

  const categoryQuery = category || { $exists: true };

  const items = await InvItem.find({ categories: categoryQuery });

  res.status(200).json({ items });
};

// http http://localhost:8888/api/allstockitems
// http POST http://localhost:8888/api/addstockitem name=beef amount=3
