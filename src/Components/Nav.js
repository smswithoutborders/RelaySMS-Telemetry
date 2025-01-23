import React from "react";
import PropTypes from "prop-types";
import {
	Box,
	CssBaseline,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	Divider,
	Paper,
	useTheme,
	Button
} from "@mui/material";
import { FaCircleQuestion, FaHeadphones, FaTable, FaTableCells } from "react-icons/fa6";
import { Link } from "react-router-dom";

const drawerWidth = 280;

function ResponsiveDrawer() {
	const theme = useTheme();

	const drawer = (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				bgcolor: theme.palette.background.default,
				color: theme.palette.text.primary,
				boxShadow: theme.shadows[1],
				borderRadius: "0 16px 16px 0",
				overflow: "hidden"
			}}
		>
			{/* Header */}
			<Box
				display="flex"
				alignItems="center"
				sx={{
					p: 3,
					bgcolor: theme.palette.primary.main,
					color: theme.palette.primary.contrastText,
					borderRadius: "0 16px 0 0"
				}}
			>
				<Box component="img" src="/logo.png" sx={{ width: "40px", borderRadius: "50%" }} />
				<Typography variant="h6" sx={{ px: 2, fontWeight: "bold" }}>
					SWOB Dashboard
				</Typography>
			</Box>

			<Divider sx={{ my: 2 }} />

			{/* Navigation Links */}
			<List sx={{ flexGrow: 1, px: 1 }}>
				{[
					{ text: "Reliability", icon: <FaTableCells />, to: "/" },
					{ text: "Resilience", icon: <FaTable />, to: "/resilience" },
					{ text: "OpenTelemetry", icon: <FaTable />, to: "/OpenTelemetry" },
					{ text: "Help", icon: <FaCircleQuestion />, to: "/help" },
					{ text: "Contact", icon: <FaHeadphones />, to: "/contact" }
				].map((item, index) => (
					<ListItem key={index} disablePadding>
						<ListItemButton
							component={Link}
							to={item.to}
							sx={{
								borderRadius: "8px",
								mx: 2,
								my: 1,
								"&:hover": {
									bgcolor: theme.palette.action.hover
								}
							}}
						>
							<ListItemIcon sx={{ color: theme.palette.text.secondary }}>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>

			<Divider sx={{ my: 2 }} />

			{/* Footer */}
			<Box sx={{ p: 3 }}>
				<Paper
					elevation={2}
					sx={{
						p: 2,
						textAlign: "center",
						borderRadius: "12px",
						bgcolor: theme.palette.background.paper,
						color: theme.palette.text.primary
					}}
				>
					<Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
						Check out SMSWithoutBorders blog posts
					</Typography>
					<Button
						component="a"
						href="https://blog.smswithoutborders.com/"
						target="_blank"
						rel="noopener noreferrer"
						variant="contained"
						color="primary"
						sx={{ borderRadius: "50px", px: 3 }}
					>
						Read More
					</Button>
				</Paper>
			</Box>
		</Box>
	);

	return (
		<Box sx={{ display: { xs: "none", md: "flex" } }}>
			{" "}
			{/* Hide on mobile */}
			<CssBaseline />
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
						bgcolor: theme.palette.background.default,
						borderRight: `1px solid ${theme.palette.divider}`
					}
				}}
			>
				{drawer}
			</Drawer>
		</Box>
	);
}

ResponsiveDrawer.propTypes = {
	window: PropTypes.func
};

export default ResponsiveDrawer;
