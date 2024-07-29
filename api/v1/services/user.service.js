const client = require("../../utils/db");
const { validateUpdateUser, validateCreateUser } = require("../middlewares/validation");

const { DATABASE_NAME, USERS_COLLECTION } = require("../../../config");

const database = client.db(DATABASE_NAME);
const users = database.collection(USERS_COLLECTION);

class userService {
  constructor() {}

  async getUserByEmail(email, show_secret = false) {
    if (!show_secret) {
      return await users.findOne({ email }, { projection: { password: 0 } });
    }
    return await users.findOne({ email });
  }

  async getUserById(id, show_secret = false) {
    if (!show_secret) {
      return await users.findOne({ _id: id }, { projection: { password: 0 } });
    }
    return await users.findOne({ _id: id });
  }

  async createUser(user) {
    user = validateCreateUser(user);
    return await users.insertOne(user);
  }

  async updateUser(id, user) {
    user = validateUpdateUser(user);
    return await users.updateOne({ _id: id }, { $set: user });
  }

  async deleteUser(id) {
    // soft delete user
    return await users.updateOne({ _id: id }, { $set: { deleted: true } });
    // return users.deleteOne({ _id: id });
  }
}

module.exports = new userService();
