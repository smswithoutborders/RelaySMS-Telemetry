import React, { useState, useEffect, useCallback } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Grid, Box, Card, Typography } from "@mui/material";
import CountrySearch from "../Components/CountrySearch";
import OperatorSearch from "../Components/OperatorSearch";
import DateSearch from "../Components/DateSearch";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../Utils/FetchData";

const gs_url = process.env.REACT_APP_GATEWAY_SERVER_URL;
const apiUrl = `${gs_url}/v3/clients`;
const drawerWidth = 240;
export default function Reliability() {
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [selectedOperator, setSelectedOperator] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);

	const handleSelectCountry = (selectedCountry) => {
		setSelectedCountry(selectedCountry);
	};

	const handleSelectOperator = (selectedOperator) => {
		setSelectedOperator(selectedOperator);
	};

	const handleSelectDate = (selectedDate) => {
		setSelectedDate(selectedDate);
	};

	useEffect(() => {
		fetchData(apiUrl)
			.then((data) => {
				const mappedData = data.map((item) => ({
					msisdn: item.msisdn,
					country: item.country,
					operator: item.operator,
					operator_code: item.operator_code,
					protocols: item.protocols,
					reliability: item.reliability,
					last_published_date: new Date(item.last_published_date).toLocaleString(),
					testdata: item.test_data
				}));
				const filteredData = mappedData.filter((row) => row.msisdn !== null);
				setData(filteredData);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	const handleRowClick = useCallback(
		(params) => {
			const data = params.row.testdata;
			navigate("/data", { state: { test_data: data } });
		},
		[navigate]
	);

	const filteredRows = data.filter(
		(row) =>
			(!selectedCountry || row.country === selectedCountry) &&
			(!selectedOperator || row.operator === selectedOperator) &&
			(!selectedDate || row.date === selectedDate)
	);

	const columns = [
		{ field: "msisdn", headerName: "MSISDN", width: 150 },
		{ field: "country", headerName: "Country", width: 140 },
		{ field: "operator", headerName: "Operator", width: 140 },
		{ field: "operator_code", headerName: "Operator Code", width: 140 },
		{ field: "reliability", headerName: "Reliability", width: 100 },
		{ field: "protocols", headerName: "Protocols", width: 200 },
		{ field: "last_published_date", headerName: "Date/Time", width: 200 }
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
				<Grid
					mx="auto"
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
					<Grid
						container
						columnSpacing={4}
						rowSpacing={4}
						alignItems="flex-end"
						sx={{ py: { md: 5, sm: 5, xs: 1 }, pt: { md: 3, xs: 2, sm: 2 } }}
					>
						<Grid item md={3} xs={6}>
							<Card sx={{ p: 2 }}>
								<Typography textAlign="center" variant="h3" sx={{ fontWeight: 600 }}>
									{filteredRows.length}
								</Typography>
								<Typography
									textAlign="center"
									variant="body1"
									sx={{ fontWeight: 500, p: 1, fontSize: { md: 14, sm: 14, xs: 12 } }}
								>
									Total Gateway Clients
								</Typography>
							</Card>
						</Grid>
						<Grid item md={3} xs={6}>
							<CountrySearch onSelectCountry={handleSelectCountry} apiUrl={apiUrl} />
							{selectedCountry && (
								<OperatorSearch
									selectedCountry={selectedCountry}
									onSelectOperator={handleSelectOperator}
									apiUrl={apiUrl}
								/>
							)}
						</Grid>
						<Grid item md={3} xs={6}>
							<DateSearch onSelectDate={handleSelectDate} apiUrl={apiUrl} />
						</Grid>
					</Grid>
					<DataGrid
						getRowId={(row) => row.msisdn}
						onRowClick={handleRowClick}
						rows={filteredRows}
						columns={columns}
						pageSize={5}
						initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
						pageSizeOptions={[10, 25, 50]}
						slots={{
							toolbar: GridToolbar,
							noRowsOverlay: () => (
								<div style={{ textAlign: "center", padding: "50px" }}>No rows found</div>
							)
						}}
						sx={{ height: 500, width: "100%", color: "paper", py: 4 }}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
