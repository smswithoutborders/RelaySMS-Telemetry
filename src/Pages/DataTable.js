import { Box } from "@mui/material";
import React from "react";

export default function DataTable() {
  return (
    <React.Fragment>
      <Box
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
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Test Breakdown
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Download
            </Button>
          </Toolbar>
        </AppBar>
        <DialogTable />
      </Box>
    </React.Fragment>
  );
}
