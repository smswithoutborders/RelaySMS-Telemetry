import { Box, Divider, Grid, Typography, useTheme, IconButton } from "@mui/material";
import React from "react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { SiBluesky } from "react-icons/si";

export default function Footer() {
	const theme = useTheme();
	const isDarkMode = theme.palette.mode === "dark";

	return (
		<Box
			component="footer"
			sx={{
				px: { md: 6, sm: 4, xs: 2 },
				py: 3,
				background: isDarkMode ? "#1e1e1e" : "#f5f5f5",
				color: isDarkMode ? "#fff" : "#333",
				textAlign: "center"
			}}
		>
			<Grid container spacing={4} alignItems="center" justifyContent="space-between">
				<Grid item xs={12} md={6} textAlign={{ xs: "center", md: "left" }}>
					<Box
						display="flex"
						alignItems="center"
						gap={2}
						justifyContent={{ xs: "center", md: "flex-start" }}
					>
						<Box
							component="img"
							src={theme.palette.mode === "dark" ? "/Logo.png" : "/Logo.png"}
							sx={{ width: "50px", height: "50px" }}
						/>
						<Box textAlign={{ xs: "center", md: "left" }}>
							<Typography
								variant="h6"
								sx={{ fontWeight: "bold", color: isDarkMode ? "#f5f5f5" : "#000158" }}
							>
								SMSWithoutBorders
							</Typography>
							<Typography
								variant="body2"
								sx={{ opacity: 0.7, color: isDarkMode ? "#f5f5f5" : "#000158" }}
							>
								Connecting the world, one message at a time.
							</Typography>
						</Box>
					</Box>
				</Grid>
				<Grid item xs={12} md={6} textAlign={{ xs: "center", md: "right" }}>
					<Box display="flex" justifyContent={{ xs: "center", md: "flex-end" }} gap={2}>
						<IconButton
							component="a"
							href="https://github.com/smswithoutborders"
							target="_blank"
							rel="noopener noreferrer"
							sx={{
								color: isDarkMode ? "#f5f5f5" : "#000158",
								transition: "0.3s",
								"&:hover": { color: "#B85900" }
							}}
						>
							<FaGithub size="24px" />
						</IconButton>
						<IconButton
							component="a"
							href="https://twitter.com/SwobOutreach"
							target="_blank"
							rel="noopener noreferrer"
							sx={{
								color: isDarkMode ? "#f5f5f5" : "#000158",
								transition: "0.3s",
								"&:hover": { color: "#B85900" }
							}}
						>
							<FaXTwitter size="24px" />
						</IconButton>
						<IconButton
							component="a"
							href="https://bsky.app/profile/smswithoutborders.bsky.social"
							target="_blank"
							rel="noopener noreferrer"
							sx={{
								color: isDarkMode ? "#f5f5f5" : "#000158",
								transition: "0.3s",
								"&:hover": { color: "#B85900" }
							}}
						>
							<SiBluesky size="24px" />
						</IconButton>
					</Box>
				</Grid>
			</Grid>
			<Divider sx={{ width: "100%", backgroundColor: "#D1D1D6", my: 3 }} />
			<Typography variant="body2" sx={{ opacity: 0.7 }}>
				© {new Date().getFullYear()} SMSWithoutBorders.
			</Typography>
		</Box>
	);
}
