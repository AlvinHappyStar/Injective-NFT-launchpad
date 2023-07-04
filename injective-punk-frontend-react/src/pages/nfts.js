import React from "react";
import { Box, Container, Typography } from "@mui/material";

export default function Nfts() {
  return (
    <>
      <Container
        sx={{
          padding: { sm: "24px", xs: "16px" },
        }}
      >
        <Typography
          sx={{
            fontSize: { sm: "28px", xs: "24px" },
            fontWeight: "700",
          }}
        >
          Coming Soon!
        </Typography>
      </Container>
    </>
  );
}
