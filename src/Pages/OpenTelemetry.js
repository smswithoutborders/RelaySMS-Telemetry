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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import countries from "i18n-iso-countries";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const categories = [
	{ key: "summary", label: "Summary" },
	{ key: "signup", label: "Signup Users" },
	{ key: "retained", label: "Active Users" },
	{ key: "Total_signups_from_bridges", label: "User with Bridges" }
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
	const [total_signups_from_bridges, setTotal_signups_from_bridges] = useState(0);
	const [loading, setLoading] = useState(false);
	const [group_by, setGroup_by] = useState("country");
	const countryNames = Object.entries(countries.getNames("en"));
	const [total_retained_users_with_tokens, setTotal_retained_users_with_tokens] = useState(0);
	const [totalSignupCountries, setTotalSignupCountries] = useState(0);

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

			//  stats based on category
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
					total_retained_users,
					total_signups_from_bridges
				} = data.summary;

				setTotalUsers(total_signup_users);
				setTotal_retained_users_with_tokens(total_retained_users_with_tokens);
				setTotalSignupCountries(total_signup_countries);
				setTotal_retained_users(total_retained_users);
				setTotal_signups_from_bridges(total_signups_from_bridges);
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

	const CountryRows = [
		...filteredData.map((row, index) => ({
			id: index + 1,
			country_code: countries.getName(row.country_code, "en") || "Unknown",
			signup_users: row.signup_users,
			retained_users: row.retained_users
		}))
	];

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
					{loading ? (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center"
							}}
						>
							<CircularProgress size={60} />
						</div>
					) : (
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
								gap: "1rem",
								marginBottom: "2rem"
							}}
						>
							{/* ================= Signup users ===================== */}
							<div
								style={{
									padding: "1rem",
									borderRadius: "10px",
									boxShadow: "0 2px 8px rgba(0, 0, 0, 1)",
									"& .MuiOutlinedInput-root": {
										backgroundColor: (theme) => theme.palette.background.paper,
										borderRadius: 2
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: (theme) => theme.palette.secondary.main
									}
								}}
							>
								<span style={{ fontSize: "1.5rem" }}>Signup Users</span>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginTop: "1rem"
									}}
								>
									<div style={{ fontSize: "1.5rem" }}>
										<h1>{totalUsers}</h1>
									</div>
								</div>
								<small style={{ color: "#51525C" }}>
									Total number of People who have used RelaySMS
								</small>
							</div>

							{/* ===============================Retained users =================== */}
							<div
								style={{
									padding: "1rem",
									"& .MuiOutlinedInput-root": {
										backgroundColor: (theme) => theme.palette.background.paper,
										borderRadius: 2
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: (theme) => theme.palette.secondary.main
									},
									borderRadius: "10px",
									boxShadow: "2px 2px 8px rgba(0, 0, 0, 1)"
								}}
							>
								<span style={{ fontSize: "1.5rem" }}>Active Users</span>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginTop: "1rem"
									}}
								>
									<div style={{ fontSize: "1.5rem" }}>
										<h1>{total_retained_users}</h1>
									</div>
								</div>
								<small style={{ color: "#51525C" }}>Total number of Active user</small>
							</div>

							{/* ================== Signup Countries=================== */}
							<div
								style={{
									padding: "1rem",
									"& .MuiOutlinedInput-root": {
										backgroundColor: (theme) => theme.palette.background.paper,
										borderRadius: 2
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: (theme) => theme.palette.secondary.main
									},
									borderRadius: "10px",
									boxShadow: "2px 2px 8px rgba(0, 0, 0, 1)"
								}}
							>
								<span style={{ fontSize: "1.5rem" }}>Signup Countries</span>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginTop: "1rem"
									}}
								>
									<div style={{ fontSize: "1.5rem" }}>
										<h1>{totalSignupCountries}</h1>
									</div>
								</div>
								<small style={{ color: "#51525C" }}>Total Number of countries using RelaySMS</small>
							</div>

							{/* ============= Users with Tokens ============ */}
							<div
								style={{
									padding: "1rem",
									"& .MuiOutlinedInput-root": {
										backgroundColor: (theme) => theme.palette.background.paper,
										borderRadius: 2
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: (theme) => theme.palette.secondary.main
									},
									borderRadius: "10px",
									boxShadow: "2px 2px 8px rgba(0, 0, 0, 1)"
								}}
							>
								<span style={{ fontSize: "1.5rem" }}>Users with Tokens</span>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginTop: "1rem"
									}}
								>
									<div style={{ fontSize: "1.5rem" }}>
										<h1>{total_retained_users_with_tokens}</h1>
									</div>
								</div>
								<small style={{ color: "#51525C" }}>
									Total Number of People who have saved platforms
								</small>
							</div>

							{/* ============ Bridges ================= */}
							<div
								style={{
									padding: "1rem",
									"& .MuiOutlinedInput-root": {
										backgroundColor: (theme) => theme.palette.background.paper,
										borderRadius: 2
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: (theme) => theme.palette.secondary.main
									},
									borderRadius: "10px",
									boxShadow: "2px 2px 8px rgba(0, 0, 0, 1)"
								}}
							>
								<span style={{ fontSize: "1.5rem" }}>Bridges</span>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginTop: "1rem"
									}}
								>
									<div style={{ fontSize: "1.5rem" }}>
										<h1>{total_signups_from_bridges}</h1>
									</div>
								</div>
								<small style={{ color: "#51525C" }}>Total Number of People using bridges</small>
							</div>
						</div>
					)}

					{/* ================== Filter ======================== */}
					{/* ================== Filter ======================== */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "20px",
							marginBottom: "2rem"
						}}
					>
						{/* Filter Cards */}
						<Grid
							container
							spacing={3}
							sx={{
								mt: 2,
								px: 2
							}}
						>
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
									<FormControl fullWidth>
										<InputLabel
											sx={{
												fontSize: 15,
												fontWeight: 600
											}}
										>
											{label}
										</InputLabel>
										<Select
											value={value}
											onChange={(e) => onChange(e.target.value)}
											sx={{
												mt: 1,
												borderRadius: 2,
												"& .MuiSelect-select": {
													padding: "15px",
													fontSize: 14,
													fontWeight: 500
												}
											}}
										>
											{options.map((option) => (
												<MenuItem
													key={option.key || option.label}
													value={option.key}
													sx={{
														fontSize: 14,
														fontWeight: 500
													}}
												>
													<ListItemText primary={option.label || option.name} />
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							))}
						</Grid>

						{/* Date Filters and Buttons */}
						<Grid
							container
							spacing={3}
							sx={{
								mt: 2,
								px: 2,
								justifyContent: "flex-start",
								alignItems: "center"
							}}
						>
							{/* Start Date */}
							<Grid item xs={12} sm={6} md="auto">
								<TextField
									label="Start Date"
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									InputLabelProps={{ shrink: true }}
									sx={{
										"& .MuiOutlinedInput-root": {
											backgroundColor: (theme) => theme.palette.background.paper,
											borderRadius: 2
										},
										"&:hover .MuiOutlinedInput-notchedOutline": {
											borderColor: (theme) => theme.palette.secondary.main
										}
									}}
								/>
							</Grid>

							{/* End Date */}
							<Grid item xs={12} sm={6} md="auto">
								<TextField
									label="End Date"
									type="date"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									InputLabelProps={{ shrink: true }}
									sx={{
										"& .MuiOutlinedInput-root": {
											backgroundColor: (theme) => theme.palette.background.paper,
											borderRadius: 2
										},
										"&:hover .MuiOutlinedInput-notchedOutline": {
											borderColor: (theme) => theme.palette.secondary.main
										}
									}}
								/>
							</Grid>

							{/* Apply Button */}
							<Grid item xs={12} sm={6} md="auto">
								<Button
									variant="contained"
									color="primary"
									onClick={applyFilters}
									sx={{
										textTransform: "none",
										fontWeight: "bold",
										borderRadius: "25px",
										px: 3,
										boxShadow: 4,
										transition: "all 0.3s ease",
										"&:hover": {
											boxShadow: 12,
											transform: "scale(1.05)"
										}
									}}
								>
									Apply
								</Button>
							</Grid>

							{/* Reset Button */}
							<Grid item xs={12} sm={6} md="auto">
								<Button
									variant="outlined"
									color="secondary"
									onClick={resetFilters}
									sx={{
										textTransform: "none",
										fontWeight: "bold",
										borderRadius: "25px",
										px: 3,
										boxShadow: 4,
										transition: "all 0.3s ease",
										"&:hover": {
											boxShadow: 12,
											transform: "scale(1.05)"
										}
									}}
								>
									Reset
								</Button>
							</Grid>
						</Grid>
					</div>

					{/* ========================== TABLE SECTION ============================ */}
					{/* ========================== TABLE SECTION ============================ */}
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
							</Card>
						</Grid>
						<Grid item xs={12} md={6}>
							<Card sx={{ p: 3 }}>
								<Typography variant="h6" sx={{ mb: 2 }}>
									Country data
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
							</Card>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
