import React, { useState } from "react";
import { Box, IconButton, Typography, Grid } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { FaCircleQuestion, FaCircleXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";
const drawerWidth = 240;

export default function Toggle({ darkMode, toggleDarkMode }) {
	const [showMessage, setShowMessage] = useState(true);

	const handleCloseMessage = () => {
		setShowMessage(false);
	};

	return (
		<>
			{showMessage && (
				<Grid container sx={{ p: 2 }} justifyContent="center" alignItems="center" direction="row">
					<Grid
						item
						lg={2}
						md={3}
						xs={0}
						sm={3}
						sx={{
							display: { xs: "none", sm: "none", md: "block" },
							"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
						}}
					></Grid>
					<Grid
						mx="auto"
						item
						lg={10}
						md={9}
						xs={12}
						sm={12}
						sx={{
							px: { md: 3, sm: 2, xs: 0 },
							width: { sm: `calc(100% - ${drawerWidth}px)`, md: `calc(100% - ${drawerWidth}px)` }
						}}
					>
						<Box
							sx={{
								top: 0,
								left: 0,
								right: 0,
								backgroundColor: "green",
								p: { md: 1, xs: 2 },
								mt: { md: 0, xs: 1 },
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								color: "white"
							}}
						>
							<Typography variant="body1">
								Don&apos;t know how to use this dashboard?{" "}
								<Link to="/help" style={{ textDecoration: "underline" }}>
									Get started here
								</Link>{" "}
							</Typography>
							<IconButton
								onClick={handleCloseMessage}
								aria-label="Close message"
								sx={{ color: "white" }}
							>
								<FaCircleXmark />
							</IconButton>
						</Box>
					</Grid>
				</Grid>
			)}
			<Box
				component="nav"
				sx={{
					display: { md: "flex", xs: "none", sm: "none" },
					justifyContent: "space-between",
					py: 3,
					mx: 5,
					position: "fixed",
					right: 0,
					top: showMessage ? "60px" : 0
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
