import {
  Box,
  Grid,
  Typography,
  Toolbar,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Button,
  Dialog,
  ListItemButton,
  Divider,
  ListItemText,
  Slide,
  IconButton,
  List,
  AppBar,
} from "@mui/material";
import React from "react";
import TheTable from "../Components/Table";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DialogTable from "../Components/TableDialog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Dashboard() {
  const [age, setAge] = React.useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      className="bg"
      component="main"
      sx={{
        // flexGrow: 1,
        px: 3,
        // width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar />
      <Grid container sx={{ p: 2 }}>
        <Grid item md={2}></Grid>
        <Grid item md={10}>
          <Grid container columnSpacing={4}>
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
          {/*  */}
          <Box sx={{ py: 5 }}>
            <Typography>Filters:</Typography>
            <Grid container columnSpacing={4}>
              <Grid item md={3}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Country</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={3}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Operator
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={3}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Resiliance
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={3}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ width: "60%", height: "53px" }}
                >
                  Download Data
                </Button>
              </Grid>
            </Grid>
          </Box>
          {/*  */}
          <Box className="cards">
            <Grid container>
              <Grid item md={8}>
                <TheTable handleClickOpen={handleClickOpen} />
                {/* Dialog */}
                <React.Fragment>
                  <Dialog
                    fullScreen
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                    sx={{ p: 5 }}
                  >
                    <AppBar sx={{ position: "relative" }}>
                      <Toolbar className="cards">
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={handleClose}
                          aria-label="close"
                        >
                          <CloseIcon />
                        </IconButton>
                        <Typography
                          sx={{ ml: 2, flex: 1 }}
                          variant="h6"
                          component="div"
                        >
                          Test Breakdown
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                          Download
                        </Button>
                      </Toolbar>
                    </AppBar>
                    <DialogTable />
                  </Dialog>
                </React.Fragment>
                {/* Dialog End*/}
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
