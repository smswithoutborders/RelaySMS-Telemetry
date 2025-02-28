import React from "react";
import { Box, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { FaCircleQuestion } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Toggle({ darkMode, toggleDarkMode }) {
	return (
		<>
			<Box
				component="nav"
				sx={{
					display: { md: "flex", xs: "none", sm: "none" },
					justifyContent: "space-between",
					py: 3,
					mx: 5,
					position: "fixed",
					right: 0
				}}
			>
				<IconButton component={Link} to="/help">
					<FaCircleQuestion />
				</IconButton>
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
		</>
	);
}
