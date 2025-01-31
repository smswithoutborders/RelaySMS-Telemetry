import React, { useState } from "react";
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	IconButton,
	Typography,
	Tooltip,
	Button,
	useMediaQuery
} from "@mui/material";
import { NavLink } from "react-router-dom";
import {
	FaArrowLeft,
	FaArrowRight,
	FaEnvelope,
	FaRegHandshake,
	FaShieldAlt,
	FaBroadcastTower,
	FaPhoneAlt
} from "react-icons/fa";
import { ChevronRight } from "@mui/icons-material";

const drawerWidth = 200;

function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleToggle = () => {
		setIsCollapsed(!isCollapsed);
	};

	// Media query to detect mobile and tablet screens
	const isMobileOrTablet = useMediaQuery((theme) => theme.breakpoints.down("md"));

	const menuItems = [
		{ text: "Reliability", icon: <FaRegHandshake />, link: "/" },
		{ text: "Resilience", icon: <FaShieldAlt />, link: "/resilience" },
		{ text: "Open Telemetry", icon: <FaBroadcastTower />, link: "/OpenTelemetry" }
	];

	const serviceItems = [
		{ text: "Help", icon: <FaEnvelope />, link: "/help" },
		{ text: "Contact Us", icon: <FaPhoneAlt />, link: "/contact" }
	];

	return (
		<Box sx={{ display: "flex" }}>
			{/* Hide the Drawer on mobile and tablet */}
			<Drawer
				variant="permanent"
				sx={{
					width: isMobileOrTablet ? 0 : isCollapsed ? 40 : drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: isMobileOrTablet ? 0 : isCollapsed ? 60 : drawerWidth,
						boxSizing: "border-box",
						transition: "width 0.3s",
						backdropFilter: "blur(10px)",
						borderRight: "1px solid rgba(255, 255, 255, 0.5)"
					}
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						height: "100%",
						justifyContent: "space-between"
					}}
				>
					{/* Header */}
					<Box sx={{ padding: 2, display: "flex", alignItems: "center" }}>
						{!isCollapsed && !isMobileOrTablet && (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									flexGrow: 1
								}}
							>
								<Box
									component="img"
									src="/SWOB-Default.png"
									alt="Profile"
									sx={{
										width: 130,
										height: 40,
										marginRight: 1
									}}
								/>
							</Box>
						)}
						<IconButton onClick={handleToggle}>
							{isCollapsed ? (
								<FaArrowRight sx={{ color: "#000158" }} />
							) : (
								<FaArrowLeft sx={{ color: "#000158" }} />
							)}
						</IconButton>
					</Box>

					{/* Menu Section */}
					<Box sx={{ paddingBottom: 30 }}>
						<Typography sx={{ paddingLeft: 2, color: "#000158" }}>Menus</Typography>
						<List>
							{menuItems.map((item, index) => (
								<Tooltip title={isCollapsed ? item.text : ""} placement="right" key={index}>
									<ListItem
										button
										component={NavLink}
										to={item.link}
										sx={{
											padding: "10px",
											justifyContent: isCollapsed ? "center" : "flex-start"
										}}
									>
										<ListItemIcon
											sx={{
												minWidth: 0,
												marginRight: isCollapsed ? 0 : 2,
												justifyContent: "center",
												color: "#000158"
											}}
										>
											{item.icon}
										</ListItemIcon>
										{!isCollapsed && <ListItemText primary={item.text} />}
									</ListItem>
								</Tooltip>
							))}
						</List>

						<Typography sx={{ paddingLeft: 2, color: "#000158" }}>Contact</Typography>
						<List>
							{serviceItems.map((item, index) => (
								<Tooltip title={isCollapsed ? item.text : ""} placement="right" key={index}>
									<ListItem
										button
										component={NavLink}
										to={item.link}
										style={({ isActive }) => ({
											padding: "10px",
											justifyContent: isCollapsed ? "center" : "flex-start",
											backgroundColor: isActive ? "rgba(0, 123, 255, 0.2)" : "transparent"
										})}
									>
										<ListItemIcon
											sx={{
												minWidth: 0,
												marginRight: isCollapsed ? 0 : 2,
												justifyContent: "center",
												color: "#000158"
											}}
										>
											{item.icon}
										</ListItemIcon>
										{!isCollapsed && <ListItemText primary={item.text} />}
									</ListItem>
								</Tooltip>
							))}
						</List>
					</Box>

					{/* Footer */}
					<Box sx={{ paddingBottom: 10 }}>
						<ListItem
							button
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								backgroundColor: "rgba(97, 112, 196, 0.1)",
								borderRadius: 2,
								boxShadow: "1px 1px 10px rgba(102, 99, 99, 0.1)"
							}}
						>
							{!isCollapsed && !isMobileOrTablet && (
								<>
									<Typography variant="body2" sx={{ marginTop: 1, color: "#000158" }}>
										Check out RelaySMS blog posts
									</Typography>
									<Typography variant="caption" color="textSecondary">
										<Button
											component="a"
											href="https://blog.smswithoutborders.com/"
											rel="noreferrer"
											target="_blank"
											variant="contained"
											sx={{
												mt: 2,
												borderRadius: "50px",
												textTransform: "none",
												backgroundColor: "#000158"
											}}
										>
											Read more <ChevronRight />
										</Button>
									</Typography>
								</>
							)}
						</ListItem>
					</Box>
				</Box>
			</Drawer>
		</Box>
	);
}

export default Sidebar;
