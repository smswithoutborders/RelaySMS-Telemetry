import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Grid } from "@mui/material";
import { FaChevronLeft } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

export default function Data() {
	const { state } = useLocation();
	const testData = state?.test_data || [];

	const columns = [
		{ field: "start_time", headerName: "Start Time", width: 120 },
		{ field: "sms_sent_time", headerName: "SMS Sent Time", width: 120 },
		{ field: "sms_received_time", headerName: "SMS Received Time", width: 120 },
		{ field: "sms_routed_time", headerName: "Routed Time", width: 120 },
		{ field: "status", headerName: "Status", width: 120 },
		{ field: "operator_difference", headerName: "Operator Difference", width: 120 },
		{ field: "publisher_difference", headerName: "Publisher Difference", width: 120 },
		{ field: "total_difference", headerName: "Total Difference", width: 120 }
	];

	return (
		<Grid container sx={{ p: { md: 10, xs: 3 } }}>
			<Grid item md={2} xs={12}></Grid>
			<Grid item md={9} xs={12} sx={{ mt: { xs: 6, md: 0 }, height: "65vh" }}>
				<Box sx={{ pb: 10 }}>
					<Link to="/">
						<FaChevronLeft /> Back
					</Link>
				</Box>
				<Box sx={{ width: "100%" }}>
					<DataGrid
						rows={testData}
						columns={columns}
						pageSize={5}
						pagination
						pageSizeOptions={[25, 50, 100]}
						slots={{
							toolbar: GridToolbar
						}}
					/>
				</Box>
			</Grid>
		</Grid>
	);
}
