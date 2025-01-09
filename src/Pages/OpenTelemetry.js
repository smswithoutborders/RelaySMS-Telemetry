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
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const categories = [
	{ key: "summary", label: "Summary" },
	{ key: "signup", label: "Signup Users" },
	{ key: "retained", label: "Retained Users" }
];

const OpenTelemetry = () => {
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [country, setCountry] = useState("");
	const [category, setCategory] = useState("summary");
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [error, setError] = useState(null);

	const fetchData = async () => {
		if (!startDate || !endDate) return;

		try {
			const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
			const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");
			const countryParam = country ? `&country_code=${country}` : "";

			const response = await fetch(
				`https://api.telemetry.staging.smswithoutborders.com/v1/${category}?start_date=${formattedStartDate}&end_date=${formattedEndDate}${countryParam}`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const apiData = await response.json();
			setData(apiData);
			setError(null);
		} catch (error) {
			console.error("Error fetching data:", error);
			setError("Failed to fetch data. Please try again later.");
		}
	};
	fetchData();

	const applyFilters = () => {
		let result = data;
		if (startDate) result = result.filter((item) => new Date(item.date) >= new Date(startDate));
		if (endDate) result = result.filter((item) => new Date(item.date) <= new Date(endDate));
		if (country) result = result.filter((item) => item.signup?.country === country);
		if (category) result = result.filter((item) => item.summary?.category === category);
		setFilteredData(result);
		console.log(result);
	};

	// Reset Filters Function
	const resetFilters = () => {
		setStartDate("");
		setEndDate("");
		setCountry("");
		setCategory("summary");
		setFilteredData(data);
	};

	if (!filteredData) {
		return <Typography>Loading...</Typography>;
	}
	// const totalCountries = new Set(filteredData.map((item) => item.signup?.country)).size;

	// DataTable
	const DataTable = ({ data, page, rowsPerPage, setPage, setRowsPerPage, category }) => {
		const tableData = data?.[category]?.data || [];
		console.log("category:", category);
		console.log("Data being passed to the table:", tableData);

		if (!Array.isArray(tableData) || tableData.length === 0) {
			console.error("Data is either not an array or it is empty");
			return <Typography variant="body1">No data available or invalid format</Typography>;
		}

		const startIdx = (page - 1) * rowsPerPage;
		const endIdx = startIdx + rowsPerPage;

		const paginatedData = tableData.slice(startIdx, endIdx);

		return (
			<Card sx={{ borderRadius: 2, boxShadow: 3, padding: 2 }}>
				<Typography variant="h6">Data Table</Typography>
				<TableContainer component={Paper}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell
									sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#e0e0e0" }}
								>
									Timeframe
								</TableCell>
								<TableCell
									sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#e0e0e0" }}
									align="right"
								>
									{category === "signup" ? "Signup Users" : "Retained Users"}
								</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{paginatedData.map((row, index) => (
								<TableRow key={index}>
									<TableCell>{row.timeframe}</TableCell>
									<TableCell
										align="right"
										style={{
											color:
												(category === "signup" ? row.signup_users : row.retained_users) > 100
													? "green"
													: "red"
										}}
									>
										{category === "signup" ? row.signup_users : row.retained_users}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[4, 10, 25]}
					component="div"
					count={tableData.length}
					rowsPerPage={rowsPerPage}
					page={page - 1}
					onPageChange={(event, newPage) => setPage(newPage + 1)}
					onRowsPerPageChange={(event) => {
						setRowsPerPage(parseInt(event.target.value, 10));
						setPage(1);
					}}
				/>
			</Card>
		);
	};

	// ======================================================================================================
	//  second table display data Coountry table
	const CountryDataTable = ({ data, page, rowsPerPage, setPage, setRowsPerPage, category }) => {
		const tableData = data?.[category]?.data || [];
		console.log("category:", category);
		console.log("Data being passed to the table:", tableData);

		if (!Array.isArray(tableData) || tableData.length === 0) {
			console.error("Data is either not an array or it is empty");
			return <Typography variant="body1">No data available or invalid format</Typography>;
		}

		const startIdx = (page - 1) * rowsPerPage;
		const endIdx = startIdx + rowsPerPage;

		const paginatedData = tableData.slice(startIdx, endIdx);

		return (
			<Card sx={{ borderRadius: 2, boxShadow: 3, padding: 2 }}>
				<Typography variant="h6">Country Data Table</Typography>
				<TableContainer component={Paper}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell
									sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#e0e0e0" }}
								>
									Countries
								</TableCell>
								<TableCell
									sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#e0e0e0" }}
									align="right"
								>
									{category === "signup" ? "Signup Users" : "Retained Users"}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedData.map((row, index) => (
								<TableRow key={index}>
									<TableCell>{row.timeframe}</TableCell>
									<TableCell
										align="right"
										style={{
											color:
												(category === "signup" ? row.signup_users : row.retained_users) > 100
													? "green"
													: "red"
										}}
									>
										{category === "signup" ? row.signup_users : row.retained_users}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[4, 10, 25]}
					component="div"
					count={tableData.length}
					rowsPerPage={rowsPerPage}
					page={page - 1}
					onPageChange={(event, newPage) => setPage(newPage + 1)}
					onRowsPerPageChange={(event) => {
						setRowsPerPage(parseInt(event.target.value, 10));
						setPage(1);
					}}
				/>
			</Card>
		);
	};

	// =======================================================================
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
					{/* Data Display Section */}
					<Grid container spacing={4}>
						{/* Total Signup Users */}
						<Grid item xs={12} md={3}>
							<Card sx={{ p: 3 }}>
								<Typography variant="h6">Total Signup Users</Typography>
								<Typography variant="h4">{data?.summary?.total_signup_users || 0}</Typography>
							</Card>
						</Grid>

						{/* Total Retained Users */}
						<Grid item xs={8} md={3}>
							<Card sx={{ p: 3 }}>
								<Typography variant="h6"> Total Retained Users</Typography>
								<Typography variant="h5">{data?.summary?.total_retained_users || 0}</Typography>
							</Card>
						</Grid>

						{/* Signup Countries List */}
						<Grid item xs={12} md={3}>
							<Card sx={{ p: 3 }}>
								<Typography variant="h6"> Total Signup Countries</Typography>
								<Typography variant="h5">
									{data?.summary?.total_signup_countries || "N/A"}
								</Typography>
							</Card>
						</Grid>

						{/* Retained Countries List */}
						<Grid item xs={12} md={3}>
							<Card sx={{ p: 3 }}>
								<Typography variant="h6"> Total Retained Countries</Typography>
								<Typography variant="h5">
									{data?.summary?.total_retained_countries || "N/A"}
								</Typography>
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

							{/* Country Filter */}
							<Grid item xs={12} sm={6} md={3}>
								<FormControl fullWidth>
									<InputLabel id="country-label">Country</InputLabel>
									<Select value={country} onChange={(e) => setCountry(e.target.value)}>
										<MenuItem value="">
											<em>All Countries</em>
										</MenuItem>
									</Select>
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
								<Button variant="contained" color="primary" onClick={applyFilters}>
									Apply Filters
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
								<DataTable
									data={data}
									page={page}
									rowsPerPage={rowsPerPage}
									setPage={setPage}
									setRowsPerPage={setRowsPerPage}
									category={category}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<CountryDataTable
									data={data}
									page={page}
									rowsPerPage={rowsPerPage}
									setPage={setPage}
									setRowsPerPage={setRowsPerPage}
									category={category}
								/>
							</Grid>
						</Grid>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
