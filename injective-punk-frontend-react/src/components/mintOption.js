import React, { useState } from "react";
import { Box, Button, Slider, Typography } from "@mui/material";
import {
  BACKGROUND_COLOR,
  BUTTON_COLOR,
  GLOBAL_TEXT_COLOR,
  INPUT_BORDER_COLOR,
  MINT_BALANCE_PER_NFT,
  MINT_LIMIT_COUNT_PER_WALLET,
} from "../config-global";

export default function MintOption({ onMintNft, onCancel, mintedCount }) {
  const [mintCount, setMintCount] = useState(1);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "320px",
        backgroundColor: BACKGROUND_COLOR,
        border: `2px solid ${INPUT_BORDER_COLOR}`,
        padding: "15px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ".MuiTypography-root": {
          color: GLOBAL_TEXT_COLOR,
        },
      }}
    >
      <Typography
        sx={{
          fontSize: { sm: "28px", xs: "24px" },
          fontWeight: "700",
          marginBottom: { sm: "10px", xs: "5px" },
        }}
      >
        MINT NFT
      </Typography>
      <Typography
        sx={{
          fontSize: { sm: "16px", xs: "14px" },
          fontWeight: "400",
        }}
      >
        You can mint up to {MINT_LIMIT_COUNT_PER_WALLET} tokens and the price
        per NFT is {MINT_BALANCE_PER_NFT} INJ.
      </Typography>
      <Box
        sx={{
          margin: { sm: "12px 0", xs: "6px 0" },
          width: { sm: "110px", xs: "90px" },
          aspectRatio: "1",
          borderRadius: "60px",
          background: INPUT_BORDER_COLOR,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: `${BACKGROUND_COLOR} !important`,
            fontSize: { sm: "18px", xs: "14px" },
            fontWeight: "700",
          }}
        >
          {mintedCount} / {MINT_LIMIT_COUNT_PER_WALLET}
        </Typography>
      </Box>
      {MINT_LIMIT_COUNT_PER_WALLET - mintedCount > 0 && (
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Slider
            sx={{
              color: GLOBAL_TEXT_COLOR,
            }}
            min={1}
            max={MINT_LIMIT_COUNT_PER_WALLET - mintedCount}
            step={1}
            marks
            value={mintCount}
            onChange={(e) => setMintCount(e.target.value)}
          />
        </Box>
      )}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          ".MuiTypography-root": {
            fontSize: { sm: "16px", xs: "14px" },
            fontWeight: "400",
          },
        }}
      >
        <Typography>
          Mint {mintCount} token{mintCount > 0 && "s"}
        </Typography>
        <Typography>
          {parseFloat(mintCount * MINT_BALANCE_PER_NFT).toFixed(2)} INJ
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          ".MuiButton-root": {
            width: "40%",
            borderRadius: "0",
            textTransform: "none",
            border: `1px solid ${BUTTON_COLOR}`,
            fontSize: { sm: "16px", xs: "12px" },
          },
        }}
      >
        {MINT_LIMIT_COUNT_PER_WALLET - mintedCount > 0 && (
          <Button
            sx={{
              marginRight: "5px",
              color: BACKGROUND_COLOR,
              background: BUTTON_COLOR,
              ":hover": {
                color: BACKGROUND_COLOR,
                background: BUTTON_COLOR,
              },
            }}
            onClick={() => onMintNft(mintCount)}
          >
            Mint
          </Button>
        )}
        <Button
          sx={{
            color: BUTTON_COLOR,
            background: "transparent",
          }}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
