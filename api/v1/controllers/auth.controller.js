const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const responses = require("../../utils/responses");

class AuthController {
  constructor() {}

  async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const user = await userService.getUserByEmail(email, true);
      if (user) {
        return res.status(422).json({ message: [responses.USER_EXISTS], statusCode: 422 });
      }
      const hash = await authService.encryptPassword(password);
      let new_user = await userService.createUser({
        email,
        password: hash,
        firstName,
        lastName,
      });
      new_user = await userService.getUserById(new_user.insertedId, true);
      let tokens = await authService.generateToken(new_user);
      authService.storeToken(res, "refreshToken", tokens.refreshToken);
      delete new_user.password;
      res.status(201).json({
        message: [responses.USER_CREATED],
        statusCode: 201,
        ...tokens,
        data: new_user,
      });
    } catch (error) {
      res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail(email, true);
      if (!user) {
        return res.status(400).json({ message: [responses.USER_NOT_FOUND], statusCode: 404 });
      }
      const valid = await authService.decryptPassword(password, user.password);
      if (!valid) {
        return res.status(400).json({ message: [responses.INVALID_CREDENTIALS], statusCode: 400 });
      }
      let tokens = await authService.generateToken(user);
      authService.storeToken(res, "refreshToken", tokens.refreshToken);
      res.status(200).json({ message: [responses.LOGIN_SUCCESS], statusCode: 200, ...tokens });
    } catch (error) {
      res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
    }
  }
}

const authController = new AuthController();
module.exports = authController;
