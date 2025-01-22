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
	CircularProgress,
	ListItemText
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
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [error, setError] = useState(null);
	const tableData = data?.[category]?.data || [];
	const [totalUsers, setTotalUsers] = useState(0);
	const [total_retained_users, setTotal_retained_users] = useState(0);
	const [loading, setLoading] = useState(false);
	const [group_by, setGroup_by] = useState("country");
	const countryNames = Object.entries(countries.getNames("en"));
	const [total_retained_users_with_tokens, setTotal_retained_users_with_tokens] = useState(0);
	const [totalSignupCountries, setTotalSignupCountries] = useState(0);

	// ==============

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
				setTotal_retained_users(apiData[category]?.total_retained_users ?? 0);
				setTotalSignupCountries(apiData[category]?.total_signup_countries ?? 0);
				setTotal_retained_users_with_tokens(
					apiData[category]?.total_retained_users_with_tokens ?? 0
				);
				setTotalSignupCountries(apiData[category]?.total_signup_countries ?? 0);
			} else if (category === "signup") {
				setTotalUsers(apiData[category]?.total_signup_users ?? 0);
				setTotalSignupCountries(apiData[category]?.total_countries ?? 0);
				setTotal_retained_users_with_tokens(0);
				setTotalSignupCountries(apiData[category]?.total_countries ?? 0);
				setTotal_retained_users_with_tokens(
					apiData[category]?.total_retained_users_with_tokens ?? 0
				);
				setTotal_retained_users(0);
			} else if (category === "retained") {
				setTotal_retained_users_with_tokens(
					apiData[category]?.Total_retained_users_with_tokens ?? 0
				);
				setTotalUsers(0);
				setTotalSignupCountries(0);
				setTotal_retained_users(apiData[category]?.total_retained_users ?? 0);
				setTotal_retained_users_with_tokens(
					apiData[category]?.total_retained_users_with_tokens ?? 0
				);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			setError("Failed to fetch data. Please try again later.");
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
				const {
					total_signup_users,
					total_retained_users_with_tokens,
					total_signup_countries,
					total_retained_users
				} = data.summary;

				setTotalUsers(total_signup_users);
				setTotal_retained_users_with_tokens(total_retained_users_with_tokens);
				setTotalSignupCountries(total_signup_countries);
				setTotal_retained_users(total_retained_users);
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
		},
		{
			field: "users_with_tokens",
			headerName: "Users with Stored Tokens",
			flex: 1,
			valueGetter: (params) => params.row.users_with_tokens || 0
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
		},
		{
			field: "users_with_tokens",
			headerName: "Users with Stored Tokens",
			flex: 1,
			valueGetter: (params) => params.row.users_with_tokens || 0
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

	const CountryRows = filteredData.map((row, index) => ({
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

					{/* ============== Total Display section ================ */}
					<Grid container spacing={3}>
						{loading ? (
							<Grid
								item
								xs={12}
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									minHeight: "150px"
								}}
							>
								<CircularProgress size={60} />
							</Grid>
						) : (
							<>
								{/* ================= sign up users =================== */}
								<Grid item xs={12} sm={6} md={4} lg={2}>
									<Card
										sx={{
											p: 3,
											textAlign: "center",
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
											alignItems: "center",
											height: "100%",
											boxShadow: 5,
											borderRadius: "12px",
											background: "linear-gradient(135deg, #6e7dff, #4d5bff)",
											color: "white",
											transition: "transform 0.3s ease-in-out",
											"&:hover": {
												transform: "translateY(-10px)"
											}
										}}
									>
										<Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
											Signup Users
										</Typography>
										<Typography variant="h4" sx={{ fontWeight: "600" }}>
											{totalUsers}
										</Typography>
									</Card>
								</Grid>

								{/* ================= Retained Users ================== */}
								<Grid item xs={12} sm={6} md={4} lg={2}>
									<Card
										sx={{
											p: 3,
											textAlign: "center",
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
											alignItems: "center",
											height: "100%",
											boxShadow: 5,
											borderRadius: "12px",
											background: "linear-gradient(135deg, #3ecf8e, #1eae65)",
											color: "white",
											transition: "transform 0.3s ease-in-out",
											"&:hover": {
												transform: "translateY(-10px)"
											}
										}}
									>
										<Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
											Retained Users
										</Typography>
										<Typography variant="h4" sx={{ fontWeight: "600" }}>
											{total_retained_users}
										</Typography>
									</Card>
								</Grid>

								{/* =============== sign ups country ================= */}
								<Grid item xs={12} sm={6} md={4} lg={2}>
									<Card
										sx={{
											p: 3,
											textAlign: "center",
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
											alignItems: "center",
											height: "100%",
											boxShadow: 5,
											borderRadius: "12px",
											background: "linear-gradient(135deg, #f39c12, #f1c40f)",
											color: "white",
											transition: "transform 0.3s ease-in-out",
											"&:hover": {
												transform: "translateY(-10px)"
											}
										}}
									>
										<Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
											Signup Countries
										</Typography>
										<Typography variant="h4" sx={{ fontWeight: "600" }}>
											{totalSignupCountries}
										</Typography>
									</Card>
								</Grid>

								{/* ============ Users with tokens ============ */}
								<Grid item xs={12} sm={6} md={4} lg={2}>
									<Card
										sx={{
											p: 3,
											textAlign: "center",
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
											alignItems: "center",
											height: "100%",
											boxShadow: 5,
											borderRadius: "12px",
											background: "linear-gradient(135deg, #3498db, #2980b9)",
											color: "white",
											transition: "transform 0.3s ease-in-out",
											"&:hover": {
												transform: "translateY(-10px)"
											}
										}}
									>
										<Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
											Users With Tokens
										</Typography>
										<Typography variant="h4" sx={{ fontWeight: "600" }}>
											{total_retained_users_with_tokens}
										</Typography>
									</Card>
								</Grid>

								<Grid item xs={12} sm={6} md={4} lg={3}>
									<Card
										sx={{
											p: 3,
											textAlign: "center",
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
											alignItems: "center",
											height: "100%",
											boxShadow: 8,
											borderRadius: "15px",
											background: "linear-gradient(135deg, rgb(70, 67, 71), rgb(106, 98, 109))",
											color: "white",
											transform: "scale(1.1)",
											transition: "transform 0.3s ease-in-out",
											"&:hover": {
												transform: "scale(1.15)"
											}
										}}
									>
										<Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
											% Published
										</Typography>
										<Typography variant="h4" sx={{ fontWeight: "700", mb: 1 }}>
											Null
										</Typography>
										<Typography variant="body2" sx={{ fontSize: "16px", opacity: 0.9 }}>
											<strong>Keep track of your content publishing progress</strong>
										</Typography>
									</Card>
								</Grid>
							</>
						)}
					</Grid>

					{/* ================== filter ======================== */}

					<Grid
						container
						sx={{
							mt: 4,
							p: 4
						}}
						spacing={3}
						justifyContent="center"
						alignItems="flex-start"
					>
						{/* Filter Cards */}
						{[
							{ label: "Category", value: category, onChange: setCategory, options: categories },
							{
								label: "Granularity",
								value: granularity,
								onChange: setGranularity,
								options: granularities
							},
							{ label: "Group By", value: group_by, onChange: setGroup_by, options: groupes },
							{ label: "Country", value: country, onChange: setCountry, options: countryNames }
						].map(({ label, value, onChange, options }) => (
							<Grid key={label} item xs={12} sm={6} md={3}>
								<Card
									sx={{
										p: 3,
										borderRadius: 4,
										boxShadow: 4,
										backgroundColor: (theme) => theme.palette.background.default,
										"&:hover": {
											boxShadow: 8,
											transform: "scale(1.03)",
											transition: "all 0.3s ease"
										}
									}}
								>
									<FormControl fullWidth>
										<InputLabel sx={{ fontSize: 16, fontWeight: 500 }}>{label}</InputLabel>
										<Select
											value={value}
											onChange={(e) => onChange(e.target.value)}
											sx={{
												borderRadius: 2,
												padding: "8px",
												"& .MuiOutlinedInput-root": {
													backgroundColor: (theme) => theme.palette.background.paper,
													borderColor: (theme) => theme.palette.primary.main
												},
												"&:hover .MuiOutlinedInput-notchedOutline": {
													borderColor: (theme) => theme.palette.secondary.main
												},
												"& .MuiSelect-icon": {
													color: (theme) => theme.palette.primary.main
												}
											}}
										>
											{options.map((option) => (
												<MenuItem key={option.key} value={option.key}>
													<ListItemText>{option.label || option.name}</ListItemText>
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Card>
							</Grid>
						))}

						{/* Date Filters */}
						<Grid item xs={12} sm={12} md={6}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6}>
										<TextField
											label="Start Date"
											type="date"
											onChange={(e) => setStartDate(e.target.value)}
											value={startDate}
											InputLabelProps={{ shrink: true }}
											fullWidth
											sx={{
												"& .MuiOutlinedInput-root": {
													backgroundColor: (theme) => theme.palette.background.paper,
													borderRadius: 2,
													padding: "6px"
												},
												"&:hover .MuiOutlinedInput-notchedOutline": {
													borderColor: (theme) => theme.palette.secondary.main
												}
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											label="End Date"
											type="date"
											onChange={(e) => setEndDate(e.target.value)}
											value={endDate}
											InputLabelProps={{ shrink: true }}
											fullWidth
											sx={{
												"& .MuiOutlinedInput-root": {
													backgroundColor: (theme) => theme.palette.background.paper,
													borderRadius: 2,
													padding: "6px"
												},
												"&:hover .MuiOutlinedInput-notchedOutline": {
													borderColor: (theme) => theme.palette.secondary.main
												}
											}}
										/>
									</Grid>
								</Grid>
							</LocalizationProvider>
						</Grid>

						{/* Action Buttons */}
						<Grid container spacing={2} justifyContent="center">
							<Grid item xs={12} sm={6} md={3}>
								<Button
									onClick={applyFilters}
									fullWidth
									variant="contained"
									color="primary"
									sx={{
										textTransform: "none",
										fontWeight: "bold",
										borderRadius: "25px",
										boxShadow: 4,
										transition: "all 0.3s ease",
										"&:hover": {
											boxShadow: 12,
											transform: "scale(1.05)",
											backgroundColor: (theme) => theme.palette.primary.dark
										}
									}}
								>
									Apply
								</Button>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<Button
									fullWidth
									variant="outlined"
									color="secondary"
									sx={{
										textTransform: "none",
										fontWeight: "bold",
										borderRadius: "25px",
										boxShadow: 4,
										transition: "all 0.3s ease",
										"&:hover": {
											boxShadow: 12,
											transform: "scale(1.05)",
											backgroundColor: (theme) => theme.palette.secondary.dark
										}
									}}
									onClick={resetFilters}
								>
									Reset
								</Button>
							</Grid>
						</Grid>
					</Grid>

					{/* ========================== TABLE SECTION ============================ */}
					{/* ===================================================================== */}
					{/* ===================================================================== */}

					<Grid
						container
						spacing={3}
						sx={{
							mt: 2,
							p: 2,
							borderRadius: 3
						}}
					>
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
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
