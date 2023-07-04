import {
  BACKGROUND_COLOR,
  BUTTON_COLOR,
  DIVIDER_COLOR,
  INPUT_BORDER_COLOR,
  INPUT_TEXT_COLOR,
  NFT_PROPERTY_BOX_BACKGROUND_COLOR,
  NFT_PROPERTY_BOX_BORDER_COLOR,
  NFT_TOKEN_ID,
  NFT_TOTAL_BALANCE,
} from "../config-global";

import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Input,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import { getNftInfo } from "../api/mirrorApiRequest";
import Loading from "../components/loading";

export default function Preview() {
  const [loadingView, setLoadingView] = useState(false);

  const [currentSerialNumber, setCurrentSerialNumber] = useState("");
  const [nftInfo, setNftInfo] = useState({});

  useEffect(() => {
    const init = async () => {
      setLoadingView(true);
      let newNftInfo = await getNftInfo(NFT_TOKEN_ID, 1);
      if (!newNftInfo.result) {
        toast.error(newNftInfo.error);
        setLoadingView(false);
        return;
      }
      setNftInfo(newNftInfo.data);
      setLoadingView(false);
    };
    init();
  }, []);

  const getNewNftInfo = async () => {
    setLoadingView(true);
    let newSerialNumber = currentSerialNumber;
    if (newSerialNumber < 1) newSerialNumber = 1;
    if (newSerialNumber > NFT_TOTAL_BALANCE)
      newSerialNumber = NFT_TOTAL_BALANCE;
    setCurrentSerialNumber(newSerialNumber);

    let newNftInfo = await getNftInfo(NFT_TOKEN_ID, newSerialNumber);
    if (!newNftInfo.result) {
      toast.error(newNftInfo.error);
      setLoadingView(false);
      return;
    }

    setNftInfo(newNftInfo.data);
    setLoadingView(false);
  };
  return (
    <>
      <Container
        sx={{
          padding: { sm: "24px", xs: "16px" },
        }}
      >
        <Box
          sx={{
            // border: "1px solid blue",
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            marginBottom: { sm: "20px", xs: "10px" },
          }}
        >
          <Input
            placeholder="Enter serial no"
            sx={{
              width: "180px",
              height: "32px",
              padding: "0 10px",
              border: `1px solid ${INPUT_BORDER_COLOR}`,
              backgroundColor: "transparent",
              color: INPUT_TEXT_COLOR,
              borderRadius: "0px",
              fontSize: "14px",
              "&::before": {
                display: "none",
              },
              "&::after": {
                display: "none",
              },
            }}
            type="number"
            value={currentSerialNumber}
            onChange={(e) => setCurrentSerialNumber(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getNewNftInfo();
              }
            }}
          />
          <IconButton
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "0",
              background: INPUT_BORDER_COLOR,
              color: BACKGROUND_COLOR,
              ":hover": {
                background: INPUT_BORDER_COLOR,
                color: BACKGROUND_COLOR,
              },
            }}
            onClick={getNewNftInfo}
          >
            <SearchIcon />
          </IconButton>
        </Box>
        <Grid container>
          <Grid
            item
            sm={7}
            xs={12}
            sx={{
              //   border: "1px solid purple",
              padding: { sm: "0 10px", xs: "0" },
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                aspectRatio: "1",
                border: `2px solid ${BUTTON_COLOR}`,
                borderRadius: "20px",
                maxWidth: "460px",
                backgroundImage: `url(${nftInfo.imageUrl})`,
                backgroundSize: "cover",
                backgroundColor: "#00a7f3",
                overflow: "hidden",
                img: {
                  width: "100%",
                },
              }}
            />
          </Grid>
          <Grid
            item
            sm={5}
            xs={12}
            sx={{
              ".MuiDivider-root": {
                margin: { sm: "20px 0", xs: "10px 0" },
                borderColor: DIVIDER_COLOR,
              },
            }}
          >
            <Typography
              sx={{
                marginTop: { sm: "0", xs: "10px" },
                fontSize: { sm: "28px", xs: "24px" },
                fontWeight: "700",
                marginBottom: { sm: "20px", xs: "10px" },
              }}
            >
              {nftInfo.name}
            </Typography>
            <Typography
              sx={{
                fontSize: { sm: "16px", xs: "14px" },
                fontWeight: "400",
              }}
            >
              {nftInfo.description}
            </Typography>
            <Divider />
            <Typography
              sx={{
                fontSize: { sm: "18px", xs: "16px" },
                fontWeight: "700",
                marginBottom: { sm: "8px", xs: "4px" },
              }}
            >
              Attributes
            </Typography>
            <Box
              sx={{
                ".MuiBox-root": {
                  border: `1px solid ${NFT_PROPERTY_BOX_BORDER_COLOR}`,
                  background: NFT_PROPERTY_BOX_BACKGROUND_COLOR,
                  padding: "5px",
                  margin: "0 5px 5px 0",
                  float: "left",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  ".MuiTypography-root": {
                    fontSize: { sm: "14px", xs: "12px" },
                  },
                  ".property-item": {
                    fontWeight: "700",
                  },
                  ".property-info": {
                    fontWeight: "400",
                  },
                },
              }}
            >
              {nftInfo?.attributes?.length > 0 &&
                nftInfo.attributes.map((item) => (
                  <Box>
                    <Typography className="property-item">
                      {item.trait_type}
                    </Typography>
                    <Typography className="property-info">
                      {item.value}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Backdrop open={loadingView}>
        <Loading />
      </Backdrop>
    </>
  );
}
