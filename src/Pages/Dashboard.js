import { Box, Button, Card, Grid, Typography } from "@mui/material";
import React from "react";
import TheTable from "../Components/Table";
import FreeSolo from "../Components/SearchInput";

export default function Dashboard() {
  return (
    <Box
      className="bg"
      component="main"
      sx={{
        px: 3,
      }}
    >
      <Grid container sx={{ p: 2, display: { md: "flex", xs: "none" } }}>
        <Grid item md={2}></Grid>
        <Grid item md={10}>
          <Grid container columnSpacing={4} sx={{ py: 5 }}>
            <Grid item md={4}>
              <Card className="card" sx={{ p: 5, borderRadius: "20px" }}>
                <Typography variant="h6">👋🏽 Welcome!</Typography>
                <Typography variant="boby1" justifyContent="">
                  Let’s find the most reliable gateway client for you
                </Typography>
              </Card>
            </Grid>
            <Grid item md={3}>
              <Card className="cards" sx={{ p: 4.5, borderRadius: "20px" }}>
                <Typography variant="h6">Total Tests</Typography>
                <Typography variant="h3">95</Typography>
              </Card>
            </Grid>
            <Grid item md={3}>
              <Card className="cards" sx={{ p: 4.5, borderRadius: "20px" }}>
                <Typography variant="h6">Resiliance Score</Typography>
                <Typography variant="h3">80%</Typography>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ pb: 4 }}>
            <Grid container columnSpacing={4} sx={{ py: 5 }}>
              <Grid item md={3}>
                <FreeSolo />
              </Grid>
              <Grid item md={3}>
                <FreeSolo />
              </Grid>
              <Grid item md={3}>
                <FreeSolo />
              </Grid>
              <Grid item md={3}>
                <Button
                  sx={{ p: 1 }}
                  autoFocus
                  color="success"
                  variant="contained"
                >
                  Download Data
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box className="cards">
            <Grid container>
              <Grid item md={12}>
                <TheTable />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {/* Mobile View */}
      <Box sx={{ display: { md: "none", xs: "block" } }}>
        <Grid container columnSpacing={4} rowSpacing={4} sx={{ py: 2, mt: 4 }}>
          <Grid item xs={12}>
            <Card className="card" sx={{ p: 5, borderRadius: "20px" }}>
              <Typography variant="h6">👋🏽 Welcome!</Typography>
              <Typography variant="boby1" justifyContent="">
                Let’s find the most reliable gateway client for you
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card className="cards" sx={{ p: 4.5, borderRadius: "20px" }}>
              <Typography variant="h6">Total Tests</Typography>
              <Typography variant="h3">95</Typography>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card className="cards" sx={{ p: 4.5, borderRadius: "20px" }}>
              <Typography variant="h6">Resiliance Score</Typography>
              <Typography variant="h3">80%</Typography>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ py: 3 }}>
          <Box sx={{ pb: 4 }}>
            <Grid container columnSpacing={4} rowSpacing={4} sx={{ py: 5 }}>
              <Grid item xs={6}>
                <FreeSolo />
              </Grid>
              <Grid item xs={6}>
                <FreeSolo />
              </Grid>
              <Grid item xs={6}>
                <FreeSolo />
              </Grid>
              <Grid item xs={6}>
                <Button
                  sx={{ p: 1 }}
                  autoFocus
                  color="success"
                  variant="contained"
                >
                  Download Data
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box className="cards">
          <Grid container>
            <Grid item xs={12}>
              <TheTable />
            </Grid>
            <Grid
              item
              xs={12}
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
      </Box>
    </Box>
  );
}
