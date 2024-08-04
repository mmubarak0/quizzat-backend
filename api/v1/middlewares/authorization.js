const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const responses = require("../../utils/responses");
const mongo = require("mongodb");
const logger = require("../../utils/logger");

async function loginRequired(req, res, next) {
  try {
    if (!req.header("Authorization")) return res.status(401).json({ message: [responses.UNAUTHORIZED], statusCode: 401 });
    const token_bearer = req.header("Authorization").split(" ");
    const token = token_bearer[token_bearer.length - 1];
    if (!token) return res.status(401).json({ message: [responses.TOKEN_INVALID], statusCode: 401 });

    try {
      const verified = await authService.verifyToken(token);
      if (!verified) return res.status(401).json({ message: [responses.TOKEN_EXPIRED], statusCode: 401 });
      req.user = await userService.getUserById(verified.id);
      next();
    } catch (error) {
      res.status(401).json({ message: [responses.TOKEN_INVALID], statusCode: 401 });
      logger.log(error);
    }
  } catch (error) {
    logger.log(error);
    res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
  }
}

function superValidation(req, res, next) {
  try {
    if (req.user.role !== "super") return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
    next();
  } catch (error) {
    logger.log(error);
    res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
  }
}

function selfValidation(req, res, next) {
  try {
    if (!req.user) return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
    if (req.user.id !== req.params.id)
      return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
    next();
  } catch (error) {
    logger.log(error);
    res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
  }
}

function selfOrSuperValidation(req, res, next) {
  try {
    if (!req.user) return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
    if (req.user.role === "super") return next();
    logger.log(req.user._id.toString())
    if (req.user._id.toString() !== req.params.id)
      return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
    next();
  } catch (error) {
    logger.log(error);
    res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
  }
}

module.exports = { loginRequired, superValidation, selfValidation, selfOrSuperValidation };
