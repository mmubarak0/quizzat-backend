const { NODE_ENV } = require("../../config");

class Logger {
  constructor() {
    if (NODE_ENV !== "production") {
      this.log = console.log;
      this.error = console.error;
    } else {
      this.log = () => {};
      this.error = () => {};
    }
  }
}

module.exports = new Logger();
