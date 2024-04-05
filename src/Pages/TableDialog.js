import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Grid } from "@mui/material";
import { FaChevronLeft } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

export default function Data() {
	const { state } = useLocation();
	const testData = state?.test_data || [];
	console.log("testData:", testData);

	const columns = [
		{ field: "test_id", headerName: "Test ID", width: 120 },
		{ field: "sent_time", headerName: "Sent Time", width: 120 },
		{ field: "sms_sent", headerName: "SMS Sent", width: 120 },
		{ field: "sms_received", headerName: "SMS Received", width: 120 },
		{ field: "published", headerName: "Published", width: 120 },
		{ field: "operator_difference", headerName: "Operator Difference", width: 120 },
		{ field: "publisher_difference", headerName: "Publisher Difference", width: 120 },
		{ field: "total_difference", headerName: "Total Difference", width: 120 }
	];

	return (
		<Grid container sx={{ p: { md: 10, xs: 3 } }}>
			<Grid item md={2}></Grid>
			<Grid item md={9} xs={12} sx={{ mt: { xs: 6, md: 0 } }}>
				<Box sx={{ pb: 10 }}>
					<Link to="/">
						<FaChevronLeft /> Back
					</Link>
				</Box>
				<Box sx={{ width: "100%" }}>
					<DataGrid
						getRowId={(row) => row.test_id}
						rows={testData}
						columns={columns}
						pageSize={5}
						pagination
						pageSizeOptions={[5, 10, 25]}
						slots={{
							toolbar: GridToolbar
						}}
					/>
				</Box>
			</Grid>
		</Grid>
	);
}
