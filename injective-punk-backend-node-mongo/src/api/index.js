const express = require("express");
const Mint = require("./mint");

const router = express.Router();
router.use("/mint", Mint);
module.exports = router;
