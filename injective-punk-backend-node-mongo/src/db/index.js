const dbConfig = require("./config");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.NftInfo = require("./nftInfo")(mongoose);
db.MinterInfo = require("./minterInfo")(mongoose);

module.exports = db;
