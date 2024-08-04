const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { newUserValidation, userValidation } = require("../middlewares/validation");
const { loginRequired } = require("../middlewares/authorization");

// Auth routes
router.post("/register", newUserValidation, authController.register);
router.post("/login", userValidation, authController.login);
router.get("/google", authController.google);
router.get("/google/callback", authController.googleCallback);
router.post("/register-admin", newUserValidation, authController.registerAdmin);
router.post("/verify-token", loginRequired, authController.verifyToken);
// router.post('/refresh', authController.refresh);
// router.post('/logout', authController.logout);

module.exports = router;
