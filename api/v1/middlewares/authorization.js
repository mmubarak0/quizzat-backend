const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const responses = require("../../utils/responses");
const mongo = require("mongodb");

async function loginRequired(req, res, next) {
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
  }
}

function superValidation(req, res, next) {
  if (req.user.role !== "super") return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
  next();
}

function selfValidation(req, res, next) {
  if (!req.user) return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
  if (req.user.id !== req.params.id)
    return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
  next();
}

function selfOrSuperValidation(req, res, next) {
  if (!req.user) return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
  if (req.user.role === "super") return next();
  console.log(req.user._id.toString())
  if (req.user._id.toString() !== req.params.id)
    return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
  next();
}

module.exports = { loginRequired, superValidation, selfValidation, selfOrSuperValidation };
