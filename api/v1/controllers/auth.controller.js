const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const responses = require("../../utils/responses");
const logger = require("../../utils/logger");

class AuthController {
  constructor() {}

  async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const user = await userService.getUserByEmail(email, true);
      if (user) {
        if (user.deleted) {
          await userService.setDeleted(user._id, false);
        } else {
          return res.status(409).json({ message: [responses.USER_EXISTS], statusCode: 409 });
        }
      }
      const hash = await authService.encryptPassword(password);
      let new_user = await userService.createUser({
        email,
        password: hash,
        firstName,
        lastName,
      });
      new_user = await userService.getUserById(new_user.insertedId, true);
      await userService.setRole(new_user._id, "user");
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
      logger.log(error);
    }
  }

  async registerAdmin(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const user = await userService.getUserByEmail(email, true);
      if (user) {
        if (user.deleted) {
          await userService.setDeleted(user._id, false);
        } else {
          return res.status(409).json({ message: [responses.USER_EXISTS], statusCode: 409 });
        }
      }
      const hash = await authService.encryptPassword(password);
      let new_user = await userService.createUser({
        email,
        password: hash,
        firstName,
        lastName,
      });
      new_user = await userService.getUserById(new_user.insertedId, true);
      await userService.setRole(new_user._id, "super");
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
      logger.log(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail(email, true);
      if (!user) {
        return res.status(404).json({ message: [responses.USER_NOT_FOUND], statusCode: 404 });
      } else if (user.deleted) {
        return res.status(404).json({ message: [responses.DELETED_ACCOUNT], statusCode: 404 })
      }
      const valid = await authService.decryptPassword(password, user.password);
      if (!valid) {
        return res.status(400).json({ message: [responses.INVALID_CREDENTIALS], statusCode: 400 });
      }
      let tokens = await authService.generateToken(user);
      authService.storeToken(res, "refreshToken", tokens.refreshToken);
      delete user.password;
      res.status(200).json({ message: [responses.LOGIN_SUCCESS], statusCode: 200, ...tokens, data: user });
    } catch (error) {
      res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
      logger.log(error);
    }
  }

  async google(req, res) {
    try {
      const url = await authService.getGoogleAuthUrl();
      res.redirect(url);
    } catch (error) {
      res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
      logger.log(error);
    }
  }

  async googleCallback(req, res) {
    const { code } = req.query;

    try {
      const data = await authService.getGoogleUser(code);
      let user = await userService.getUserByEmail(data.email);
      if (!user) {
        if (!data.email) {
          return res.status(400).json({ message: [responses.NETWORK_ERROR], statusCode: 400 });
        }
        user = await userService.createUser({
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
        });
        user = await userService.getUserById(user.insertedId);
        await userService.setRole(user._id, "user");
        user = await userService.getUserById(user._id);
      } else if (user.deleted) {
        await userService.setDeleted(user._id, false);
      }
      let tokens = await authService.generateToken(user);
      authService.storeToken(res, "refreshToken", tokens.refreshToken);
      res.status(200).json({ message: [responses.LOGIN_SUCCESS], statusCode: 200, ...tokens, data: user });
    } catch (error) {
      res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
      logger.log(error); 
    }
  }

  async verifyToken(req, res) {
    return res.status(200).json({ message: responses.SUCCESS, statusCode: 200 });
  }
}

const authController = new AuthController();
module.exports = authController;
