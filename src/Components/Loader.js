import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loader() {
	return (
		<Box
			my="auto"
			align="center"
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "fit-content"
			}}
		>
			<CircularProgress />
		</Box>
	);
}
