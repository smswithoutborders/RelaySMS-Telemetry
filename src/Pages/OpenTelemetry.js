import React, { useState } from "react";
import {
	Box,
	Grid,
	Card,
	Button,
	Typography,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	TextField,
	Autocomplete
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import countries from "i18n-iso-countries";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const categories = [
	{ key: "summary", label: "Summary" },
	{ key: "signup", label: "Signup Users" },
	{ key: "retained", label: "Retained Users" }
];

const granularities = [
	{ key: "day", label: "Day" },
	{ key: "month", label: "Month" }
];

const OpenTelemetry = () => {
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [country, setCountry] = useState("");
	const [category, setCategory] = useState("summary");
	const [granularity, setGranularity] = useState("month");
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [error, setError] = useState(null);
	const tableData = data?.[category]?.data || [];
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalRetained, setTotalRetained] = useState(0);
	const [signupCountries, setSignupCountries] = useState(0);
	const [retainedCountries, setRetainedCountries] = useState(0);
	const countryNames = Object.entries(countries.getNames("en"));

	const applyFilters = async () => {
		if (!startDate || !endDate) {
			setError("Please select both start and end dates.");
			return;
		}

		try {
			const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
			const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

			const response = await fetch(
				`https://api.telemetry.smswithoutborders.com/v1/${category}?start_date=${formattedStartDate}&end_date=${formattedEndDate}&granularity=${granularity}&group_by=country&page=1&page_size=100`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const apiData = await response.json();
			setData(apiData);
			setError(null);

			// Update stats based on category
			if (category === "summary") {
				setTotalUsers(apiData[category]?.total_signup_users ?? 0);
				setTotalRetained(apiData[category]?.total_retained_users ?? 0);
				setSignupCountries(apiData[category]?.total_signup_countries ?? 0);
				setRetainedCountries(apiData[category]?.total_retained_countries ?? 0);
			} else if (category === "signup") {
				setTotalUsers(apiData[category]?.total_signup_users ?? 0);
				setSignupCountries(apiData[category]?.total_countries ?? 0);
				setTotalRetained(0);
				setRetainedCountries(0);
			} else if (category === "retained") {
				setTotalRetained(apiData[category]?.total_retained_users ?? 0);
				setRetainedCountries(apiData[category]?.total_countries ?? 0);
				setTotalUsers(0);
				setSignupCountries(0);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			setError("Failed to fetch data. Please try again later.");
		}
	};

	// Reset Filters Function
	const resetFilters = () => {
		setStartDate("");
		setEndDate("");
		setCountry("");
		setCategory("summary");
	};

	// Define columns for User data Table
	const columns = [
		{ field: "timeframe", headerName: "Timeframe", flex: 1 },
		{
			field: "users",
			headerName: category === "signup" ? "Signup Users" : "Retained Users",
			flex: 1,
			valueGetter: (params) =>
				category === "signup" ? params.row.signup_users : params.row.retained_users
		}
	];

	const countryColumns = [
		{ field: "country_code", headerName: "Country", flex: 1 },
		{
			field: "Countries",
			headerName: category === "signup" ? "Signup Users" : "Retained Users",
			flex: 1,
			valueGetter: (params) =>
				category === "signup" ? params.row.signup_users : params.row.retained_users
		}
	];

	const startIdx = (page - 1) * rowsPerPage;
	const endIdx = startIdx + rowsPerPage;
	const paginatedData = tableData.slice(startIdx, endIdx);

	const rows = paginatedData.map((row, index) => ({
		id: index + 1,
		timeframe: dayjs(row.timeframe).format("YYYY-MM-DD"),
		signup_users: row.signup_users,
		retained_users: row.retained_users
	}));

	const CountryRows = paginatedData.map((row, index) => ({
		id: index + 1,
		country_code: countries.getName(row.country_code, "en") || "Unknown",
		signup_users: row.signup_users,
		retained_users: row.retained_users
	}));

	return (
		<Box
			component="main"
			sx={{
				px: { md: 3, sm: 3, xs: 2 },
				pb: { md: 3, sm: 3, xs: 14 },
				flexGrow: 1
			}}
		>
			<Grid container sx={{ p: 2 }} justifyContent="center" alignItems="center">
				<Grid item lg={2} md={3} sx={{ display: { xs: "none", md: "block" } }}></Grid>
				<Grid
					item
					lg={10}
					md={9}
					xs={12}
					sx={{
						p: { md: 3, sm: 2, xs: 1 }
					}}
				>
					{error && (
						<Typography color="error" sx={{ mb: 2 }}>
							{error}
						</Typography>
					)}

					{/* ============== Data Display section ================ */}
					<Grid container spacing={3}>
						<Grid item xs={10} md={2}>
							<Card sx={{ p: 2, textAlign: "center" }}>
								<Typography variant="h6">Signup Users</Typography>
								<Typography variant="h4">{totalUsers}</Typography>
							</Card>
						</Grid>

						<Grid item xs={10} md={2}>
							<Card sx={{ p: 2, textAlign: "center" }}>
								<Typography variant="h6">Retained Users</Typography>
								<Typography variant="h4"> {totalRetained}</Typography>
							</Card>
						</Grid>
						<Grid item xs={12} md={2}>
							<Card sx={{ p: 2, textAlign: "center" }}>
								<Typography variant="h6">Signup Countries</Typography>
								<Typography variant="h4">{signupCountries}</Typography>
							</Card>
						</Grid>
						<Grid item xs={12} md={2}>
							<Card sx={{ p: 2, textAlign: "center" }}>
								<Typography variant="h6">Retained countries</Typography>
								<Typography variant="h4">{retainedCountries}</Typography>
							</Card>
						</Grid>
						<Grid item xs={10} md={2}>
							<Card sx={{ p: 2, textAlign: "center" }}>
								<Typography variant="h6">Users Tokens</Typography>
								<Typography variant="h4">Null</Typography>
							</Card>
						</Grid>
					</Grid>
					{/* ================== filter ======================== */}

					{/* Filter Section */}
					<Card
						sx={{
							mt: 4,
							p: 3,
							borderRadius: 3,
							boxShadow: 3
						}}
					>
						<Grid container spacing={3}>
							{/* Category Filter */}
							<Grid item xs={12} sm={6} md={3}>
								<FormControl fullWidth>
									<InputLabel>Category</InputLabel>
									<Select value={category} onChange={(e) => setCategory(e.target.value)}>
										{categories.map((cat) => (
											<MenuItem key={cat.key} value={cat.key}>
												{cat.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							{/* Granularity Filter */}
							<Grid item xs={12} sm={6} md={3}>
								<FormControl fullWidth>
									<InputLabel>Granularity</InputLabel>
									<Select value={granularity} onChange={(e) => setGranularity(e.target.value)}>
										{granularities.map((cat) => (
											<MenuItem key={cat.key} value={cat.key}>
												{cat.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							{/* Country Filter */}
							<Grid item xs={12} sm={6} md={3}>
								<FormControl fullWidth>
									<InputLabel id="country-label"></InputLabel>

									<Autocomplete
										value={country}
										onChange={(event, newValue) => setCountry(newValue)}
										options={countryNames.map(([, name]) => name)}
										renderInput={(params) => <TextField {...params} label="Country" />}
										renderOption={(props, option) => (
											<MenuItem {...props} value={option}>
												{option}
											</MenuItem>
										)}
										freeSolo
									/>
								</FormControl>
							</Grid>

							{/* Date Filters */}
							<Grid item xs={12} sm={12} md={6}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<Grid container spacing={2}>
										{/* Start Date */}
										<Grid item xs={12} sm={6}>
											<TextField
												label="Start Date"
												type="date"
												onChange={(e) => setStartDate(e.target.value)}
												value={startDate}
												InputLabelProps={{
													shrink: true
												}}
												fullWidth
											/>
										</Grid>
										{/* End Date */}
										<Grid item xs={12} sm={6}>
											<TextField
												label="End Date"
												type="date"
												onChange={(e) => setEndDate(e.target.value)}
												value={endDate}
												InputLabelProps={{
													shrink: true
												}}
												fullWidth
											/>
										</Grid>
									</Grid>
								</LocalizationProvider>
							</Grid>

							{/* Filter Buttons */}
							<Grid item xs={8} sm={6} md={3}>
								<Button
									onClick={applyFilters}
									fullWidth
									variant="contained"
									color="primary"
									sx={{
										textTransform: "none",
										fontWeight: "bold"
									}}
								>
									Apply
								</Button>
							</Grid>
							<Grid item xs={8} sm={6} md={3}>
								<Button
									fullWidth
									variant="outlined"
									color="secondary"
									sx={{
										textTransform: "none",
										fontWeight: "bold"
									}}
									onClick={resetFilters}
								>
									Reset
								</Button>
							</Grid>
						</Grid>
					</Card>

					{/* =========== Tables Display ============================== */}
					<Card
						sx={{
							mt: 4,
							p: 3,
							borderRadius: 3,
							boxShadow: 3
						}}
					>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<Card sx={{ p: 3 }}>
									<Typography variant="h6" sx={{ mb: 2 }}>
										User Data
									</Typography>
									<DataGrid
										rows={rows}
										columns={columns}
										getRowId={(row) => row.id}
										autoHeight
										pagination
										pageSize={rowsPerPage}
										rowCount={tableData.length}
										paginationMode="server"
										onPageChange={(newPage) => setPage(newPage + 1)}
										onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
										components={{ Toolbar: GridToolbar }}
									/>
								</Card>
							</Grid>
							<Grid item xs={12} md={6}>
								<Card sx={{ p: 3 }}>
									<Typography variant="h6" sx={{ mb: 2 }}>
										Country data
									</Typography>
									<DataGrid
										rows={CountryRows}
										columns={countryColumns}
										getRowId={(row) => row.id}
										autoHeight
										pagination
										pageSize={rowsPerPage}
										rowCount={tableData.length}
										paginationMode="server"
										onPageChange={(newPage) => setPage(newPage + 1)}
										onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
										components={{ Toolbar: GridToolbar }}
									/>
								</Card>
							</Grid>
						</Grid>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
