const express = require("express");
const router = express.Router();
const mintController = require("./controller");

router.get("/total_mint", mintController.getTotalMintedCount);
router.get("/account_mint_count", mintController.getMintedCountByAccount);
router.post("/mint_token", mintController.mintToken);

module.exports = router;
