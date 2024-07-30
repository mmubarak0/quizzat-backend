const MODE = process.env.MODE || "development";

const DATABASE_URI =
  process.env.DATABASE_URI ||
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.10";
let DATABASE_NAME = "quizDB";
if (MODE === "production") {
  DATABASE_NAME = process.env.DATABASE_NAME || DATABASE_NAME;
} else {
  DATABASE_NAME = process.env.TEST_DATABASE_NAME || `${DATABASE_NAME}_test`;
}
const USERS_COLLECTION = process.env.USERS_COLLECTION || "users";
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 4000;
const SCHEMA = process.env.SCHEMA || "http";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "google_client_id";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "google_client_secret";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${SCHEMA}://${HOST}:${PORT}/api/v1/auth/google/callback`;

module.exports = {
  DATABASE_URI,
  DATABASE_NAME,
  USERS_COLLECTION,
  JWT_SECRET,
  JWT_EXPIRATION,
  HOST,
  PORT,
  SCHEMA,
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
  GOOGLE_CLIENT_SECRET,
};
