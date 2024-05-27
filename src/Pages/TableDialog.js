import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Grid, LinearProgress, Button, CircularProgress } from "@mui/material";
import { FaChevronLeft } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import CustomNoRowsOverlay from "../Components/CustomNoRowsOverlay";

const gs_url = process.env.REACT_APP_GATEWAY_SERVER_URL;
const apiUrl = `${gs_url}/v3/clients`;
const drawerWidth = 240;

const formatDate = (dateString) =>
	!dateString ? "" : new Date(dateString * 1000).toLocaleString();

const useTestData = (paginationModel, msisdn) => {
	const [data, setData] = useState([]);
	const [totalRows, setTotalRows] = useState(0);
	const [loading, setLoading] = useState(false);

	const fetchTestData = async () => {
		setLoading(true);
		try {
			const url = new URL(`${apiUrl}/${msisdn}/tests`);
			const params = {
				page: paginationModel.page + 1,
				per_page: paginationModel.pageSize
			};
			url.search = new URLSearchParams(params).toString();

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const totalCount = parseInt(response.headers.get("X-Total-Count"));
			const data = await response.json();
			setData(data);
			setTotalRows(totalCount);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTestData();
	}, [paginationModel, msisdn]);

	return { data, totalRows, loading, refetch: fetchTestData };
};

export default function Data() {
	const { state } = useLocation();
	const msisdn = state?.msisdn || "";
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

	const {
		data,
		totalRows,
		loading: testDataLoading,
		refetch
	} = useTestData(paginationModel, msisdn);

	const handleRefresh = () => {
		refetch();
	};

	const columns = [
		{
			field: "start_time",
			headerName: "Start Time",
			minWidth: 200,
			flex: 1,
			valueFormatter: (params) => (params.value ? formatDate(params.value) : "-")
		},
		{
			field: "sms_sent_time",
			headerName: "SMS Sent Time",
			minWidth: 200,
			flex: 1,
			valueFormatter: (params) => (params.value ? formatDate(params.value) : "-")
		},
		{
			field: "sms_received_time",
			headerName: "SMS Received Time",
			minWidth: 200,
			flex: 1,
			valueFormatter: (params) => (params.value ? formatDate(params.value) : "-")
		},
		{
			field: "sms_routed_time",
			headerName: "Routed Time",
			minWidth: 200,
			flex: 1,
			valueFormatter: (params) => (params.value ? formatDate(params.value) : "-")
		},
		{
			field: "status",
			headerName: "Status",
			minWidth: 100,
			flex: 0.5,
			valueFormatter: (params) => params.value.toUpperCase()
		},
		{
			field: "operator_difference",
			headerName: "Operator Difference",
			minWidth: 200,
			flex: 1,
			valueFormatter: (params) => (params.value ? params.value : "-")
		},
		{
			field: "publisher_difference",
			headerName: "Publisher Difference",
			minWidth: 200,
			flex: 1,
			valueFormatter: (params) => (params.value ? params.value : "-")
		},
		{
			field: "total_difference",
			headerName: "Total Difference",
			minWidth: 200,
			flex: 1,
			valueFormatter: (params) => (params.value ? params.value : "-")
		}
	];

	return (
		<Box
			className="bg"
			component="main"
			sx={{
				px: { md: 3, sm: 3, xs: 2 },
				pb: { md: 3, sm: 3, xs: 14 },
				flexGrow: 1
			}}
		>
			<Grid container sx={{ p: 2 }} justifyContent="center" alignItems="center" direction="row">
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
				<Grid item lg={10} md={9} xs={12} sm={12}>
					<Grid
						container
						alignItems="center"
						justifyContent="space-between"
						mx={"auto"}
						sx={{ p: 1, my: 2 }}
					>
						<Link to="/">
							<FaChevronLeft /> Back
						</Link>
						<Button variant="contained" onClick={handleRefresh} disabled={testDataLoading}>
							Refresh {testDataLoading && <CircularProgress size={24} />}
						</Button>
					</Grid>
					<DataGrid
						loading={testDataLoading}
						rows={data}
						rowCount={totalRows}
						columns={columns}
						pageSizeOptions={[10, 25, 50, 100]}
						paginationModel={paginationModel}
						paginationMode="server"
						onPaginationModelChange={setPaginationModel}
						slots={{
							noRowsOverlay: CustomNoRowsOverlay,
							loadingOverlay: LinearProgress
						}}
						sx={{ height: 550 }}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
