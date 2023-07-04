require("dotenv").config("../env");
const {
  AccountId,
  Client,
  Hbar,
  NftId,
  PrivateKey,
  TransferTransaction,
  TokenId,
  TransactionId,
} = require("@hashgraph/sdk");
const axios = require("axios");

const operatorId = AccountId.fromString(process.env.TREASURY_ID);
const operatorKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);

const getNftInfo = async (tokenId, serialNumber) => {
  try {
    const response = await axios.get(
      `https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${tokenId}/nfts/${serialNumber}`
    );
    return {
      result: true,
      data: response.data,
    };
  } catch (error) {
    console.log("getNftInfo error : ", error);
    return {
      result: false,
      error: error,
    };
  }
};

const receiveAllowance = async (
  senderId,
  amount,
  ftId,
  ftAmount,
  nftId,
  serialNum
) => {
  try {
    const client = Client.forMainnet()
      .setOperator(operatorId, operatorKey)
      .setDefaultMaxTransactionFee(new Hbar(50));

    let approvedSendTx = new TransferTransaction();
    if (amount > 0) {
      const sendBal = new Hbar(amount);
      approvedSendTx
        .addApprovedHbarTransfer(
          AccountId.fromString(senderId),
          sendBal.negated()
        )
        .addHbarTransfer(operatorId, sendBal);
    }
    if (ftAmount > 0) {
      approvedSendTx
        .addApprovedTokenTransfer(
          TokenId.fromString(ftId),
          AccountId.fromString(senderId),
          -ftAmount
        )
        .addTokenTransfer(TokenId.fromString(ftId), operatorId, ftAmount);
    }
    if (serialNum > 0) {
      const nft = new NftId(TokenId.fromString(nftId), serialNum);
      approvedSendTx.addApprovedNftTransfer(
        nft,
        AccountId.fromString(senderId),
        operatorId
      );
    }
    approvedSendTx
      .setTransactionId(TransactionId.generate(operatorId)) // Spender must generate the TX ID or be the client
      .freezeWith(client);
    const approvedSendSign = await approvedSendTx.sign(operatorKey);
    const approvedSendSubmit = await approvedSendSign.execute(client);
    const approvedSendRx = await approvedSendSubmit.getReceipt(client);

    if (approvedSendRx.status._code != 22) return false;

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const sendNfts = async (senderId, receiverId, tokenId, serialNumbers) => {
  console.log(
    "sendNft log - 1 : ",
    senderId,
    receiverId,
    tokenId,
    serialNumbers
  );
  try {
    const client = Client.forMainnet()
      .setOperator(operatorId, operatorKey)
      .setDefaultMaxTransactionFee(new Hbar(50));

    const transferTx = new TransferTransaction();
    for (let i = 0; i < serialNumbers.length; i++) {
      const nft = new NftId(TokenId.fromString(tokenId), serialNumbers[i]);
      transferTx.addNftTransfer(
        nft,
        AccountId.fromString(senderId),
        AccountId.fromString(receiverId)
      );
    }
    transferTx.freezeWith(client);
    const transferSign = await transferTx.sign(operatorKey);
    const transferSubmit = await transferSign.execute(client);
    const transferRx = await transferSubmit.getReceipt(client);

    if (transferRx.status._code !== 22) return false;

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  getNftInfo,
  receiveAllowance,
  sendNfts,
};
