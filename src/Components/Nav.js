import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { FaChartSimple, FaHouse } from "react-icons/fa6";
import { Divider } from "@mui/material";

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ bgcolor: "transparent" }}>
      <Box display="flex" sx={{ p: 3 }}>
        <Box component="img" src="/logo.png" sx={{ width: "35px" }} />
        <Typography variant="body1" sx={{ px: 1, pt: 1, fontWeight: 600 }}>
          RelaySMS
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem>
          <ListItemButton component="a" to="/">
            <ListItemIcon>
              <FaHouse />
            </ListItemIcon>
            <ListItemText> Dashboard </ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component="a" to="/charts">
            <ListItemIcon>
              <FaChartSimple />
            </ListItemIcon>
            <ListItemText> Charts </ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", bgcolor: "transparent" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "transparent",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "transparent",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
