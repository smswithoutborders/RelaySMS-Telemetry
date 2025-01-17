import React, { useState, useEffect } from "react";
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

const groupes = [
	{ key: "date", label: "Date" },
	{ key: "country", label: "country" }
];

const OpenTelemetry = () => {
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [country, setCountry] = useState("");
	const [category, setCategory] = useState("summary");
	const [granularity, setGranularity] = useState("month");
	const [group_by, setGroup_by] = useState("month");
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const tableData = data?.[category]?.data || [];
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalSignupCountries, setTotalSignupCountries] = useState(0);
	const countryNames = Object.entries(countries.getNames("en"));
	const [userswithToken, setUsers_with_Tokens] = useState(0);

	const filteredData = country
		? tableData.filter((row) => countries.getName(row.country_code, "en") === country)
		: tableData;

	const applyFilters = async () => {
		if (!startDate || !endDate) {
			setError("Please select both start and end dates.");
			return;
		}

		setLoading(true);

		try {
			const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
			const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

			const response = await fetch(
				`https://api.telemetry.smswithoutborders.com/v1/${category}?start_date=${formattedStartDate}&end_date=${formattedEndDate}&granularity=${granularity}&group_by=${group_by}`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const apiData = await response.json();
			setData(apiData);
			console.log("apiData", apiData);
			setError(null);

			if (category === "summary") {
				setTotalUsers(apiData[category]?.total_signup_users ?? 0);
				setUsers_with_Tokens(apiData[category]?.users_withToken ?? 0);
				setTotalSignupCountries(apiData[category]?.total_signup_countries ?? 0);
			} else if (category === "signup") {
				setTotalUsers(apiData[category]?.total_signup_users ?? 0);
				setTotalSignupCountries(apiData[category]?.total_countries ?? 0);
				setUsers_with_Tokens(0);
			} else if (category === "retained") {
				setUsers_with_Tokens(apiData[category]?.total_retained_users ?? 0);
				setTotalUsers(0);
				setTotalSignupCountries(0);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			setError("Failed to fetch data. Please try again later");
		} finally {
			setLoading(false);
		}
	};

	const fetchSummaryData = async () => {
		setLoading(true);
		try {
			const today = new Date();
			const formattedToday = today.toISOString().split("T")[0];

			const response = await fetch(
				`https://api.telemetry.smswithoutborders.com/v1/summary?start_date=2021-01-10&end_date=${formattedToday}&granularity=day&group_by=date&page=1&page_size=100`
			);

			const data = await response.json();
			console.log("data", data);

			if (data && data.summary) {
				const { total_signup_users, users_withToken, total_signup_countries } = data.summary;

				setTotalUsers(total_signup_users);
				setUsers_with_Tokens(users_withToken);
				setTotalSignupCountries(total_signup_countries);
			} else {
				console.error("Invalid data structure received", data);
			}
		} catch (error) {
			console.error("Error fetching summary data:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchSummaryData();
	}, []);

	const resetFilters = () => {
		setStartDate("");
		setEndDate("");
		setCountry("");
		setCategory("summary");
		fetchSummaryData();
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
	console.log("columns", columns);

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
	console.log("countryColumns", countryColumns);

	const startIdx = (page - 1) * rowsPerPage;
	const endIdx = startIdx + rowsPerPage;
	const paginatedData = tableData.slice(startIdx, endIdx);

	const rows = paginatedData.map((row, index) => ({
		id: index + 1,
		timeframe: dayjs(row.timeframe).format("YYYY-MM-DD"),
		signup_users: row.signup_users,
		retained_users: row.retained_users
	}));
	console.log("rows", rows);

	const CountryRows = [
		...filteredData.map((row, index) => ({
			id: index + 1,
			country_code: countries.getName(row.country_code, "en") || "Unknown",
			signup_users: row.signup_users,
			retained_users: row.retained_users
		}))
	];
	console.log("CountryRows", CountryRows);
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

					<Grid container spacing={3}>
						<Grid container spacing={3} sx={{ mt: 4 }}>
							{[
								{ title: "Signup Users", value: totalUsers, icon: "👥" },
								{ title: "Signup Countries", value: totalSignupCountries, icon: "🌍" },
								{ title: "Users with stored accounts", value: userswithToken, icon: "💾" }
							].map((item, index) => (
								<Grid item xs={12} sm={6} md={3} key={index}>
									<Card
										sx={{
											p: 3,
											textAlign: "center",
											borderRadius: 2,
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
											alignItems: "center",
											height: "100%",
											minHeight: "150px",
											boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
											"&:hover": {
												boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
												transform: "translateY(-4px)",
												transition: "0.3s ease-in-out"
											}
										}}
									>
										<Typography variant="h6" sx={{ fontWeight: "bold" }}>
											{item.icon} {item.title}
										</Typography>
										<Typography variant="h4" sx={{ color: "primary.main", mt: 1 }}>
											{item.value}
										</Typography>
									</Card>
								</Grid>
							))}
						</Grid>
					</Grid>

					<Card
						sx={{
							mt: 4,
							p: 6,
							borderRadius: 3,
							boxShadow: 3
						}}
					>
						<Grid container spacing={3}>
							{/* Category Filters */}
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel>Category</InputLabel>
									<Select
										label="Category"
										value={category}
										onChange={(e) => setCategory(e.target.value)}
									>
										{categories.map((cat) => (
											<MenuItem key={cat.key} value={cat.key}>
												{cat.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							{/* Granularity Filters */}
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel>Granularity</InputLabel>
									<Select
										label="Granularity"
										value={granularity}
										onChange={(e) => setGranularity(e.target.value)}
									>
										{granularities.map((gran) => (
											<MenuItem key={gran.key} value={gran.key}>
												{gran.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							{/* ====== country and date filter ============ */}
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel>Ground By</InputLabel>

									<Select
										label="Group_by"
										value={group_by}
										onChange={(e) => setGroup_by(e.target.value)}
									>
										{groupes.map((gran) => (
											<MenuItem key={gran.key} value={gran.key}>
												{gran.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							{/* Country Filter */}
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<Autocomplete
										value={country}
										onChange={(event, newValue) => {
											if (newValue && !countryNames.some(([, name]) => name === newValue)) {
												setError("This country is not available.");
											} else {
												setCountry(newValue);
												setError(null);
											}
										}}
										options={countryNames.map(([, name]) => name)}
										renderInput={(params) => <TextField {...params} label="Country" />}
										freeSolo
									/>
									{error && (
										<Typography color="error" variant="body2" sx={{ mt: 1 }}>
											{error}
										</Typography>
									)}
								</FormControl>
							</Grid>

							{/* Date Filters */}
							<Grid item xs={12} md={6}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<Grid container spacing={3}>
										<Grid item xs={12} sm={6}>
											<TextField
												fullWidth
												label="Start Date"
												type="date"
												value={startDate}
												onChange={(e) => setStartDate(e.target.value)}
												InputLabelProps={{ shrink: true }}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<TextField
												fullWidth
												label="End Date"
												type="date"
												value={endDate}
												onChange={(e) => setEndDate(e.target.value)}
												InputLabelProps={{ shrink: true }}
											/>
										</Grid>
									</Grid>
								</LocalizationProvider>
							</Grid>

							{/* Buttons */}
							<Grid item xs={12} display="flex" justifyContent="flex-start" gap={2}>
								<Button
									variant="contained"
									color="primary"
									onClick={applyFilters}
									disabled={loading}
								>
									Apply Filters
								</Button>
								<Button variant="outlined" color="secondary" onClick={resetFilters}>
									Reset Filters
								</Button>
							</Grid>
						</Grid>
					</Card>

					{/* Tables */}
					<Grid container spacing={2} sx={{ mt: 4 }}>
						<Grid item xs={12} md={6}>
							<Card>
								<div style={{ width: "100%" }}>
									<Typography variant="h6" sx={{ textAlign: "center", p: 2 }}>
										{category === "signup"
											? "Signup Users by Country"
											: "Retained Users by Country"}
									</Typography>
									<DataGrid
										rows={CountryRows}
										columns={countryColumns}
										pageSize={5}
										rowsPerPageOptions={[5]}
										components={{
											Toolbar: GridToolbar
										}}
										getRowId={(row) => row.id}
										autoHeight
										pagination
										rowCount={tableData.length}
										paginationMode="server"
										onPageChange={(newPage) => setPage(newPage + 1)}
										onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
									/>
								</div>
							</Card>
						</Grid>

						<Grid item xs={12} md={6}>
							<Card>
								<div style={{ width: "100%" }}>
									<Typography variant="h6" sx={{ textAlign: "center", p: 2 }}>
										{category === "signup" ? "Signup Users" : "Retained Users"}
									</Typography>
									<DataGrid
										rows={rows}
										columns={columns}
										pageSize={5}
										rowsPerPageOptions={[5]}
										components={{
											Toolbar: GridToolbar
										}}
										getRowId={(row) => row.id}
										autoHeight
										pagination
										rowCount={tableData.length}
										paginationMode="server"
										onPageChange={(newPage) => setPage(newPage + 1)}
										onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
									/>
								</div>
							</Card>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
