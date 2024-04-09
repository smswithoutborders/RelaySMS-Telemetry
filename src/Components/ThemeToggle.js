import { Box, IconButton } from "@mui/material";
import React from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function Toggle({ darkMode, toggleDarkMode }) {
	return (
		<Box
			component="nav"
			sx={{
				display: "flex",
				justifyContent: "space-between",
				py: 3,
				mx: 5,
				position: "fixed",
				right: 0
			}}
		>
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
	);
}
