import React, { useState, useEffect } from "react";
import {
	Box,
	Grid,
	Card,
	Typography,
	Select,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
	TextField,
	Button,
	FormControl
} from "@mui/material";
import dayjs from "dayjs";

const categories = [
	{ key: "summary", label: "Summary" },
	{ key: "signup", label: "Signup Users" },
	{ key: "retained", label: "Retained Users" }
];

const OpenTelemetry = () => {
	const [category, setCategory] = useState("summary");
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalRetained, setTotalRetained] = useState(0);
	const [, setError] = useState(null);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [country, setCountry] = useState("");

	useEffect(() => {
		loadUsersData();
	}, [category, startDate, endDate]);

	const loadUsersData = async () => {
		try {
			setError(null);
			const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
			const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");
			const countryParam = country ? `&country_code=${country}` : "";

			const response = await fetch(
				`https://api.telemetry.smswithoutborders.com/v1/${category}?start_date=${formattedStartDate}&end_date=${formattedEndDate}${countryParam}`
			);

			if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
			const apiData = await response.json();
			setTotalUsers(apiData[category]?.total_signup_users ?? 0);
			setTotalRetained(apiData[category]?.total_retained_users ?? 0);
			setData(apiData[category]?.data || []);
		} catch (error) {
			console.error("Error fetching data:", error);
			setError(error.message);
		}
	};

	// Define applyFilters and resetFilters
	const applyFilters = () => {
		loadUsersData();
	};

	const resetFilters = () => {
		setStartDate("");
		setEndDate("");
		setCountry("");
		setCategory("summary");
		loadUsersData();
	};

	const DataTable = ({ data, page, rowsPerPage }) => {
		const startIdx = (page - 1) * rowsPerPage;
		const endIdx = startIdx + rowsPerPage;
		const paginatedData = data.slice(startIdx, endIdx);

		return (
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
						{paginatedData.length === 0 ? (
							<TableRow>
								<TableCell colSpan={2} align="center">
									No data available
								</TableCell>
							</TableRow>
						) : (
							paginatedData.map((row, index) => (
								<TableRow key={index}>
									<TableCell>{row.timeframe}</TableCell>
									<TableCell align="right">
										{category === "signup" ? row.signup_users : row.retained_users}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
				<TablePagination
					rowsPerPageOptions={[4, 10, 25]}
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page - 1}
					onPageChange={(event, newPage) => setPage(newPage + 1)}
					onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
				/>
			</TableContainer>
		);
	};

	return (
		<Box component="main" sx={{ px: 3, pb: 3, flexGrow: 1 }}>
			<Grid container sx={{ p: 2 }} justifyContent="center" alignItems="center">
				<Grid item lg={2} md={3} sx={{ display: { xs: "none", md: "block" } }}></Grid>
				<Grid item lg={10} md={9} xs={12} sx={{ p: { md: 3, sm: 2, xs: 1 } }}>
					{/* Filters */}

					{/* Grid Container for Cards */}
					<Grid container spacing={4}>
						{/* Total Users */}
						<Grid item xs={12} sm={6} md={3}>
							<Card
								sx={{
									p: 3,
									borderRadius: 3,
									boxShadow: 3,
									textAlign: "center"
								}}
							>
								<Typography
									variant="subtitle2"
									sx={{
										fontWeight: 600,
										color: "#555",
										mb: 1
									}}
								>
									Total Users
								</Typography>
								<Typography variant="h5" component="p" sx={{ fontWeight: 700, color: "#333" }}>
									{totalUsers}
								</Typography>
							</Card>
						</Grid>

						{/* Retained Users */}
						<Grid item xs={12} sm={6} md={3}>
							<Card
								sx={{
									p: 3,
									borderRadius: 3,
									boxShadow: 3,
									textAlign: "center"
								}}
							>
								<Typography
									variant="subtitle2"
									sx={{
										fontWeight: 600,
										color: "#555",
										mb: 1
									}}
								>
									Retained Users
								</Typography>
								<Typography variant="h5" component="p" sx={{ fontWeight: 700, color: "#333" }}>
									{totalRetained}
								</Typography>
							</Card>
						</Grid>

						{/* Signup Countries */}
						<Grid item xs={12} sm={6} md={3}>
							<Card
								sx={{
									p: 3,
									borderRadius: 3,
									boxShadow: 3,
									textAlign: "center"
								}}
							>
								<Typography
									variant="subtitle2"
									sx={{
										fontWeight: 600,
										color: "#555",
										mb: 1
									}}
								>
									Signup Countries
								</Typography>
								<Typography variant="h5" component="p" sx={{ fontWeight: 700, color: "#333" }}>
									Null
								</Typography>
							</Card>
						</Grid>

						{/* Retained Countries */}
						<Grid item xs={12} sm={6} md={3}>
							<Card
								sx={{
									p: 3,
									borderRadius: 3,
									boxShadow: 3,
									textAlign: "center"
								}}
							>
								<Typography
									variant="subtitle2"
									sx={{
										fontWeight: 600,
										color: "#555",
										mb: 1
									}}
								>
									Retained Countries
								</Typography>
								<Typography variant="h5" component="p" sx={{ fontWeight: 700, color: "#333" }}>
									Null
								</Typography>
							</Card>
						</Grid>
					</Grid>

					<Card
						sx={{
							mt: 4,
							p: 4,
							borderRadius: 3,
							boxShadow: 3
						}}
					>
						{/* Filters Section */}
						<Grid container spacing={4} justifyContent="space-between">
							{/* Select Category */}
							<Grid item xs={12} sm={6} md={3}>
								<FormControl fullWidth>
									<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#555" }}>
										Select Category
									</Typography>
									<Select
										value={category}
										onChange={(e) => setCategory(e.target.value)}
										variant="outlined"
										sx={{
											borderRadius: 2,
											boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
										}}
									>
										{categories.map((cat) => (
											<MenuItem key={cat.key} value={cat.key}>
												{cat.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							{/* Select Country */}
							<Grid item xs={12} sm={6} md={3}>
								<FormControl fullWidth>
									<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#555" }}>
										Country
									</Typography>
									<Select
										value={country}
										onChange={(e) => setCountry(e.target.value)}
										variant="outlined"
										sx={{
											borderRadius: 2,
											boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
										}}
									>
										<MenuItem value="">
											<em>All Countries</em>
										</MenuItem>
										{/* Add other countries here */}
									</Select>
								</FormControl>
							</Grid>

							{/* Start Date */}
							<Grid item xs={12} sm={6} md={3}>
								<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#555" }}>
									Start Date
								</Typography>
								<TextField
									type="date"
									fullWidth
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									InputLabelProps={{ shrink: true }}
									variant="outlined"
									sx={{
										borderRadius: 2,
										boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
									}}
								/>
							</Grid>

							{/* End Date */}
							<Grid item xs={12} sm={6} md={3}>
								<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#555" }}>
									End Date
								</Typography>
								<TextField
									type="date"
									fullWidth
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									InputLabelProps={{ shrink: true }}
									variant="outlined"
									sx={{
										borderRadius: 2,
										boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
									}}
								/>
							</Grid>
						</Grid>

						{/* Buttons Section */}
						<Grid
							container
							spacing={3}
							sx={{ mt: 4 }}
							justifyContent={{ xs: "center", md: "flex-end" }}
						>
							<Grid item xs={12} sm={6} md={3}>
								<Button
									fullWidth
									variant="contained"
									color="primary"
									onClick={applyFilters}
									sx={{
										textTransform: "none",
										py: 1.5,
										borderRadius: 2,
										fontWeight: 600,
										boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
									}}
								>
									Apply Filters
								</Button>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<Button
									fullWidth
									variant="outlined"
									color="secondary"
									onClick={resetFilters}
									sx={{
										textTransform: "none",
										py: 1.5,
										borderRadius: 2,
										fontWeight: 600,
										border: "1px solid #ccc",
										boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
									}}
								>
									Reset Filters
								</Button>
							</Grid>
						</Grid>
					</Card>

					{/* Data Table */}
					<Grid item xs={12} mt={2}>
						<Card sx={{ p: 3 }}>
							<Typography variant="subtitle1">Data Table</Typography>

							<DataTable data={data} page={page} rowsPerPage={rowsPerPage} />
						</Card>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
