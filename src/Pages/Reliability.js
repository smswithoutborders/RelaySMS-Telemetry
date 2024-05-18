import React, { useState, useEffect, useCallback } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Grid, Box, Card, Typography, Button } from "@mui/material";
import CountrySearch from "../Components/CountrySearch";
import OperatorSearch from "../Components/OperatorSearch";
import DateSearch from "../Components/DateSearch";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../Utils/FetchData";

const apiUrl = process.env.REACT_APP_RELIABILITY_URL;
const drawerWidth = 240;

export default function Reliability() {
	const navigate = useNavigate();

	// State to manage data, filters, and loading status
	const [data, setData] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [selectedOperator, setSelectedOperator] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [loading, setLoading] = useState(false);

	// Handlers for updating filter states
	const handleSelectCountry = (country) => {
		setSelectedCountry(country);
	};

	const handleSelectOperator = (operator) => {
		setSelectedOperator(operator);
	};

	const handleSelectDate = (date) => {
		setSelectedDate(date);
	};

	// Function to convert Unix timestamp to human-readable format
	const formatUnixTime = (unixTime) => {
		const date = new Date(unixTime * 1000);
		return date.toLocaleString();
	};

	// Function to fetch data from the API based on selected filters
	const fetchTestData = useCallback(() => {
		setLoading(true);

		const params = new URLSearchParams();
		if (selectedCountry) params.append("country", selectedCountry);
		if (selectedOperator) params.append("operator", selectedOperator);
		if (selectedDate) params.append("date", selectedDate);

		fetchData(`${apiUrl}?${params.toString()}`)
			.then((data) => {
				const mappedData = data.map((item) => ({
					msisdn: item.msisdn,
					country: item.country,
					operator: item.operator,
					operatorCode: item.operator_code,
					reliability: item.reliability,
					date: formatUnixTime(item.last_published_date), //
					testdata: item.test_data
				}));
				const filteredData = mappedData.filter((row) => row.msisdn !== null);
				setData(filteredData);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [selectedCountry, selectedOperator, selectedDate]);

	// Fetch data initially and whenever filters change
	useEffect(() => {
		fetchTestData();
	}, [fetchTestData]);

	// Handle row click to navigate to the data page with the selected row's test data
	const handleRowClick = useCallback(
		(params) => {
			const data = params.row.testdata;
			navigate("/data", { state: { test_data: data } });
		},
		[navigate]
	);

	// Define the columns for the DataGrid
	const columns = [
		{ field: "msisdn", headerName: "MSISDN", width: 150 },
		{ field: "country", headerName: "Country", width: 150 },
		{ field: "operator", headerName: "Operator", width: 150 },
		{ field: "operatorCode", headerName: "Operator Code", width: 150 },
		{ field: "reliability", headerName: "Reliability", width: 150 },
		{ field: "date", headerName: "Date/Time", width: 200 }
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
						{/* Display the count of total gateway clients */}
						<Grid item md={3} xs={6}>
							<Card sx={{ p: 2 }}>
								<Typography textAlign="center" variant="h3" sx={{ fontWeight: 600 }}>
									{data.length}
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

						{/* Country search component */}
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

						{/* Date search component */}
						<Grid item md={3} xs={6}>
							<DateSearch onSelectDate={handleSelectDate} apiUrl={apiUrl} />
						</Grid>

						{/* Refresh button to manually fetch data */}
						<Grid item md={3} xs={6}>
							<Button onClick={fetchTestData} variant="contained" color="primary">
								Refresh Data
							</Button>
						</Grid>
					</Grid>

					{/* DataGrid component to display the data */}
					<DataGrid
						getRowId={(row) => row.msisdn}
						onRowClick={handleRowClick}
						rows={data}
						columns={columns}
						pageSize={5}
						initialState={{ pagination: { paginationModel: { pageSize: 7 } } }}
						pageSizeOptions={[7]}
						slots={{
							toolbar: GridToolbar,
							noRowsOverlay: () => (
								<div style={{ textAlign: "center", padding: "20px" }}>No rows found</div>
							)
						}}
						sx={{ height: 500, width: "100%", color: "paper", py: 4 }}
						loading={loading} // Display loading indicator while fetching data
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
