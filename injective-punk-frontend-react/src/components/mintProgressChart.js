import { BUTTON_COLOR, DIVIDER_COLOR } from "../config-global";
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

const CUTOUT_PERCENT = 100 / 3;

export default function MintProgressChart({ totalCount, mintedCount }) {
  const [chartData, setChartData] = useState({
    labels: ["", "", ""],
    datasets: [
      {
        data: [0, 100 - CUTOUT_PERCENT, CUTOUT_PERCENT],
        backgroundColor: ["#ffffff", "#808080", "transparent"],
        borderWidth: [0, 0, 0],
      },
    ],
  });

  useEffect(() => {
    let mintedPercent = (mintedCount * (100 - CUTOUT_PERCENT)) / totalCount;
    setChartData({
      labels: ["", "", ""],
      datasets: [
        {
          data: [
            mintedPercent,
            100 - CUTOUT_PERCENT - mintedPercent,
            CUTOUT_PERCENT,
          ],
          backgroundColor: [BUTTON_COLOR, DIVIDER_COLOR, "transparent"],
          borderWidth: [0, 0, 0],
        },
      ],
    });
  }, [totalCount, mintedCount]);

  const options = {
    rotation: ((90 + CUTOUT_PERCENT * 1.8) * Math.PI) / 180,
    maintainAspectRatio: false,
    aspectRatio: 1,
    cutoutPercentage: 90,
    legend: {
      position: "bottom",
      display: false,
    },
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
    },
    elements: {
      arc: {
        borderWidth: 1,
        borderAlign: "outer",
        borderCapStyle: "butt",
      },
    },
    tooltips: {
      enabled: false,
    },
  };

  return (
    <Box
      sx={{
        position: "relative",
        // border: "1px solid black",
        aspectRatio: "1",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          aspectRatio: "1",
          top: "5%",
          // backgroundColor: "cyan",
        }}
      >
        <Doughnut data={chartData} options={options} />
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "36px",
            fontWeight: "700",
          }}
        >
          {parseFloat((mintedCount * 100) / totalCount).toFixed(2)} %
        </Typography>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "500",
          }}
        >{`${mintedCount} / ${totalCount}`}</Typography>
      </Box>
    </Box>
  );
}
