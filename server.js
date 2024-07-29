require("dotenv").config();

const app = require("./api/app");
const { SCHEMA, HOST, PORT } = require("./config");

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${SCHEMA}://${HOST}:${PORT}`);
});
