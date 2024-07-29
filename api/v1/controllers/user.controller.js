const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const responses = require("../../utils/responses");

class UserController {
  constructor() {}

  async getAll(req, res) {
    try {
      const users = await userService.getAll();
      res.status(200).json({ message: [responses.SUCCESS], statusCode: 200, data: users });
    } catch (error) {
      res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
    }
  }

  async getOne(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: [responses.USER_NOT_FOUND], statusCode: 404 });
      }
      res.status(200).json({ message: [responses.SUCCESS], statusCode: 200, data: user });
    } catch (error) {
      res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: [responses.USER_NOT_FOUND], statusCode: 404 });
      }
      const updated_user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({ message: [responses.USER_UPDATED], statusCode: 200, data: updated_user });
    } catch (error) {
      res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
    }
  }

  async delete(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: [responses.USER_NOT_FOUND], statusCode: 404 });
      }
      await userService.deleteUser(req.params.id);
      res.status(200).json({ message: [responses.USER_DELETED], statusCode: 200 });
    } catch (error) {
      res.status(500).json({ message: [responses.INTERNAL_SERVER_ERROR], statusCode: 500 });
    }
  }
}

const userController = new UserController();
module.exports = userController;