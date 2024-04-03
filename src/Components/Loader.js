import * as React from "react";
import Box from "@mui/material/Box";

export default function Loader() {
	return (
		<Box
			display="flex"
			my="auto"
			alignItems="center"
			sx={{ my: "auto", height: "100vh", justifyContent: "center" }}
		>
			<Box className="loader"></Box>
		</Box>
	);
}
