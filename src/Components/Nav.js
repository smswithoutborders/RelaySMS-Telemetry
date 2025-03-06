import React, { useState } from "react";
import {
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Box,
	Typography,
	useTheme,
	Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { FaCircleQuestion, FaHeadphones, FaTable, FaTableCells } from "react-icons/fa6";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ChevronRight } from "@mui/icons-material";

const Navbar = ({ onToggle = () => {} }) => {
	const [open, setOpen] = useState(false);
	const theme = useTheme();

	const handleToggle = () => {
		setOpen(!open);
		onToggle(!open);
	};

	return (
		<>
			<IconButton
				onClick={handleToggle}
				sx={{
					position: "fixed",
					top: 10,
					left: 10,
					color: "inherit",
					zIndex: 1200,
					["@media (max-width: 600px)"]: {
						display: "none"
					}
				}}
			>
				<MenuIcon />
			</IconButton>

			<Drawer anchor="left" open={open} onClose={handleToggle}>
				<Box sx={{ width: 250, display: "flex", flexDirection: "column", height: "100%" }}>
					<Box
						sx={{
							padding: 4,
							display: "flex",
							justifyContent: "center",
							alignItems: "center"
						}}
						onClick={handleToggle}
					>
						<Typography variant="h6" component="div">
							<Box
								component="img"
								src={theme.palette.mode === "dark" ? "/SWOB-Dark Theme.png" : "/SWOB-Default.png"}
								sx={{ width: "70%" }}
							/>
						</Typography>
					</Box>

					{/* Main Links */}
					<List>
						<ListItem button onClick={handleToggle}>
							<ListItemButton component={Link} to="/">
								<ListItemIcon>
									<FaTableCells />
								</ListItemIcon>
								<ListItemText primary="Open Telemetry" />
							</ListItemButton>
						</ListItem>
						<ListItem button onClick={handleToggle}>
							<ListItemButton component={Link} to="/publication">
								<ListItemIcon>
									<FaTable />
								</ListItemIcon>
								<ListItemText primary="Publication" />
							</ListItemButton>
						</ListItem>

						<ListItem button onClick={handleToggle}>
							<ListItemButton component={Link} to="/Reliability">
								<ListItemIcon>
									<FaTableCells />
								</ListItemIcon>
								<ListItemText primary="Reliability" />
							</ListItemButton>
						</ListItem>
						<ListItem button onClick={handleToggle}>
							<ListItemButton component={Link} to="/resilience">
								<ListItemIcon>
									<FaTable />
								</ListItemIcon>
								<ListItemText primary="Resilience" />
							</ListItemButton>
						</ListItem>

						<ListItem button onClick={handleToggle}>
							<ListItemButton component={Link} to="/help">
								<ListItemIcon>
									<FaCircleQuestion />
								</ListItemIcon>
								<ListItemText primary="Support" />
							</ListItemButton>
						</ListItem>
						<ListItem button onClick={handleToggle}>
							<ListItemButton component={Link} to="/contact">
								<ListItemIcon>
									<FaHeadphones />
								</ListItemIcon>
								<ListItemText primary="Contact" />
							</ListItemButton>
						</ListItem>
					</List>

					{/* Blog Link at the bottom */}
					<Box sx={{ marginTop: "auto", padding: 2 }}>
						<ListItem button onClick={handleToggle}>
							<ListItemText primary="Visit Our Blog" />
						</ListItem>
						<Button
							component="a"
							href="https://blog.smswithoutborders.com/"
							rel="noreferrer"
							target="_blank"
							variant="contained"
							sx={{ mt: 2, borderRadius: "50px", textTransform: "none" }}
						>
							Read more <ChevronRight />
						</Button>
					</Box>
				</Box>
			</Drawer>
		</>
	);
};

export default Navbar;
