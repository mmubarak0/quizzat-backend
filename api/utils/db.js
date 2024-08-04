const { DATABASE_URI } = require("../../config");
const { MongoClient, ServerApiVersion } = require("mongodb");
const logger = require("./logger");

const client = new MongoClient(DATABASE_URI);
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    logger.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch {
    logger.log("Failed to connect to MongoDB!");
  }
}

run().catch(console.dir);

module.exports = client;
