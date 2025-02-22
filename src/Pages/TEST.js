// import React from "react";
// import { Container, Row, Col, Table, Card } from "react-bootstrap";
// import { Typography, IconButton, Paper } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import LightModeIcon from "@mui/icons-material/LightMode";
// import DarkModeIcon from "@mui/icons-material/DarkMode";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import LocalMallIcon from "@mui/icons-material/LocalMall";
// import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Dashboard = () => {
// 	return (
// 		<Container fluid>
// 			<Row className="my-3">
// 				<Col md={9}>
// 					<Typography variant="h4">Dashboard</Typography>
// 				</Col>
// 				<Col md={3} className="text-end">
// 					<input type="date" className="form-control" />
// 				</Col>
// 			</Row>

// 			<Row>
// 				<Col md={4}>
// 					<Card className="p-3">
// 						<TrendingUpIcon fontSize="large" />
// 						<Typography variant="h6">Total Sales</Typography>
// 						<Typography variant="h4">$25,023</Typography>
// 						<small>Last 24 hours</small>
// 					</Card>
// 				</Col>
// 				<Col md={4}>
// 					<Card className="p-3">
// 						<LocalMallIcon fontSize="large" />
// 						<Typography variant="h6">Expenses</Typography>
// 						<Typography variant="h4">$5,004</Typography>
// 						<small>Last 24 hours</small>
// 					</Card>
// 				</Col>
// 				<Col md={4}>
// 					<Card className="p-3">
// 						<StackedLineChartIcon fontSize="large" />
// 						<Typography variant="h6">Income</Typography>
// 						<Typography variant="h4">$20,018</Typography>
// 						<small>Last 24 hours</small>
// 					</Card>
// 				</Col>
// 			</Row>

// 			<Row className="mt-4">
// 				<Col>
// 					<Typography variant="h5">Recent Orders</Typography>
// 					<Table striped bordered hover>
// 						<thead>
// 							<tr>
// 								<th>Product Name</th>
// 								<th>Product Number</th>
// 								<th>Payments</th>
// 								<th>Status</th>
// 							</tr>
// 						</thead>
// 						<tbody>
// 							<tr>
// 								<td>Mini USB</td>
// 								<td>456</td>
// 								<td>Due</td>
// 								<td className="text-warning">Pending</td>
// 							</tr>
// 							<tr>
// 								<td>Sceptre Curved</td>
// 								<td>119</td>
// 								<td>Due</td>
// 								<td className="text-warning">Pending</td>
// 							</tr>
// 							<tr>
// 								<td>Razer Blackshark</td>
// 								<td>30</td>
// 								<td>Due</td>
// 								<td className="text-warning">Pending</td>
// 							</tr>
// 						</tbody>
// 					</Table>
// 				</Col>
// 			</Row>

// 			<Row className="mt-4">
// 				<Col md={6}>
// 					<Paper className="p-3">
// 						<Typography variant="h6">Sales Analytics</Typography>
// 						<ShoppingCartIcon fontSize="large" />
// 						<Typography>Online Orders</Typography>
// 						<Typography className="text-danger">-17%</Typography>
// 						<Typography variant="h5">3849</Typography>
// 					</Paper>
// 				</Col>
// 			</Row>

// 			<Row className="mt-4 justify-content-between">
// 				<Col md={1}>
// 					<IconButton>
// 						<MenuIcon />
// 					</IconButton>
// 				</Col>
// 				<Col md={1}>
// 					<IconButton>
// 						<LightModeIcon className="active" />
// 						<DarkModeIcon />
// 					</IconButton>
// 				</Col>
// 				<Col md={2} className="text-end">
// 					<Typography variant="body1">Leoh (Admin)</Typography>
// 					<img
// 						src="https://i.postimg.cc/k5kz0TjQ/1381511-588644811197844-1671954779-n.jpg"
// 						alt="profile"
// 						className="rounded-circle"
// 						width={40}
// 					/>
// 				</Col>
// 			</Row>
// 		</Container>
// 	);
// };

// export default Dashboard;
// ============================================================================================================================================================================================================================================================
// import React, { useEffect, useState } from "react";
// import {
// 	Container,
// 	Box,
// 	Typography,
// 	CircularProgress,
// 	TextField,
// 	Button,
// 	LinearProgress
// } from "@mui/material";
// import { Row, Col, Table } from "react-bootstrap";
// import {
// 	LineChart,
// 	Line,
// 	XAxis,
// 	YAxis,
// 	CartesianGrid,
// 	Tooltip,
// 	ResponsiveContainer
// } from "recharts";
// import axios from "axios";

// const Dashboard = () => {
// 	const [data, setData] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);
// 	const [startDate, setStartDate] = useState("2021-01-10");
// 	const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

// 	const fetchData = async () => {
// 		setLoading(true);
// 		try {
// 			const response = await axios.get(
// 				`https://api.telemetry.staging.smswithoutborders.com/v1/summary?start_date=${startDate}&end_date=${endDate}&granularity=day&group_by=date&page=1&page_size=100`
// 			);
// 			setData(response.data);
// 			setError(null);
// 		} catch (err) {
// 			setError("Failed to fetch data");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchData();
// 	}, [startDate, endDate]);

// 	return (
// 		<Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
// 			<Container sx={{ flexGrow: 1, mt: 3 }}>
// 				{/* Filters */}
// 				<Row className="mb-3">
// 					<Col md={4}>
// 						<TextField
// 							label="Start Date"
// 							type="date"
// 							value={startDate}
// 							onChange={(e) => setStartDate(e.target.value)}
// 							fullWidth
// 						/>
// 					</Col>
// 					<Col md={4}>
// 						<TextField
// 							label="End Date"
// 							type="date"
// 							value={endDate}
// 							onChange={(e) => setEndDate(e.target.value)}
// 							fullWidth
// 						/>
// 					</Col>
// 					<Col md={4}>
// 						<Button variant="contained" onClick={fetchData} fullWidth>
// 							Apply Filters
// 						</Button>
// 					</Col>
// 				</Row>

// 				{/* Loading State */}
// 				{loading && <CircularProgress />}

// 				{/* Error State */}
// 				{error && <Typography color="error">{error}</Typography>}

// 				{/* Data Display */}
// 				{data && (
// 					<Row>
// 						<Col md={4}>
// 							<Box p={2} bgcolor="white" boxShadow={2} borderRadius={2}>
// 								<Typography variant="h6">Sales</Typography>
// 								<Typography variant="h4" color="primary">
// 									${data.sales || 0}
// 								</Typography>
// 								<LinearProgress variant="determinate" value={(data.sales / 20000) * 100} />
// 							</Box>
// 						</Col>
// 						<Col md={4}>
// 							<Box p={2} bgcolor="white" boxShadow={2} borderRadius={2}>
// 								<Typography variant="h6">Expenses</Typography>
// 								<Typography variant="h4" color="error">
// 									${data.expenses || 0}
// 								</Typography>
// 								<LinearProgress
// 									variant="determinate"
// 									value={(data.expenses / 20000) * 100}
// 									color="error"
// 								/>
// 							</Box>
// 						</Col>
// 						<Col md={4}>
// 							<Box p={2} bgcolor="white" boxShadow={2} borderRadius={2}>
// 								<Typography variant="h6">Income</Typography>
// 								<Typography variant="h4" color="success">
// 									${data.income || 0}
// 								</Typography>
// 								<LinearProgress
// 									variant="determinate"
// 									value={(data.income / 20000) * 100}
// 									color="success"
// 								/>
// 							</Box>
// 						</Col>
// 					</Row>
// 				)}

// 				{/* Chart */}
// 				{data && (
// 					<Box mt={4} p={3} bgcolor="white" boxShadow={2} borderRadius={2}>
// 						<Typography variant="h6" gutterBottom>
// 							Sales Over Time
// 						</Typography>
// 						<ResponsiveContainer width="100%" height={300}>
// 							<LineChart data={data.history || []}>
// 								<CartesianGrid strokeDasharray="3 3" />
// 								<XAxis dataKey="date" />
// 								<YAxis />
// 								<Tooltip />
// 								<Line type="monotone" dataKey="sales" stroke="#3f51b5" strokeWidth={2} />
// 							</LineChart>
// 						</ResponsiveContainer>
// 					</Box>
// 				)}

// 				{/* Table */}
// 				{data && (
// 					<Box mt={4} p={3} bgcolor="white" boxShadow={2} borderRadius={2}>
// 						<Typography variant="h6" gutterBottom>
// 							Transaction Data
// 						</Typography>
// 						<Table striped bordered hover>
// 							<thead>
// 								<tr>
// 									<th>Date</th>
// 									<th>Sales</th>
// 									<th>Expenses</th>
// 									<th>Income</th>
// 								</tr>
// 							</thead>
// 							<tbody>
// 								{data.history?.map((item, index) => (
// 									<tr key={index}>
// 										<td>{item.date}</td>
// 										<td>${item.sales}</td>
// 										<td>${item.expenses}</td>
// 										<td>${item.income}</td>
// 									</tr>
// 								))}
// 							</tbody>
// 						</Table>
// 					</Box>
// 				)}
// 			</Container>
// 		</Box>
// 	);
// };

// export default Dashboard;
// ================================================================================================================

import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	useTheme,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
	Link
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import Navbar from "../Components/Nav";
import dayjs from "dayjs";

const categories = [
	{ key: "summary", label: "Summary" },
	{ key: "signup", label: "Signup Users" },
	{ key: "retained", label: "Active Users" },
	{ key: "total_signups_from_bridges", label: "Users with Bridges" },
	{ key: "total_retained_users_with_tokens", label: "Retained Users with Tokens" },
	{ key: "total_signup_countries", label: "Signup Countries" },
	{ key: "total_retained_countries", label: "Retained Countries" },
	{ key: "total_publications", label: "Total Publications" },
	{ key: "total_published_publications", label: "Published Publications" },
	{ key: "total_failed_publications", label: "Failed Publications" }
];

const granularities = [
	{ key: "day", label: "Day" },
	{ key: "month", label: "Month" }
];

const groupes = [
	{ key: "date", label: "Date" },
	{ key: "country", label: "country" }
];

const Dashboard = () => {
	const theme = useTheme();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [category, setCategory] = useState("summary");
	const [granularity, setGranularity] = useState("month");
	const [groupBy, setGroupBy] = useState("country");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [summary, setSummary] = useState(null);
	// ======================================
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalRetainedUsers, setTotalRetainedUsers] = useState(0);
	const [totalSignupCountries, setTotalSignupCountries] = useState(0);
	const [totalRetainedUsersWithTokens, setTotalRetainedUsersWithTokens] = useState(0);
	const [totalSignupsFromBridges, setTotalSignupsFromBridges] = useState(0);
	const [totalRetainedCountries, setTotalRetainedCountries] = useState(0);
	const [totalPublications, setTotalPublications] = useState(0);
	const [totalPublishedPublications, setTotalPublishedPublications] = useState(0);
	const [totalFailedPublications, setTotalFailedPublications] = useState(0);

	// Sample Data
	const UserData = [
		{ name: "John Doe", spent: "$200" },
		{ name: "Jane Smith", spent: "$350" }
	];

	const Summary = [
		{ id: "#001", Date: "Shipped", Country: "cameroon", Total_Number: "N/A" },
		{ id: "#002", Date: "Pending", Country: "cameroon", Total_Number: "N/A" }
	];

	const salesData = [
		{ month: "Jan", sales: 4000 },
		{ month: "Feb", sales: 6000 },
		{ month: "Mar", sales: 8000 },
		{ month: "Apr", sales: 10000 },
		{ month: "May", sales: 15000 }
	];

	// Function to render tables
	const renderTable = (data, headers) => (
		<TableContainer>
			<Table size="small">
				<TableHead>
					<TableRow>
						{headers.map((header, index) => (
							<TableCell key={index} sx={{ fontWeight: "bold" }}>
								{header}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((row, index) => (
						<TableRow key={index}>
							{Object.values(row).map((value, i) => (
								<TableCell key={i}>{value}</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const formattedToday = new Date().toISOString().split("T")[0];
				const response = await fetch(
					`https://api.telemetry.staging.smswithoutborders.com/v1/summary?start_date=2021-01-10&end_date=${formattedToday}&granularity=day&group_by=date&page=1&page_size=100`
				);
				const result = await response.json();
				setData(result);
				setLoading(false);

				if (data && data.summary) {
					const {
						total_signup_users,
						total_retained_users,
						total_signup_countries,
						total_retained_users_with_tokens,
						total_signups_from_bridges,
						total_retained_countries,
						total_publications,
						total_published_publications,
						total_failed_publications
					} = data.summary;

					setTotalUsers(total_signup_users);
					setTotalRetainedUsers(total_retained_users);
					setTotalSignupCountries(total_signup_countries);
					setTotalRetainedUsersWithTokens(total_retained_users_with_tokens);
					setTotalSignupsFromBridges(total_signups_from_bridges);
					setTotalRetainedCountries(total_retained_countries);
					setTotalPublications(total_publications);
					setTotalPublishedPublications(total_published_publications);
					setTotalFailedPublications(total_failed_publications);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const today = new Date();
		const formattedToday = today.toISOString().split("T")[0];

		fetch(
			`https://api.telemetry.staging.smswithoutborders.com/v1/summary?start_date=2021-01-10&end_date=${formattedToday}&granularity=day&group_by=date&page=1&page_size=100`
		)
			.then((response) => response.json())
			.then((data) => setSummary(data.summary))
			.catch((error) => console.error("Error fetching summary:", error));
	}, []);

	if (loading) {
		return <Typography>Loading...</Typography>;
	}

	const calculatePercentage = (value, max) => Math.min((value / max) * 100, 100);
	const resetFilters = () => {
		setStartDate("");
		setEndDate("");
		setCategory("summary");
	};

	// ======================== fatch data when apply filter is used ====================================
	const applyFilters = async () => {
		if (!startDate || !endDate) {
			return;
		}

		setLoading(true);

		try {
			const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
			const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

			const response = await fetch(
				`https://api.telemetry.staging.smswithoutborders.com/v1/${category}?start_date=${formattedStartDate}&end_date=${formattedEndDate}&granularity=${granularity}&group_by=country&page=1&page_size=100`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const apiData = await response.json();
			setData(apiData);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				p: 2,
				display: "flex",
				minHeight: "100vh",
				backgroundColor: theme.palette.background.default
			}}
		>
			<Navbar onToggle={setDrawerOpen} />
			<Box
				sx={{
					flexGrow: 1,
					padding: 3,
					marginLeft: drawerOpen ? "250px" : "0px",
					transition: "margin-left 0.3s ease-in-out"
				}}
			>
				<Box sx={{ flexGrow: 1, padding: 3, transition: "margin-left 0.3s ease-in-out" }}>
					{/*===================== First Row (3 Summary Cards with Progress Bars) */}
					<Grid container spacing={3} justifyContent="center">
						{[
							{
								title: "Users",
								value: { totalUsers },
								max: 30000,
								color: "primary"
							},
							{
								title: "Total Retained Users",
								value: { totalRetainedUsers },
								max: 30000,
								color: "success"
							},
							{
								title: "Total Signup Countries",
								value: { totalSignupCountries } * 1.2,
								max: 40000,
								color: "secondary"
							},
							{
								title: "Total Retained Users with Tokens",
								value: { totalRetainedUsersWithTokens } * 0.8,
								max: 25000,
								color: "info"
							},
							{
								title: "Total Signups from Bridges",
								value: { totalSignupsFromBridges } * 0.5,
								max: 15000,
								color: "warning"
							},
							{
								title: "Total Retained Countries",
								value: { totalRetainedCountries } * 0.5,
								max: 15000,
								color: "warning"
							},
							{
								title: "Total Publications",
								value: { totalPublications } * 0.5,
								max: 15000,
								color: "warning"
							},
							{
								title: "Total Published Publications",
								value: { totalPublishedPublications } * 0.5,
								max: 15000,
								color: "warning"
							},
							{
								title: "Total Failed Publications",
								value: { totalFailedPublications } * 0.5,
								max: 15000,
								color: "warning"
							}
						].map((item, index) => (
							<Grid item xs={12} sm={4} md={3} key={index}>
								<Paper
									elevation={3}
									sx={{ p: 2, borderRadius: 2, bgcolor: "white", textAlign: "center" }}
								>
									<Typography variant="h6">{item.title}</Typography>

									<Box sx={{ position: "relative", display: "inline-flex", mt: 2 }}>
										<CircularProgress variant="determinate" color={item.color} size={70} />
										<Box
											sx={{
												top: 0,
												left: 0,
												bottom: 0,
												right: 0,
												position: "absolute",
												display: "flex",
												alignItems: "center",
												justifyContent: "center"
											}}
										>
											<Typography variant="body2">
												{calculatePercentage(item.amount, item.max).toFixed(1)}%
											</Typography>
										</Box>
									</Box>
								</Paper>
							</Grid>
						))}
					</Grid>

					{/* ======================================================= */}
					{/* Third Row (Charts & Additional Table) */}
					<Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
						{/* Additional Table (Recent Transactions) */}
						<Grid item xs={12} md={12}>
							<Grid container spacing={3}>
								<Grid container item spacing={3}>
									<Grid item xs={12} md={6}>
										<Box
											className="content-block"
											sx={{
												backgroundColor: "#fff",
												boxShadow: "5px 5px 0 rgba(0, 0, 0, 0.1)",
												borderRadius: "8px",
												p: 2
											}}
										>
											<Grid container spacing={2}>
												{/* Category Filter */}
												<Grid item xs={12} sm={6} md={4}>
													<FormControl fullWidth>
														<InputLabel id="category-label">Category</InputLabel>
														<Select
															labelId="category-label"
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

												{/* Granularity Filter */}
												<Grid item xs={12} sm={6} md={4}>
													<FormControl fullWidth>
														<InputLabel id="granularity-label">Granularity</InputLabel>
														<Select
															labelId="granularity-label"
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

												{/* Group By Filter */}
												<Grid item xs={12} sm={6} md={4}>
													<FormControl fullWidth>
														<InputLabel id="groupby-label">Group By</InputLabel>
														<Select
															labelId="groupby-label"
															value={groupBy}
															onChange={(e) => setGroupBy(e.target.value)}
														>
															{groupes.map((group) => (
																<MenuItem key={group.key} value={group.key}>
																	{group.label}
																</MenuItem>
															))}
														</Select>
													</FormControl>
												</Grid>

												{/* Publication Link */}
												<Grid item xs={12}>
													<Link
														to="/publication"
														style={{ textDecoration: "none", fontWeight: "bold" }}
													>
														Publication
													</Link>
												</Grid>
											</Grid>
										</Box>
									</Grid>

									{/* ================================================= */}
									<Grid item xs={12} md={6}>
										<Box
											className="content-block"
											sx={{
												backgroundColor: "#fff",
												boxShadow: "5px 5px 0 rgba(0, 0, 0, 0.1)",
												borderRadius: "8px",
												p: 2
											}}
										>
											{/* Date Filters */}
											<Grid container spacing={2}>
												<Grid item xs={12} sm={6} md={6}>
													<TextField
														label="Start Date"
														type="date"
														fullWidth
														InputLabelProps={{ shrink: true }}
														value={startDate}
														onChange={(e) => setStartDate(e.target.value)}
													/>
												</Grid>
												<Grid item xs={12} sm={6} md={6}>
													<TextField
														label="End Date"
														type="date"
														fullWidth
														InputLabelProps={{ shrink: true }}
														value={endDate}
														onChange={(e) => setEndDate(e.target.value)}
													/>
												</Grid>
											</Grid>

											{/* Apply and Reset Buttons */}
											<Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
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
											</Box>
										</Box>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					{/* Second Row (4 Columns with Tables) */}
					<Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
						{[
							{ title: "User's Data", data: UserData, headers: ["Name", "Spent"] },
							{
								title: "Summary",
								data: Summary,
								headers: ["ID", "Date", "country", "total Number"]
							}
						].map((item, index) => (
							<Grid item xs={12} sm={6} md={6} key={index}>
								<Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: "white" }}>
									<Typography variant="h6" sx={{ mb: 2 }}>
										{item.title}
									</Typography>
									{renderTable(item.data, item.headers)}
								</Paper>
							</Grid>
						))}
					</Grid>

					{/* Third Row (Charts & Additional Table) */}
					<Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
						<Grid item xs={12} md={6}>
							<Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: "white" }}>
								<Typography variant="h6" sx={{ mb: 2 }}>
									Summary Report
								</Typography>

								{summary ? (
									<TableContainer>
										<Table sx={{ minWidth: 650, border: "1px solid #ddd" }}>
											<TableHead>
												<TableRow sx={{ backgroundColor: "#f5f5f5" }}>
													<TableCell sx={{ fontWeight: "bold", borderRight: "1px solid #ddd" }}>
														Metric
													</TableCell>
													<TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
														Value
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{[
													{ label: "Total Signups", value: summary.total_signup_users },
													{ label: "Total Retained Users", value: summary.total_retained_users },
													{
														label: "Total Retained Users with Tokens",
														value: summary.total_retained_users_with_tokens
													},
													{
														label: "Total Signups from Bridges",
														value: summary.total_signups_from_bridges
													},
													{
														label: "Total Signup Countries",
														value: summary.total_signup_countries
													},
													{
														label: "Total Retained Countries",
														value: summary.total_retained_countries
													},
													{ label: "Total Publications", value: summary.total_publications },
													{
														label: "Total Published Publications",
														value: summary.total_published_publications
													},
													{
														label: "Total Failed Publications",
														value: summary.total_failed_publications
													},
													{ label: "Signup Countries", value: summary.signup_countries.join(", ") },
													{
														label: "Retained Countries",
														value: summary.retained_countries.join(", ")
													}
												].map((item, index) => (
													<TableRow
														key={index}
														sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
													>
														<TableCell sx={{ fontWeight: "bold", borderRight: "1px solid #ddd" }}>
															{item.label}
														</TableCell>
														<TableCell sx={{ textAlign: "center" }}>
															{item.value || "N/A"}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								) : (
									<Typography variant="body2" color="textSecondary">
										Loading summary data...
									</Typography>
								)}
							</Paper>
						</Grid>

						{/* Sales Bar Chart */}
						<Grid item xs={12} md={6}>
							<Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: "white" }}>
								<Typography variant="h6" sx={{ mb: 2 }}>
									Users data
								</Typography>
								<BarChart
									xAxis={[{ scaleType: "band", data: salesData.map((d) => d.month) }]}
									series={[{ data: salesData.map((d) => d.sales), color: "#1976d2" }]}
									width={400}
									height={250}
								/>
							</Paper>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
};

export default Dashboard;
