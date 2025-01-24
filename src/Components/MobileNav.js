import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link } from "react-router-dom";

function MobileNav({ darkMode, toggleDarkMode }) {
	const [anchorElNav, setAnchorElNav] = React.useState(null);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	return (
		<nav
			style={{
				position: "fixed",
				top: 0,
				width: "100%",
				backgroundColor: darkMode ? "#333" : "#fff",
				boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
				zIndex: 1100
			}}
		>
			<Container
				maxWidth="sm"
				sx={{
					display: { xs: "flex", md: "none" },
					justifyContent: "space-between",
					alignItems: "center",
					py: 1
				}}
			>
				<Box display="flex" alignItems="center">
					<Typography
						variant="body1"
						sx={{
							fontWeight: 600,
							px: 2,
							color: darkMode ? "#fff" : "#000",
							fontSize: "1.25rem"
						}}
					>
						SWOB Dashboard
					</Typography>
				</Box>

				<Box sx={{ display: "flex", alignItems: "center" }}>
					<IconButton
						size="large"
						aria-label="menu"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						onClick={handleOpenNavMenu}
						color="inherit"
					>
						<MenuIcon />
					</IconButton>

					<IconButton
						onClick={toggleDarkMode}
						sx={{ ml: 2 }}
						aria-label={darkMode ? "Light Mode" : "Dark Mode"}
						color="inherit"
					>
						{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
					</IconButton>
				</Box>
			</Container>

			<Menu
				id="menu-appbar"
				anchorEl={anchorElNav}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				open={Boolean(anchorElNav)}
				onClose={handleCloseNavMenu}
				sx={{
					display: { xs: "block", md: "none" }
				}}
			>
				<MenuItem onClick={handleCloseNavMenu} component={Link} to="/">
					<Typography textAlign="center">Reliability</Typography>
				</MenuItem>

				<MenuItem onClick={handleCloseNavMenu} component={Link} to="/resilience">
					<Typography textAlign="center">Resilience</Typography>
				</MenuItem>

				<MenuItem onClick={handleCloseNavMenu} component={Link} to="/OpenTelemetry">
					<Typography textAlign="center">Open Telemetry</Typography>
				</MenuItem>

				<MenuItem onClick={handleCloseNavMenu} component={Link} to="/help">
					<Typography textAlign="center">Help</Typography>
				</MenuItem>

				<MenuItem onClick={handleCloseNavMenu} component={Link} to="/contact">
					<Typography textAlign="center">Contact</Typography>
				</MenuItem>
			</Menu>
		</nav>
	);
}

export default MobileNav;
