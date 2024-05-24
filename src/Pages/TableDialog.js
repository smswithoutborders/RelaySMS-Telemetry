import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Grid } from "@mui/material";
import { FaChevronLeft } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

export default function Data() {
	const { state } = useLocation();
	const testdata = state?.tests || [];
	console.log("tests:", testdata);

	const formatDate = (dateString) => {
		if (!dateString) return "";
		return new Date(dateString).toLocaleString();
	};

	const columns = [
		{
			field: "start_time",
			headerName: "Start Time",
			width: 160,
			valueFormatter: (params) => formatDate(params.value)
		},
		{
			field: "sms_sent_time",
			headerName: "SMS Sent Time",
			width: 160,
			valueFormatter: (params) => formatDate(params.value)
		},
		{
			field: "sms_received_time",
			headerName: "SMS Received Time",
			width: 160,
			valueFormatter: (params) => formatDate(params.value)
		},
		{
			field: "sms_routed_time",
			headerName: "Routed Time",
			width: 160,
			valueFormatter: (params) => formatDate(params.value)
		},
		{ field: "status", headerName: "Status", width: 100 },
		{ field: "operator_difference", headerName: "Operator Difference", width: 160 },
		{ field: "publisher_difference", headerName: "Publisher Difference", width: 160 },
		{ field: "total_difference", headerName: "Total Difference", width: 160 }
	];

	return (
		<Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
			<Grid container sx={{ p: { md: 10, xs: 3 }, flex: 1 }}>
				<Grid item md={2} xs={12}></Grid>
				<Grid item md={9} xs={12} sx={{ mt: { xs: 6, md: 0 }, height: "65vh" }}>
					<Box sx={{ pb: 5 }}>
						<Link to="/">
							<FaChevronLeft /> Back
						</Link>
					</Box>
					<Box sx={{ width: "100%", height: "500px", overflow: "auto" }}>
						<DataGrid
							rows={testdata}
							columns={columns}
							initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
							pageSizeOptions={[10, 25, 50]}
							slots={{
								toolbar: GridToolbar
							}}
							sx={{ width: "100%" }}
						/>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
