const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const { JWT_SECRET, JWT_EXPIRATION, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, GOOGLE_CLIENT_SECRET } = require("../../../config");

class AuthService {
  constructor() {}

  async getGoogleAuthUrl() {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=profile%20email&access_type=offline&prompt=consent`;
  }

  async getGoogleUser(code) {
    const { data } = await axios.post(
      `https://oauth2.googleapis.com/token`,
      {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const user = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${data.access_token}`);
    return user.data;
  }

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
