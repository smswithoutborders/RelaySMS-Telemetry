import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Grid } from "@mui/material";
import { FaChevronLeft } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

export default function Data() {
	const { state } = useLocation();
	const testData = state?.test_data || [];

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

	const handleDownload = () => {
		const csvContent =
			"data:text/csv;charset=utf-8," +
			[Object.keys(testData[0]).join(",")]
				.concat(testData.map((row) => Object.values(row).join(",")))
				.join("\n");

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "test_data.csv");

		document.body.appendChild(link);
		link.click();
	};

	return (
		<Grid container sx={{ p: { md: 10, xs: 3 } }}>
			<Grid item md={2}></Grid>
			<Grid item md={9} xs={12} sx={{ mt: { xs: 6, md: 0 } }}>
				<Link to="/">
					<FaChevronLeft /> Back
				</Link>
				<Box sx={{ pb: 4 }}>
					<Grid container columnSpacing={4} rowSpacing={4} sx={{ py: 5 }}>
						<Grid item md={3} xs={6}>
							<Button
								sx={{ p: 1 }}
								onClick={handleDownload}
								autoFocus
								color="success"
								variant="contained"
							>
								Download Data
							</Button>
						</Grid>
					</Grid>
				</Box>
				<Box sx={{ width: "100%" }}>
					<DataGrid
						getRowId={(row) => row.test_id}
						rows={testData}
						columns={columns}
						pageSize={5}
						pagination
						pageSizeOptions={[5, 10, 25]}
					/>
				</Box>
			</Grid>
		</Grid>
	);
}
