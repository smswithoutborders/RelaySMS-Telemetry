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

const drawerWidth = 240;

// const CountryDataTable = ({ data, page, rowsPerPage, setPage, setRowsPerPage }) => (
// 	<Box>
// 		<Typography variant="h6">Country Data Table</Typography>
// 		<TableContainer component={Paper}>
// 			<Table>
// 				<TableHead>
// 					<TableRow>
// 						<TableCell>Country</TableCell>
// 						<TableCell>Category</TableCell>
// 					</TableRow>
// 				</TableHead>
// 				<TableBody>
// 					{data.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, index) => (
// 						<TableRow key={index}>
// 							<TableCell>{row.summary.country}</TableCell>
// 							<TableCell>{row.summary.category}</TableCell>
// 						</TableRow>
// 					))}
// 				</TableBody>
// 			</Table>
// 		</TableContainer>
// 		<TablePagination
// 			rowsPerPageOptions={[4, 10, 25]}
// 			component="div"
// 			count={data.length}
// 			rowsPerPage={rowsPerPage}
// 			page={page - 1}
// 			onPageChange={(event, newPage) => setPage(newPage + 1)}
// 			onRowsPerPageChange={(event) => {
// 				setRowsPerPage(parseInt(event.target.value, 10));
// 				setPage(1);
// 			}}
// 		/>
// 	</Box>
// );

const categories = [
	{ key: "summary", label: "Summary" },
	{ key: "signup", label: "Signup Users" },
	{ key: "retained", label: "Retained Users" }
];

const OpenTelemetry = () => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [country, setCountry] = useState("");
	const [category, setCategory] = useState("summary");
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(4);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!startDate || !endDate) return;

			try {
				const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
				const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");
				const countryParam = country ? `&country_code=${country}` : "";
				console.log("start date:", formattedStartDate);
				console.log("end date:", formattedStartDate);

				const response = await fetch(
					`https://api.telemetry.staging.smswithoutborders.com/v1/${category}?start_date=${formattedStartDate}&end_date=${formattedEndDate}${countryParam}`
				);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				console.log("response:", response);
				const apiData = await response.json();
				setData(apiData);
				setFilteredData(apiData);
				setError(null);
				console.log("apiData:", apiData);
			} catch (error) {
				console.error("Error fetching data:", error);
				setError("Failed to fetch data. Please try again later.");
			}
		};
		fetchData();
	}, [startDate, endDate, country, category]);

	const applyFilters = () => {
		let result = data;
		if (startDate) result = result.filter((item) => new Date(item.date) >= new Date(startDate));
		if (endDate) result = result.filter((item) => new Date(item.date) <= new Date(endDate));
		if (country) result = result.filter((item) => item.signup?.country === country);
		if (category) result = result.filter((item) => item.summary?.category === category);
		setFilteredData(result);
	};

	const resetFilters = () => {
		setStartDate(null);
		setEndDate(null);
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
			<Box>
				<Typography variant="h6">Data Table</Typography>
				<TableContainer component={Paper}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell>Timeframe</TableCell>
								<TableCell align="right">
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
			</Box>
		);
	};

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
				{error && (
					<Typography color="error" sx={{ mb: 2 }}>
						{error}
					</Typography>
				)}
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
					{/* ============== Data Display section ================ */}
					<Grid container spacing={3}>
						<Grid item xs={12} md={4}>
							<Card sx={{ p: 3, textAlign: "center" }}>
								<Typography variant="h6">Total Countries</Typography>
								{/* <Typography variant="h4">{totalCountries}</Typography> */}
							</Card>
						</Grid>
						<Grid item xs={12} md={4}>
							<Card sx={{ p: 3, textAlign: "center" }}>
								<Typography variant="h6">Total Users</Typography>
								<Typography variant="h4">{filteredData.total_sigup_users}</Typography>
							</Card>
						</Grid>
						<Grid item xs={12} md={4}>
							<Card sx={{ p: 3, textAlign: "center" }}>
								<Typography variant="h6">Rows per Page</Typography>
								<Typography variant="h4">{rowsPerPage}</Typography>
							</Card>
						</Grid>
					</Grid>
					{/* ================== filter ======================== */}
					<Box sx={{ mt: 4, mb: 4 }}>
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
									<InputLabel>Country</InputLabel>
									<Select value={country} onChange={(e) => setCountry(e.target.value)}></Select>
								</FormControl>
							</Grid>

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
												InputLabelProps={{
													shrink: true
												}}
												fullWidth
											/>
										</Grid>
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
							<Grid item xs={12} sm={6} md={3}>
								<Button variant="contained" onClick={applyFilters} fullWidth>
									Apply
								</Button>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<Button variant="outlined" color="secondary" onClick={resetFilters} fullWidth>
									Reset
								</Button>
							</Grid>
						</Grid>
					</Box>

					{/* =========== Tables Display ============================== */}
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
						{/* <Grid item xs={12} md={6}>
							<CountryDataTable
								data={filteredData}
								page={page}
								rowsPerPage={rowsPerPage}
								setPage={setPage}
								setRowsPerPage={setRowsPerPage}
							/>
						</Grid> */}
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
