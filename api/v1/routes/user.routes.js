const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { superValidation, selfValidation, loginRequired } = require("../middlewares/authorization");

// User routes
router.get("/", loginRequired, superValidation, userController.getAll);
router.get("/:id", loginRequired, userController.getOne);
router.put("/:id", loginRequired, superValidation || selfValidation, userController.update);
router.delete("/:id", loginRequired, superValidation || selfValidation, userController.delete);
