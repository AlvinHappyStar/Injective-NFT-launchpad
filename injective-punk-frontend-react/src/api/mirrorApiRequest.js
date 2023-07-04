import axios from "axios";

const MIRRORNET_URL = "https://mainnet-public.mirrornode.hedera.com";

export const associateCheck = async (accountId, tokenId) => {
  try {
    const associateInfo = await axios.get(
      `${MIRRORNET_URL}/api/v1/accounts/${accountId}/tokens?token.id=${tokenId}`
    );

    if (associateInfo?.data?.tokens?.length > 0)
      return {
        result: true,
        associated: true,
      };

    return {
      result: true,
      associated: false,
    };
  } catch (error) {
    return {
      result: false,
      error: error.message,
    };
  }
};

export const getNftInfo = async (tokenId, serialNumber) => {
  try {
    const metadataInfo = await axios.get(
      `https://ipfs.io/ipfs/QmV4cFhw2AJeS8xc1he3Kia9oNCc3ebjhNpxDA2unDD6WG/${serialNumber}.json`
    );

    return {
      result: true,
      data: {
        name: metadataInfo.data.name,
        description: metadataInfo.data.description,
        imageUrl: convertToIpfsUrl(metadataInfo.data.image),
        attributes: metadataInfo.data.attributes, // {trait_type: info, value: info}
      },
    };
  } catch (error) {
    return {
      result: false,
      error: error.message,
    };
  }
};

const base64ToUtf8 = (base64Str) => {
  // create a buffer
  const buff = Buffer.from(base64Str, "base64");

  // decode buffer as UTF-8
  const utf8Str = buff.toString("utf-8");

  return utf8Str;
};

const convertToIpfsUrl = (ipfsUrl) => {
  return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
};
