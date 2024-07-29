const Responses = Object.freeze({
  SUCCESS: "Success",
  UNAUTHORIZED: "Unauthorized access",
  EMAIL_IN_USE: "This email is already in use.",
  NOT_FOUND: "Not found!",
  INVALID_CREDENTIALS: "Invalid credentials!",
  INTERNAL_SERVER_ERROR: "Internal api-server error.",
  BAD_REQUEST: "Bad request.",
  INVALID_PASSWORD: "Invalid password.",
  USER_NOT_FOUND: "User not found.",
  USER_EXISTS: "User already exists.",
  USER_CREATED: "User created successfully.",
  LOGIN_SUCCESS: "Login successful.",
  TOKEN_REFRESHED: "Token refreshed.",
  LOGOUT_SUCCESS: "Logout successful.",
  LOGOUT_ERROR: "Logout error.",
  TOKEN_DELETED: "Token deleted.",
  TOKEN_NOT_FOUND: "Token not found.",
  TOKEN_EXPIRED: "Token expired.",
  TOKEN_INVALID: "Token invalid.",
  TOKEN_REFRESH_ERROR: "Token refresh error.",
});

module.exports = Responses;
