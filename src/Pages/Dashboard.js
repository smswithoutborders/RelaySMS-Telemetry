import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import TheTable from "../Components/Table";

export default function Dashboard() {
  return (
    <Box
      className="bg"
      component="main"
      sx={{
        px: 3,
      }}
    >
      <Grid container sx={{ p: 2 }}>
        <Grid item md={2}></Grid>
        <Grid item md={10}>
          <Grid container columnSpacing={4} sx={{ py: 5 }}>
            <Grid item md={4}>
              <Box className="card" sx={{ p: 5, borderRadius: "20px" }}>
                <Typography variant="h6">👋🏽 Welcome!</Typography>
                <Typography variant="boby1" justifyContent="">
                  Let’s find the most reliable gateway client for you
                </Typography>
              </Box>
            </Grid>
            <Grid item md={3}>
              <Box className="cards" sx={{ p: 4.5, borderRadius: "20px" }}>
                <Typography variant="h6">Total Tests</Typography>
                <Typography variant="h3">95</Typography>
              </Box>
            </Grid>
            <Grid item md={3}>
              <Box className="cards" sx={{ p: 4.5, borderRadius: "20px" }}>
                <Typography variant="h6">Resiliance Score</Typography>
                <Typography variant="h3">80%</Typography>
              </Box>
            </Grid>
          </Grid>

          <Box className="cards">
            <Grid container>
              <Grid item md={8}>
                <TheTable />
              </Grid>
              <Grid
                item
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Box
                    component="img"
                    src="/map.png"
                    sx={{
                      width: "100%",
                      my: "auto",
                      display: "block",
                      mx: "auto",
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
