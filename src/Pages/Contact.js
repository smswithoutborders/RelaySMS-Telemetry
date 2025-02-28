import React from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { FaGithub, FaGooglePlay, FaRegEnvelope, FaXTwitter } from "react-icons/fa6";
import { useThemeContext } from "../Components/ThemeContext";

export default function Contact() {
	const { darkMode, toggleDarkMode } = useThemeContext();
	const theme = useTheme();

	const contacts = [
		{
			icon: <FaXTwitter size={40} />,
			label: "@smswithoutborders",
			link: "https://twitter.com/SwobOutreach"
		},
		{
			icon: <FaGithub size={40} />,
			label: "SMSWithoutBorders",
			link: "https://github.com/smswithoutborders"
		},
		{
			icon: <FaGooglePlay size={40} />,
			label: "SWOB",
			link: "https://play.google.com/store/apps/developer?id=Afkanerd"
		},
		{
			icon: <FaRegEnvelope size={40} />,
			label: "developers@smswithoutborders.com",
			link: "mailto:developers@smswithoutborders.com"
		}
	];

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			sx={{
				minHeight: "100vh",
				justifyContent: "center",
				px: { md: 12, xs: 5 },
				backgroundColor: theme.palette.background.default,
				background: darkMode ? "#70707B" : "white",
				color: "#000158",
				position: "relative",
				overflow: "hidden"
			}}
		>
			<Typography
				variant="h3"
				sx={{
					fontWeight: 900,
					pb: 4,
					textAlign: "center",
					fontSize: { xs: "2rem", md: "3rem" },
					letterSpacing: 2,
					color: darkMode ? "white" : "#000158",
					textShadow: "0 4px 6px rgba(0,0,0,0.5)",
					zIndex: 10
				}}
			>
				Connect With Us
			</Typography>

			<Box sx={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
				<IconButton onClick={toggleDarkMode} sx={{ color: "#fff" }}>
					{darkMode ? "🌙" : "🌞"}
				</IconButton>
			</Box>

			<Box
				display="flex"
				justifyContent="center"
				flexWrap="wrap"
				gap={4}
				sx={{
					zIndex: 10,
					color: "#000158",
					width: "100%",
					maxWidth: 1200,
					justifyContent: "center"
				}}
			>
				{contacts.map(({ icon, label, link }, index) => (
					<Box
						key={index}
						href={link}
						sx={{
							color: "#000158",
							textAlign: "center",
							position: "relative",
							width: { xs: "80%", sm: "45%", md: "25%" },
							transition: "transform 0.3s ease, box-shadow 0.3s ease",
							mb: 4,
							"&:hover": {
								transform: "scale(1.1)",
								boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
								cursor: "pointer",
								borderRadius: "20px"
							}
						}}
					>
						<a
							key={index}
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							style={{ textDecoration: "none" }}
						>
							<IconButton
								component="a"
								href={link}
								target="_blank"
								rel="noopener noreferrer"
								sx={{
									color: darkMode ? "white" : "#000158",
									fontSize: "2.5rem",
									width: 50,
									height: 50,
									borderRadius: "50%",
									mb: 4,
									transition: "transform 0.3s, color 0.3s ease",
									"&:hover": {
										transform: "scale(1.2)",
										color: "#ffcc00",
										boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
									}
								}}
							>
								{icon}
							</IconButton>
						</a>
						<a
							key={index}
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							style={{ textDecoration: "none" }}
						>
							<Typography
								variant="body1"
								href={link}
								sx={{
									fontSize: "1rem",
									color: darkMode ? "white" : "#000158",
									opacity: 0.8,
									textTransform: "camelcase",
									fontWeight: 500
								}}
							>
								{label}
							</Typography>
						</a>
					</Box>
				))}
			</Box>
		</Box>
	);
}
