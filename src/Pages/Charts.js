import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Grid, Typography, Box } from "@mui/material";

const data = [
  { value: 70, label: "Cameroon" },
  { value: 80, label: "Senegal" },
  { value: 100, label: "Singapore" },
];

const operatordata = [
  { value: 70, label: "T-Mobile" },
  { value: 80, label: "MTN" },
  { value: 100, label: "Airtel" },
  { value: 50, label: "Camtel" },
];

const size = {
  width: 400,
  height: 200,
};

export default function Chart() {
  return (
    <Grid container sx={{ p: 3 }}>
      <Grid item md={2}></Grid>
      <Grid item md={9}>
        <Box>
          <Typography variant="h6" sx={{ py: 2 }}>
            Most Reliable gateway clients by country:
          </Typography>
          <PieChart series={[{ data }]} {...size} />
        </Box>
        {/*  */}
        <Box>
          <Typography variant="h6" sx={{ py: 2 }}>
            Most Reliable gateway clients by operator:
          </Typography>
          <PieChart series={[{ data: operatordata }]} {...size} />
        </Box>
      </Grid>
    </Grid>
  );
}
