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
import { FaChartSimple, FaHeadphones, FaHouse } from "react-icons/fa6";
import { AppBar, Button, IconButton, Divider, Paper, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const drawerWidth = 240;

function ResponsiveDrawer({ darkMode, toggleDarkMode }) {
	const drawer = (
		<Box
			sx={{
				bgcolor: "transparent",
				display: { md: "flex", xs: "none", sm: "none" },
				flexDirection: "column",
				height: "100%"
			}}
		>
			<Box display="flex" sx={{ p: 3 }}>
				<Box component="img" src="/logo.png" sx={{ width: "35px" }} />
				<Typography variant="body2" sx={{ px: 1, pt: 1, fontWeight: 600 }}>
					SMSWithoutBorders
				</Typography>
			</Box>
			<Divider />
			<List sx={{ flexGrow: 1 }}>
				<ListItem>
					<ListItemButton component={Link} to="/">
						<ListItemIcon>
							<FaHouse />
						</ListItemIcon>
						<ListItemText>Reliability</ListItemText>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton component={Link} to="/resilience">
						<ListItemIcon>
							<FaHouse />
						</ListItemIcon>
						<ListItemText>Resilience</ListItemText>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton component={Link} to="/help">
						<ListItemIcon>
							<FaChartSimple />
						</ListItemIcon>
						<ListItemText> Help </ListItemText>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton component={Link} to="/contact">
						<ListItemIcon>
							<FaHeadphones />
						</ListItemIcon>
						<ListItemText> Contact </ListItemText>
					</ListItemButton>
				</ListItem>
			</List>
			<Box
				component="footer"
				sx={{
					bottom: 0,
					justifyContent: "end",
					alignContent: "baseline",
					p: 2
				}}
			>
				<Paper elevation={3} sx={{ p: 2 }}>
					<Typography sx={{ py: 2 }}>Check out SMSWithoutBorders blog posts</Typography>
					<Button
						component="a"
						href="https://blog.smswithoutborders.com/"
						rel="noreferrer"
						target="_blank"
						variant="contained"
						sx={{ borderRadius: "50px", textTransform: "none" }}
					>
						Read more <ChevronRight />
					</Button>
				</Paper>
			</Box>
		</Box>
	);

	return (
		<>
			<Box sx={{ display: "flex", bgcolor: "transparent" }}>
				<CssBaseline />
				<Box component="nav">
					<Drawer
						variant="permanent"
						sx={{
							display: { xs: "none", sm: "none", md: "block" },
							"& .MuiDrawer-paper": {
								boxSizing: "border-box",
								width: drawerWidth,
								bgcolor: "transparent"
							}
						}}
						open
					>
						{drawer}
					</Drawer>
				</Box>
			</Box>
			<AppBar
				sx={{
					display: { md: "none", sx: "flex", sm: "flex" }
				}}
			>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Box display="flex">
						<Typography component={Link} to="/" sx={{ borderRadius: "50px", m: 1 }}>
							Reliability
						</Typography>
						<Typography component={Link} to="/resilience" sx={{ borderRadius: "50px", m: 1 }}>
							Resilience
						</Typography>
						<Typography component={Link} to="/help" sx={{ borderRadius: "50px", m: 1 }}>
							Help
						</Typography>

						<Typography component={Link} to="/contact" sx={{ borderRadius: "50px", m: 1 }}>
							Contact
						</Typography>
					</Box>
					<Box>
						<IconButton
							className="cards"
							onClick={toggleDarkMode}
							sx={{ ml: 2 }}
							aria-label={darkMode ? "Light Mode" : "Dark Mode"}
							color="inherit"
						>
							{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
		</>
	);
}

ResponsiveDrawer.propTypes = {
	window: PropTypes.func
};

export default ResponsiveDrawer;
