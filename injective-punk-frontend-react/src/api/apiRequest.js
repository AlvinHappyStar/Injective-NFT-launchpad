import axios from "axios";
import { SERVER_URL } from "../config-global";

export const getTotalMintedCount = async () => {
  try {
    const mintInfo = await axios.get(`${SERVER_URL}/total_mint`);
    console.log("getTotalMintedCount log - 1 : ", mintInfo);
    return mintInfo.data;
  } catch (error) {
    return {
      result: false,
      error: error.message,
    };
  }
};

export const getAccountMintedCount = async (accountId) => {
  try {
    const mintInfo = await axios.get(
      `${SERVER_URL}/account_mint_count?a=${btoa(accountId)}`
    );
    return mintInfo.data;
  } catch (error) {
    return {
      result: false,
      error: error.message,
    };
  }
};

export const requestMint = async (accountId, mintCount) => {
  try {
    const mintInfo = await axios.post(`${SERVER_URL}/mint_token`, {
      a: btoa(accountId),
      b: btoa(mintCount),
    });
    return mintInfo.data;
  } catch (error) {
    return {
      result: false,
      error: error.message,
    };
  }
};
