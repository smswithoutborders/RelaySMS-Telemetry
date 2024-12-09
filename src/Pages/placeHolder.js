import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Card as MuiCard,
	CardContent,
	Button,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	TextField,
	Grid
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Card = ({ title, content }) => (
	<MuiCard
		sx={{
			background: "#fff",
			padding: 2,
			borderRadius: 2,
			boxShadow: 3,
			textAlign: "center",
			transition: "transform 0.3s ease-in-out",
			"&:hover": { transform: "scale(1.03)" }
		}}
	>
		<CardContent>
			<Typography variant="h6" gutterBottom>
				{title}
			</Typography>
			<Typography variant="body2" color="primary">
				{content}
			</Typography>
		</CardContent>
	</MuiCard>
);

const OpenTelemetry = () => {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [countryFilter, setCountryFilter] = useState("");

	// Fetch data from the API
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"https://6616b7bbed6b8fa4348132c4.mockapi.io/api/v1/summaries"
				);
				const apiData = await response.json();
				setData(apiData);
				setFilteredData(apiData);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setError(true);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Apply Filters
	const applyFilters = () => {
		let result = data;

		if (startDate) {
			result = result.filter((item) => new Date(item.date) >= new Date(startDate));
		}
		if (endDate) {
			result = result.filter((item) => new Date(item.date) <= new Date(endDate));
		}
		if (countryFilter) {
			result = result.filter((item) => item.summary?.country === countryFilter);
		}

		setFilteredData(result);
	};

	const handleStartDateChange = (e) => setStartDate(e.target.value);
	const handleEndDateChange = (e) => setEndDate(e.target.value);
	const handleCountryChange = (e) => setCountryFilter(e.target.value);

	const columns = [
		{ field: "date", headerName: "Date", width: 150 },
		{
			field: "country",
			headerName: "Country",
			width: 150,
			valueGetter: (params) => params.row.summary?.country || "N/A"
		},
		{
			field: "available",
			headerName: "Available",
			width: 150,
			valueGetter: (params) => params.row.summary?.available || 0
		},
		{
			field: "signup",
			headerName: "Signup",
			width: 150,
			valueGetter: (params) => params.row.summary?.signup || 0
		}
	];

	const DateDesplay = [
		{
			field: "available",
			headerName: "Available",
			width: 150,
			valueGetter: (params) => params.row.summary?.available || 0
		},
		{ field: "date", headerName: "Date", width: 150 }
	];

	// Prepare data for the chart
	const chartData = filteredData.map((item) => [
		item.date || "N/A",
		item.summary?.signup || 0,
		item.summary?.available || 0
	]);

	const drawChart = () => {
		if (window.google && window.google.visualization) {
			const data = new window.google.visualization.DataTable();
			data.addColumn("string", "Date");
			data.addColumn("number", "Signup");
			data.addColumn("number", "Available");
			data.addRows(chartData);

			const options = {
				title: "Signup and Available Trends",
				hAxis: { title: "Date" },
				vAxis: { title: "Count" },
				series: { 1: { curveType: "function" } }
			};

			const chart = new window.google.visualization.LineChart(document.getElementById("chart_div"));
			chart.draw(data, options);
		}
	};

	useEffect(() => {
		window.google.charts.load("current", { packages: ["corechart"] });
		window.google.charts.setOnLoadCallback(drawChart);
	}, [filteredData]);

	if (loading) {
		return <Typography>Loading data...</Typography>;
	}

	if (error) {
		return <Typography color="error">Error: Unable to load data</Typography>;
	}

	return (
		<Box display="flex" height="100vh">
			{/* Sidebar */}
			<Box
				sx={{
					backgroundColor: "#f4f4f4",
					padding: 2,
					boxSizing: "border-box",
					width: 250
				}}
			></Box>

			{/* Main Content */}
			<Box sx={{ flex: 1, padding: 3, backgroundColor: "#f5f5f5" }}>
				<Typography variant="h4" textAlign="center" gutterBottom sx={{ color: "#333" }}>
					OpenTelemetry Dashboard
				</Typography>

				{/* Summary Section */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
						gap: 3
					}}
				>
					<Card title="Total Users" content={data.totalUsers || "N/A"} />
					<Card
						title="Total Percentage Growth"
						content={`${data.totalPercentageGrowth || "N/A"}%`}
					/>
					<Card title="Total Signups" content={data.totalSignups || "N/A"} />
				</Box>

				{/* Filters */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
						gap: 3,
						marginTop: 3
					}}
				>
					<Grid item xs={12}>
						<Box p={2} border="1px solid lightgray" borderRadius={2}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={4}>
									<TextField
										fullWidth
										label="Start Date"
										type="date"
										InputLabelProps={{ shrink: true }}
										value={startDate}
										onChange={handleStartDateChange}
									/>
								</Grid>
								<Grid item xs={12} sm={4}>
									<TextField
										fullWidth
										label="End Date"
										type="date"
										InputLabelProps={{ shrink: true }}
										value={endDate}
										onChange={handleEndDateChange}
									/>
								</Grid>
								<Grid item xs={12} sm={4}>
									<FormControl fullWidth>
										<InputLabel>Country</InputLabel>
										<Select value={countryFilter} onChange={handleCountryChange}>
											<MenuItem value="">All Countries</MenuItem>
											{[...new Set(data.map((item) => item.summary?.country))].map((country) => (
												<MenuItem key={country} value={country}>
													{country}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={2}>
									<Button variant="contained" color="primary" onClick={applyFilters} fullWidth>
										Apply Filters
									</Button>
								</Grid>
							</Grid>
						</Box>
					</Grid>
				</Box>

				{/* Chart */}
				<Box id="chart_div" style={{ height: "400px", marginTop: "20px" }} />

				{/* Tables */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
						gap: 3
					}}
				>
					{/* one */}
					<Grid item xs={12}>
						<Box p={2} border="1px solid lightgray" borderRadius={2}>
							<Box mt={4} style={{ height: 600, width: "100%" }}>
								<Typography variant="h6" gutterBottom>
									View by day / month
								</Typography>
								<DataGrid
									rows={filteredData}
									columns={DateDesplay}
									pageSize={5}
									rowsPerPageOptions={[5, 10, 20]}
									checkboxSelection
									disableSelectionOnClick
									components={{
										Toolbar: GridToolbar
									}}
									getRowId={(row) => row.id || `${row.date}-${row.summary?.country}`}
								/>
							</Box>
						</Box>
					</Grid>
					{/* two */}
					<Grid item xs={12}>
						<Box p={2} border="1px solid lightgray" borderRadius={2}>
							<Box mt={4} style={{ height: 600, width: "100%" }}>
								<Typography variant="h6" gutterBottom>
									country data
								</Typography>
								<DataGrid
									rows={filteredData}
									columns={columns}
									pageSize={5}
									rowsPerPageOptions={[5, 10, 20]}
									checkboxSelection
									disableSelectionOnClick
									components={{
										Toolbar: GridToolbar
									}}
									getRowId={(row) => row.id || `${row.date}-${row.summary?.country}`}
								/>
							</Box>
						</Box>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
};

export default OpenTelemetry;
