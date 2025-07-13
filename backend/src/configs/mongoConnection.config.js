const mongoConnectionPrimary = require("mongoose");
const mongoConnectionSecondary = require("mongoose");

class mongoConnection {
  constructor() {}
  static mongoStatic = mongoConnectionPrimary.createConnection(
    process.env.MONGODB_URL,
  );

  static secondaryMongoStatic = mongoConnectionSecondary.createConnection(
    process.env.MONGODB_URL,
  );
}

mongoConnection.mongoStatic.on("connected", () => {
  console.log("[MongoDB]: Primary database connected successfully");
});

mongoConnection.mongoStatic.on("error", (err) => {
  console.error("[MongoDB]: Primary connection error: ", err);
});

mongoConnection.secondaryMongoStatic.on("connected", () => {
  console.log("[MongoDB]: Secondary database connected successfully");
});

mongoConnection.secondaryMongoStatic.on("error", (err) => {
  console.error("[MongoDB]: Secondary connection error: ", err);
});

module.exports = {
  mongoConnection,
};
