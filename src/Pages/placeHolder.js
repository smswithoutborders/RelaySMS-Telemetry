import React, { useState, useEffect } from "react";
import {
	Box,
	Grid,
	Card,
	TextField,
	Button,
	Typography,
	Select,
	MenuItem,
	FormControl,
	InputLabel
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import DataTable from "../Components/Month_AvailableData";
import CountryDataTable from "../Components/OpenCountryData";

const drawerWidth = 240;

const OpenTelemetry = () => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [country, setCountry] = useState("");
	const [category, setCategory] = useState("");
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const formattedStartDate = startDate ? dayjs(startDate).format("YYYY-MM-DD") : "";
				const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : "";
				console.log("start date:", formattedStartDate);
				console.log("end date:", formattedStartDate);

				const response = await fetch(
					`https://api.telemetry.staging.smswithoutborders.com/v1/summary?start_date=${formattedStartDate}&end_date=${formattedEndDate}&country_code=${country}`
				);

				if (!response.ok) {
					throw new Error(`Error: ${response.status} ${response.statusText}`);
				}

				const apiData = await response.json();
				console.log(apiData);

				setData(apiData.summary);
				setFilteredData(apiData.summary);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, [startDate, endDate, country, page, rowsPerPage]);

	// Total countries calculation
	const totalCountries = new Set(filteredData.map((item) => item.summary?.country)).size;

	// Percentage per month calculation
	const percentagePerMonth = filteredData.length
		? ((rowsPerPage / filteredData.length) * 100).toFixed(2)
		: 0;

	// Dynamic list of countries
	const countries = Array.from(new Set(data.map((item) => item.summary?.country)));

	// Apply filters
	const applyFilters = () => {
		let result = data; // Filter based on the 'data' state (not 'apiData')
		if (startDate) result = result.filter((item) => new Date(item.date) >= new Date(startDate));
		if (endDate) result = result.filter((item) => new Date(item.date) <= new Date(endDate));
		if (country) result = result.filter((item) => item.summary?.country === country);
		if (category) result = result.filter((item) => item.summary?.category === category);
		setFilteredData(result); // Update filtered data
	};

	// Paginated data for months
	const paginatedMonthsData = Object.entries(
		filteredData.reduce((acc, item) => {
			const month = dayjs(item.date).format("MMMM YYYY");
			acc[month] = (acc[month] || 0) + 1;
			return acc;
		}, {})
	)
		.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
		.map(([month, available]) => ({ month, available }));

	// Paginated data for countries
	const paginatedCountryData = Object.entries(
		filteredData.reduce((acc, item) => {
			const country = item.summary?.country;
			acc[country] = (acc[country] || 0) + 1;
			return acc;
		}, {})
	)
		.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
		.map(([country, users]) => ({
			country,
			users,
			percentage: ((users / filteredData.length) * 100).toFixed(2)
		}));

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
					{/* Summary Cards */}
					<Grid item md={12} xs={12}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								flexWrap: "wrap",
								gap: 2,
								backgroundColor: "transparent",
								width: "100%",
								padding: 2
							}}
						>
							{/* Total Countries */}
							<Card
								sx={{
									flex: "1 1 calc(33.33% - 16px)",
									minWidth: "250px",
									maxWidth: "300px",
									height: "150px",
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#fff",
									borderRadius: 2,
									boxShadow: 3,
									textAlign: "center"
								}}
							>
								<Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
									Total Countries
								</Typography>
								<Typography variant="h4">{totalCountries}</Typography>
							</Card>

							{/* Total Users */}
							<Card
								sx={{
									flex: "1 1 calc(33.33% - 16px)",
									minWidth: "250px",
									maxWidth: "300px",
									height: "150px",
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#fff",
									borderRadius: 2,
									boxShadow: 3,
									textAlign: "center"
								}}
							>
								<Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
									Total Users
								</Typography>
								<Typography variant="h4">{filteredData.length}</Typography>
							</Card>

							{/* Percentage per Month */}
							<Card
								sx={{
									flex: "1 1 calc(33.33% - 16px)",
									minWidth: "250px",
									maxWidth: "300px",
									height: "150px",
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#fff",
									borderRadius: 2,
									boxShadow: 3,
									textAlign: "center"
								}}
							>
								<Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
									Percentage per Month
								</Typography>
								<Typography variant="h4">{percentagePerMonth}%</Typography>
							</Card>
						</Box>
					</Grid>

					{/* Filter Section */}
					<Grid item md={12} xs={12}>
						<Card
							sx={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
								gap: 2,
								p: 2
							}}
						>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									label="Start Date"
									value={startDate}
									onChange={(newValue) => setStartDate(newValue)}
									renderInput={(params) => <TextField {...params} />}
								/>
								<DatePicker
									label="End Date"
									value={endDate}
									onChange={(newValue) => setEndDate(newValue)}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>

							{/* Category Filter */}
							<FormControl fullWidth sx={{ maxWidth: 250, mb: 2 }}>
								<InputLabel id="category-label">Category</InputLabel>
								<Select
									labelId="category-label"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
								>
									<MenuItem value="summary">Summary</MenuItem>
									<MenuItem value="signup_users">Signup Users</MenuItem>
									<MenuItem value="retained_users">Retained Users</MenuItem>
								</Select>
							</FormControl>
						</Card>

						{/* Country Filter */}
						<Card
							sx={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
								gap: 2,
								p: 2
							}}
						>
							<FormControl fullWidth sx={{ maxWidth: 250 }}>
								<InputLabel id="country-label">Country</InputLabel>
								<Select
									labelId="country-label"
									value={country}
									onChange={(e) => setCountry(e.target.value)}
								>
									<MenuItem value="">
										<em>All Countries</em>
									</MenuItem>
									{countries.map((country) => (
										<MenuItem key={country} value={country}>
											{country.toUpperCase()}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<Button
								sx={{ maxWidth: 200 }}
								variant="contained"
								color="primary"
								onClick={applyFilters}
							>
								Apply
							</Button>
							<Button
								sx={{ maxWidth: 200 }}
								variant="contained"
								color="secondary"
								onClick={() => {
									setStartDate(null);
									setEndDate(null);
									setCountry("");
									setCategory("");
									setFilteredData(data);
								}}
							>
								Reset
							</Button>
						</Card>
					</Grid>

					{/* Table Section */}
					<Grid
						container
						md={12}
						xs={12}
						spacing={2}
						justifyContent="center"
						alignItems="center"
						sx={{ p: 2 }}
					>
						{/* Table for Month/Available Data */}
						<Grid item xs={12} md={6}>
							<DataTable
								data={paginatedMonthsData}
								page={page}
								rowsPerPage={rowsPerPage}
								onPageChange={(e, newPage) => setPage(newPage)}
								onRowsPerPageChange={(e) => {
									setRowsPerPage(parseInt(e.target.value, 10));
									setPage(0);
								}}
							/>
						</Grid>

						{/* Table for Country Data */}
						<Grid item xs={12} md={6}>
							<CountryDataTable
								data={paginatedCountryData}
								page={page}
								rowsPerPage={rowsPerPage}
								onPageChange={(e, newPage) => setPage(newPage)}
								onRowsPerPageChange={(e) => {
									setRowsPerPage(parseInt(e.target.value, 10));
									setPage(0);
								}}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
