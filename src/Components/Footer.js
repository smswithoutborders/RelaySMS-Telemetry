import { Box, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { FaFacebook, FaGithub, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
	return (
		<Box component="footer" sx={{ position: "relative", bottom: 0 }}>
			<Grid container sx={{ p: 2 }}>
				<Grid item md={2}></Grid>

				<Grid item md={9}>
					<Divider sx={{ width: "100%" }} />
					<Box display="flex" justifyContent="space-between" sx={{ p: 3 }}>
						<Typography variant="body2">© {new Date().getFullYear()} SMSWithoutBorders</Typography>
						<Box justifyContent="end">
							<FaGithub size="20px" style={{ margin: 2 }} />{" "}
							<FaFacebook size="20px" style={{ margin: 2 }} />{" "}
							<FaXTwitter size="20px" style={{ margin: 2 }} />
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
