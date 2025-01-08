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
import { FaCircleQuestion, FaHeadphones, FaTable, FaTableCells } from "react-icons/fa6";
import { Button, Divider, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";

const drawerWidth = 240;

function ResponsiveDrawer() {
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
							<FaTableCells />
						</ListItemIcon>
						<ListItemText>Reliability</ListItemText>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton component={Link} to="/resilience">
						<ListItemIcon>
							<FaTable />
						</ListItemIcon>
						<ListItemText>Resilience</ListItemText>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton component={Link} to="/OpenTelematry">
						<ListItemIcon>
							<FaTable />
						</ListItemIcon>
						<ListItemText>Open Telematry</ListItemText>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton component={Link} to="/help">
						<ListItemIcon>
							<FaCircleQuestion />
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
							"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
						}}
						open
					>
						{drawer}
					</Drawer>
				</Box>
			</Box>
		</>
	);
}

ResponsiveDrawer.propTypes = {
	window: PropTypes.func
};

export default ResponsiveDrawer;
