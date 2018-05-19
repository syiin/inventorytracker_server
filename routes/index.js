const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");
const authController = require("../controllers/authController");
const { catchErrors } = require("../handlers");

//ITEM ROUTES
router.get(
  "/api/allstockitems",
  authController.loginRequired,
  catchErrors(apiController.getAllItems)
);
router.post(
  "/api/addstockitem",
  authController.loginRequired,
  catchErrors(apiController.createItem)
);
router.get(
  "/api/:id/editstockitem",
  authController.loginRequired,
  catchErrors(apiController.editItem)
);
router.post(
  "/api/:id/updatestockitem",
  authController.loginRequired,
  catchErrors(apiController.updateItem)
);

router.delete(
  "/api/:id/deleteitem",
  authController.loginRequired,
  catchErrors(authController.isAdmin),
  catchErrors(apiController.deleteItem)
);

router.get("/api/categories", catchErrors(apiController.getItemsByCat));
router.get(
  "/api/categories/:category",
  catchErrors(apiController.getItemsByCat)
);

//USER ROUTES
router.post(
  "/api/registeruser",
  catchErrors(authController.isAdmin),
  catchErrors(authController.registerUser)
);
router.post("/api/login", authController.signInUser);

module.exports = router;

//ARCHIVED:
