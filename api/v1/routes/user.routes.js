const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { superValidation, loginRequired, selfOrSuperValidation } = require("../middlewares/authorization");

// User routes
router.get("/", loginRequired, superValidation, userController.getAll);
router.get("/:id", loginRequired, selfOrSuperValidation, userController.getOne);
router.put("/:id", loginRequired, selfOrSuperValidation, userController.update);
router.delete("/:id", loginRequired, selfOrSuperValidation, userController.delete);
router.delete("/:id/hard", loginRequired, superValidation, userController.deleteHard);

module.exports = router;
