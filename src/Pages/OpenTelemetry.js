import React, { useState, useEffect } from "react";
import {
	Box,
	Grid,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	CircularProgress,
	Button,
	TablePagination
} from "@mui/material";

const OpenTelemetry = () => {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [countryFilter, setCountryFilter] = useState("");
	const [totalCountries, setTotalCountries] = useState(0);
	const [totalSignupUsers, setTotalSignupUsers] = useState(0);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"https://6616b7bbed6b8fa4348132c4.mockapi.io/api/v1/summaries"
				);
				const apiData = await response.json();
				setData(apiData);
				setFilteredData(apiData);
				calculateTotals(apiData);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setError(true);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const calculateTotals = (apiData) => {
		const countries = new Set(apiData.map((item) => item.summary?.country));
		const totalSignups = apiData.reduce((sum, item) => sum + (item.summary?.signup || 0), 0);

		setTotalCountries(countries.size);
		setTotalSignupUsers(totalSignups);
	};

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
		setPage(0);
	};

	const handleStartDateChange = (e) => setStartDate(e.target.value);
	const handleEndDateChange = (e) => setEndDate(e.target.value);
	const handleCountryChange = (e) => setCountryFilter(e.target.value);

	const handleChangePage = (event, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100vh"
				flexDirection="column"
			>
				<Typography variant="h6" color="error" gutterBottom>
					Error loading data. Please try again later.
				</Typography>
				<Button variant="contained" color="primary" onClick={() => window.location.reload()}>
					Retry
				</Button>
			</Box>
		);
	}

	return (
		<Box
			className="d-flex"
			component="main"
			style={{ marginLeft: "260px" }}
			sx={{
				px: { md: 3, sm: 3, xs: 2 },
				pb: { md: 3, sm: 3, xs: 14 },
				flexGrow: 1
			}}
		>
			<Grid container spacing={4}>
				<Grid item xs={12}>
					<Typography variant="h4" gutterBottom>
						Open Telemetry Dashboard
					</Typography>
				</Grid>

				{/* ============= Totals ================ */}
				<Grid container spacing={2}>
					<Grid item xs={12} sm={4}>
						<Box p={2} bgcolor="lightgreen" borderRadius={2}>
							<Typography variant="h6">Total Signup Users</Typography>
							<Typography variant="h5">{totalSignupUsers}</Typography>
						</Box>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Box p={2} bgcolor="lightblue" borderRadius={2}>
							<Typography variant="h6">Total Countries</Typography>
							<Typography variant="h5">{totalCountries}</Typography>
						</Box>
					</Grid>
				</Grid>

				{/* ================= Filters =============== */}
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

				{/* ================== Data Table ================ */}
				<Grid item xs={12}>
					<Typography variant="h6" gutterBottom>
						Filtered Data
					</Typography>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Date</TableCell>
									<TableCell>Country</TableCell>
									<TableCell>Available</TableCell>
									<TableCell>Signup</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredData
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((item, index) => (
										<TableRow key={index}>
											<TableCell>{item.date || "N/A"}</TableCell>
											<TableCell>{item.summary?.country || "N/A"}</TableCell>
											<TableCell>{item.summary?.available || 0}</TableCell>
											<TableCell>{item.summary?.signup || 0}</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						component="div"
						count={filteredData.length}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
