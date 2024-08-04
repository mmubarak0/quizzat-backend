const mongo = require("mongodb");
const client = require("../../utils/db");
const logger = require("../../utils/logger");
const { validateUpdateUser, validateCreateUser } = require("../middlewares/validation");

const { DATABASE_NAME, USERS_COLLECTION } = require("../../../config");

const database = client.db(DATABASE_NAME);
const users = database.collection(USERS_COLLECTION);

class userService {
  constructor() {}

  async getUserByEmail(email, show_secret = false) {
    if (!show_secret) {
      return await users.findOne({ email, deleted: { $ne: true } }, { projection: { password: 0 } });
    }
    return await users.findOne({ email, deleted: { $ne: true } });
  }

  async getUserById(id, show_secret = false) {
    let objId = null;
    if (id instanceof mongo.ObjectId) {
      objId = id;
    } else {
      objId = new mongo.ObjectId(id);
    }
    if (!show_secret) {
      return await users.findOne({ _id: objId, deleted: { $ne: true } }, { projection: { password: 0 } });
    }
    return await users.findOne({ _id: objId, deleted: { $ne: true } });
  }

  async getAllUsers(show_secret = false) {
    if (!show_secret) {
      return await users.find({ deleted: { $ne: true } }, { projection: { password: 0 } }).toArray();
    }
    return await users.find({ deleted: { $ne: true } }).toArray();
  }

  async createUser(user) {
    user = validateCreateUser(user);
    return await users.insertOne(user);
  }

  async updateUser(id, user) {
    user = validateUpdateUser(user);
    logger.log(user);
    let objId = null;
    if (id instanceof mongo.ObjectId) {
      objId = id;
    } else {
      objId = new mongo.ObjectId(id);
    }
    return await users.updateOne({ _id: objId }, { $set: user });
  }

  async deleteUser(id, hard = false) {
    let objId = null;
    if (id instanceof mongo.ObjectId) {
      objId = id;
    } else {
      objId = new mongo.ObjectId(id);
    }
    if (!hard) {
      // soft delete user
      return await users.updateOne({ _id: objId }, { $set: { deleted: true } });
    }
    // hard delete user
    return users.deleteOne({ _id: objId });
  }

  async setRole(id, role) {
    let objId = null;
    if (id instanceof mongo.ObjectId) {
      objId = id;
    } else {
      objId = new mongo.ObjectId(id);
    }
    return await users.updateOne({ _id: objId }, { $set: { role } });
  }

  async setDeleted(id, deleted) {
    let objId = null;
    if (id instanceof mongo.ObjectId) {
      objId = id;
    } else {
      objId = new mongo.ObjectId(id);
    }
    return await users.updateOne({ _id: objId }, { $set: { deleted } });
  }
}

module.exports = new userService();
