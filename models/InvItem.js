const mongoose = require("mongoose");

const invSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    slug: String,
    amount: {
      type: Number
    },
    unit: {
      type: String
    },
    description: {
      type: String,
      trim: true
    },
    categories: [String],
    history: [
      {
        name: String,
        amount: Number,
        unit: String,
        updatedDate: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

invSchema.statics.getCatList = function() {
  //aggregate is a method like find() - it takes an array of possible operators
  return (
    this.aggregate([
      //$unwind is a pipeline operator - it creates a bunch of objects each with one tag.
      //$categories say this is the field I want to unwind
      { $unwind: "$categories" },
      //group everything based on tag field and create a new field called 'count'
      //every time we group, it will sum itself by 1 (eg. add itself by 1)
      { $group: { _id: "$categories", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
      //get the cursor which takes the default batch size and exec all the above
      .cursor({})
      .exec()
  );
};

module.exports = mongoose.model("InvItem", invSchema);
