const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const responses = require("../../utils/responses");

function loginRequired(req, res, next) {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) return res.status(401).json({ message: [responses.UNAUTHORIZED], statusCode: 401 });

  try {
    const verified = authService.verifyToken(token);
    console.log(verified);
    if (!verified) return res.status(401).json({ message: [responses.TOKEN_EXPIRED], statusCode: 401 });
    req.user = verified;
    console.log(req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: [responses.TOKEN_INVALID], statusCode: 401 });
  }
}

function superValidation(req, res, next) {
  if (req.user.role !== "super")
    return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
  next();
}

function selfValidation(req, res, next) {
  if (req.user.id !== req.params.id)
    return res.status(403).json({ message: [responses.UNAUTHORIZED], statusCode: 403 });
  next();
}

module.exports = { loginRequired, superValidation, selfValidation };
