import { Box, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { FaFacebook, FaGithub, FaXTwitter } from "react-icons/fa6";

const drawerWidth = 240;

export default function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				px: { md: 3, sm: 3, xs: 2 },
				pb: { md: 3, sm: 3, xs: 14 }
			}}
		>
			<Grid container sx={{ p: 2 }}>
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
					item
					lg={10}
					md={9}
					xs={12}
					sm={12}
					sx={{
						p: { md: 3, sm: 2, xs: 0 },
						width: { sm: `calc(100% - ${drawerWidth}px)`, md: `calc(100% - ${drawerWidth}px)` }
					}}
				>
					<Divider sx={{ width: "100%" }} />
					<Box display="flex" justifyContent="space-between" sx={{ p: 2 }}>
						<Typography variant="body2">© {new Date().getFullYear()} SMSWithoutBorders</Typography>
						<Box justifyContent="end">
							<a href="https://github.com/smswithoutborders">
								<FaGithub size="20px" style={{ margin: 2 }} />
							</a>{" "}
							<a href="https://web.facebook.com/SMSWithoutBorders?_rdc=1&_rdr">
								<FaFacebook size="20px" style={{ margin: 2 }} />
							</a>{" "}
							<a href="https://twitter.com/SwobOutreach">
								<FaXTwitter size="20px" style={{ margin: 2 }} />
							</a>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
