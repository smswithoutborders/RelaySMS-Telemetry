import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import {
	FaFacebook,
	FaGithub,
	FaGitlab,
	FaGooglePlay,
	FaLinkedin,
	FaRegEnvelope,
	FaTiktok,
	FaXTwitter
} from "react-icons/fa6";

export default function Contact() {
	return (
		<Grid container sx={{ px: { md: 10, xs: 2 }, py: { md: 10, xs: 10 } }}>
			<Grid item md={2}></Grid>
			<Grid item md={10}>
				<Typography variant="h4" sx={{ fontWeight: 600, pb: 3 }}>
					Get connected
				</Typography>
				<Box>
					<Typography variant="h6" sx={{ fontWeight: 600, py: 3 }}>
						Connect with us on our socials
					</Typography>

					<Box sx={{ pb: 2 }}>
						<FaXTwitter /> - @smswithoutborders
					</Box>
					<Box sx={{ py: 2 }}>
						<FaFacebook /> - @smswithoutborders_swob
					</Box>
					<Box sx={{ py: 2 }}>
						<FaLinkedin /> - @smswithoutborders
					</Box>
					<Box sx={{ py: 2 }}>
						<FaTiktok /> - @smswithoutborders
					</Box>
				</Box>
				{/*  */}
				<Box>
					<Typography variant="h6" sx={{ fontWeight: 600, py: 3 }}>
						Connect with us for work
					</Typography>

					<Box sx={{ pb: 2 }}>
						<FaGithub /> - SMSWithoutBorders
					</Box>
					<Box sx={{ py: 2 }}>
						<FaGitlab /> -SMSWithoutBorders
					</Box>
					<Box sx={{ py: 2 }}>
						<FaGooglePlay /> - SWOB
					</Box>
					<Box sx={{ py: 2 }}>
						<FaRegEnvelope /> - developers@smswithoutborders.com
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
}
