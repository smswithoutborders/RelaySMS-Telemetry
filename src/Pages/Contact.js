import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { FaFacebook, FaGithub, FaGooglePlay, FaRegEnvelope, FaXTwitter } from "react-icons/fa6";

export default function Contact() {
	return (
		<Grid container justifyContent="center" sx={{ px: { md: 10, xs: 2 }, py: { md: 15, xs: 10 } }}>
			<Grid item md={2}></Grid>
			<Grid item md={10}>
				<Typography variant="h4" sx={{ fontWeight: 600, pb: 8 }}>
					Get connected
				</Typography>
				<Box>
					<Box sx={{ pb: 2 }}>
						<a href="https://twitter.com/SwobOutreach" rel="noreferrer" target="_blank">
							<FaXTwitter />
						</a>{" "}
						- @smswithoutborders
					</Box>
					<Box sx={{ py: 2 }}>
						<a
							href="https://web.facebook.com/SMSWithoutBorders?_rdc=1&_rdr"
							rel="noreferrer"
							target="_blank"
						>
							<FaFacebook />
						</a>{" "}
						- @smswithoutborders_swob
					</Box>

					<Box sx={{ py: 2 }}>
						<a href="https://github.com/smswithoutborders" rel="noreferrer" target="_blank">
							<FaGithub />
						</a>{" "}
						- SMSWithoutBorders
					</Box>

					<Box sx={{ py: 2 }}>
						<a
							href="https://play.google.com/store/apps/developer?id=Afkanerd"
							rel="noreferrer"
							target="_blank"
						>
							<FaGooglePlay />
						</a>{" "}
						- SWOB
					</Box>
					<Box sx={{ py: 2 }}>
						<a href="mailto:developers@smswithoutborders.com" rel="noreferrer" target="_blank">
							<FaRegEnvelope />
						</a>{" "}
						- developers@smswithoutborders.com
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
}
