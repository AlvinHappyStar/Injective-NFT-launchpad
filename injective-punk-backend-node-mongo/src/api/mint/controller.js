require("dotenv").config("../.env");
const {
  TOKEN_TOTAL_SUPPLY,
  TOKEN_ID,
  MINT_STATUS_FREE,
  TIME_DELAY_INIT,
  MINT_STATUS_PENDING,
  MINT_LIMIT_COUNT_PER_WALLET,
  MINT_BALANCE_PER_NFT,
  NFT_SEND_LIMIT_COUNT_PER_TX,
} = require("../../config-global");
const { NftInfo, MinterInfo } = require("../../db");
const nftInfo = require("../../db/nftInfo");
const {
  getAccountMintedCount,
  changeStatusToPending,
  resetAccountMintedCount,
  changeStatusToComplete,
} = require("../mainApi");
const { getNftInfo, receiveAllowance, sendNfts } = require("../web3Api");

const treasuryId = process.env.TREASURY_ID;
let isInitializing;

exports.getTotalMintedCount = async (req, res) => {
  console.log("getTotalMintedCount log - 1");
  try {
    const remainCount = await NftInfo.countDocuments({ accountId: treasuryId });
    const totalMintedCount = TOKEN_TOTAL_SUPPLY - remainCount;

    console.log("getTotalMintedCount log - 2 : ", totalMintedCount);
    return res.send({
      result: true,
      data: totalMintedCount,
    });
  } catch (error) {
    return res.send({
      result: false,
      error: "Error 2-1 detected in server progress!",
    });
  }
};

exports.getMintedCountByAccount = async (req, res) => {
  try {
    const accountId = atob(req.query.a);

    const accountMintInfo = await getAccountMintedCount(accountId);
    console.log("mintToken log - 2 : ", accountMintInfo);

    if (!accountMintInfo.result) {
      return res.send({
        result: false,
        error: "Error 3-2 detected in server progress!",
      });
    }

    return res.send({
      result: true,
      data: accountMintInfo.mintedCount,
    });
  } catch (error) {
    return res.send({
      result: false,
      error: "Error 3-1 detected in server progress!",
    });
  }
};

exports.mintToken = async (req, res) => {
  console.log("mintToken log - 1 : ", req.body);
  try {
    if (isInitializing) {
      return res.send({
        result: false,
        error: "Server is initializing now.",
      });
    }

    const accountId = atob(req.body.a);
    const mintCount = parseInt(atob(req.body.b));
    const remainCount = await NftInfo.countDocuments({ accountId: treasuryId });

    // check minted count
    const accountMintInfo = await getAccountMintedCount(accountId);
    console.log("mintToken log - 2 : ", accountMintInfo);

    if (!accountMintInfo.result) {
      return res.send({
        result: false,
        error: "Error 1-2 detected in server progress!",
      });
    }

    if (
      accountMintInfo.mintedCount + mintCount > MINT_LIMIT_COUNT_PER_WALLET ||
      mintCount <= 0
    ) {
      return res.send({
        result: false,
        error: "Reset the mint count correctly.",
      });
    }

    if (remainCount < mintCount) {
      return res.send({
        result: false,
        error: "Remain mint count is not enough. Please reset the mint count.",
      });
    }

    // receive payment
    const receiveResult = await receiveAllowance(
      accountId,
      mintCount * MINT_BALANCE_PER_NFT,
      0,
      0,
      0,
      0
    );

    if (!receiveResult) {
      return res.send({
        result: false,
        error: "Error 1-3 detected in server progress!",
      });
    }

    // select NFTs
    const nftsToMint = await NftInfo.aggregate([
      { $match: { accountId: treasuryId } },
      { $sample: { size: mintCount } },
    ]);
    console.log("mintToken log - 3 : ", nftsToMint);

    await resetAccountMintedCount(accountId, mintCount);

    let serialNumbersToMint = [];
    for (let i = 0; i < nftsToMint.length; i++) {
      await changeStatusToPending(accountId, nftsToMint[i].serialNumber);
      serialNumbersToMint.push(nftsToMint[i].serialNumber);
    }

    let serialNumberGroupsToMint = [];
    for (
      let i = 0;
      i < serialNumbersToMint.length;
      i += NFT_SEND_LIMIT_COUNT_PER_TX
    ) {
      serialNumberGroupsToMint.push(
        serialNumbersToMint.slice(i, i + NFT_SEND_LIMIT_COUNT_PER_TX)
      );
    }
    console.log("mintToken log - 4 : ", serialNumberGroupsToMint);

    for (let i = 0; i < serialNumberGroupsToMint.length; i++) {
      const sendNftResult = await sendNfts(
        treasuryId,
        accountId,
        TOKEN_ID,
        serialNumberGroupsToMint[i]
      );

      if (!sendNftResult) {
        return res.send({
          result: false,
          error: "Error 1-4 detected in server progress!",
        });
      }

      for (let j = 0; j < serialNumberGroupsToMint[i].length; j++) {
        await changeStatusToComplete(serialNumberGroupsToMint[i][j]);
      }
    }

    return res.send({
      result: true,
    });
  } catch (error) {
    return res.send({
      result: false,
      error: "Error 1-1 detected in server progress!",
    });
  }
};

const initDb = async () => {
  console.log("initDb log - 1");

  isInitializing = true;

  const currentDbInfo = await NftInfo.find(
    {},
    { serialNumber: 1, accountId: 1, status: 1 }
  );

  for (let i = 1; i <= TOKEN_TOTAL_SUPPLY; i++) {
    const nftInfo = await getNftInfo(TOKEN_ID, i);
    const accountId = nftInfo.result ? nftInfo.data.account_id : "";

    const currentNftDbInfo = currentDbInfo.find(
      (item) => item.serialNumber === i
    );

    // can not find serial number in db
    if (currentNftDbInfo === undefined) {
      const newNftInfo = new NftInfo({
        serialNumber: i,
        accountId: accountId,
        status: MINT_STATUS_FREE,
      });
      await newNftInfo.save();
    } else {
      // if db info not equal to mirror info
      if (
        currentNftDbInfo.accountId !== accountId ||
        (currentNftDbInfo.status === MINT_STATUS_PENDING &&
          accountId !== treasuryId)
      ) {
        await NftInfo.updateOne(
          {
            serialNumber: i,
          },
          {
            accountId: accountId,
            status: MINT_STATUS_FREE,
          }
        );
      }
    }
  }

  console.log("initDb log - 2");

  isInitializing = false;
};

const init = async () => {
  console.log("init log - 1");

  isInitializing = false;
  // setTimeout(initDb, TIME_DELAY_INIT);
};

init();
