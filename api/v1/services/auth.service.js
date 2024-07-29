const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_EXPIRATION } = require("../../../config");

class AuthService {
  constructor() {}

  async generateToken(user) {
    const accesstoken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "5m" });
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    return { accesstoken, refreshToken };
  }
  async encryptPassword(pass) {
    const hash = await bcrypt.hash(pass, 10);
    return hash;
  }
  async decryptPassword(pass, hash) {
    if (!pass || !hash) return false;
    const compare = await bcrypt.compare(pass, hash);
    return compare;
  }
  async storeToken(res, name, tok) {
    res.cookie(name, tok, {
      httpOnly: true,
    });
  }
  async verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }
}

const authService = new AuthService();
module.exports = authService;
