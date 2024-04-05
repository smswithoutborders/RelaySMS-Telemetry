import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { FaChevronRight } from "react-icons/fa6";

export default function PageNotFound() {
	return (
		<Grid
			container
			justifyContent="center"
			alignItems="center"
			my="auto"
			textAlign="center"
			sx={{
				px: { md: 3, sm: 3, xs: 2 },
				pb: { md: 3, sm: 3, xs: 14 },
				height: "90vh",
				my: "auto"
			}}
		>
			<Grid item md={2} xs={12}></Grid>
			<Grid item md={10} xs={12} my="auto">
				<Box component="img" src="/pnf.svg" sx={{ width: "30%" }} />
				<Typography variant="h2" sx={{ fontWeight: 600 }}>
					Sorry the page you are looking for does not exist
				</Typography>
				<Typography variant="body1" sx={{ py: 3 }}>
					Let us get you back to the{" "}
					<a href="/" style={{ color: "#98B6F3" }}>
						{" "}
						table <FaChevronRight />
					</a>
				</Typography>
			</Grid>
		</Grid>
	);
}
