import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	CircularProgress,
	Grid,
	Button,
	useTheme,
	TableRow,
	TableCell,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableBody,
	Skeleton,
	TablePagination
} from "@mui/material";
import Navbar from "../Components/Nav";
import dayjs from "dayjs";
import { PersonAdd, People, Group, AutoGraph, Message, Public } from "@mui/icons-material";

const categories = [
	{ key: "summary", label: "Summary" },
	{ key: "signup", label: "Signup Users" },
	{ key: "retained", label: "Users" },
	{ key: "total_publications", label: "Publications" }
];

const granularities = [
	{ key: "day", label: "Day" },
	{ key: "month", label: "Month" }
];

const groupes = [
	{ key: "date", label: "Date" },
	{ key: "country", label: "country" }
];

const Content = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalRetainedUsers, setTotalRetainedUsers] = useState(0);
	const [totalSignupCountries, setTotalSignupCountries] = useState(0);
	const [totalRetainedUsersWithTokens, setTotalRetainedUsersWithTokens] = useState(0);
	const [totalSignupsFromBridges, setTotalSignupsFromBridges] = useState(0);
	const [totalPublications, setTotalPublications] = useState(0);
	const [category, setCategory] = useState("summary");
	const [granularity, setGranularity] = useState("month");
	const [groupBy, setGroupBy] = useState("country");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);
	const theme = useTheme();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// ======================== fatch data when apply filter is used ====================================
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
				`https://api.telemetry.staging.smswithoutborders.com/v1/${category}?start_date=${formattedStartDate}&end_date=${formattedEndDate}&granularity=${granularity}&group_by=country&page=1&page_size=100`
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
				setTotalRetainedUsers(apiData[category]?.total_retained_users ?? 0);
				setTotalSignupCountries(apiData[category]?.total_signup_countries ?? 0);
				setTotalRetainedUsersWithTokens(apiData[category]?.total_retained_users_with_tokens ?? 0);
				setTotalSignupCountries(apiData[category]?.total_signup_countries ?? 0);
			} else if (category === "signup") {
				setTotalUsers(apiData[category]?.total_signup_users ?? 0);
				setTotalSignupCountries(apiData[category]?.total_countries ?? 0);
				setTotalRetainedUsersWithTokens(0);
				setTotalSignupCountries(apiData[category]?.total_countries ?? 0);
				setTotalRetainedUsersWithTokens(apiData[category]?.total_retained_users_with_tokens ?? 0);
				setTotalRetainedUsers(0);
			} else if (category === "retained") {
				setTotalRetainedUsersWithTokens(apiData[category]?.Total_retained_users_with_tokens ?? 0);
				setTotalUsers(0);
				setTotalSignupCountries(0);
				setTotalRetainedUsers(apiData[category]?.total_retained_users ?? 0);
				setTotalRetainedUsersWithTokens(apiData[category]?.total_retained_users_with_tokens ?? 0);
			} else if (category === "") {
				setTotalRetainedUsersWithTokens(apiData[category]?.Total_retained_users_with_tokens ?? 0);
				setTotalUsers(0);
				setTotalSignupCountries(0);
				setTotalRetainedUsers(apiData[category]?.total_retained_users ?? 0);
				setTotalRetainedUsersWithTokens(apiData[category]?.total_retained_users_with_tokens ?? 0);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			setError("Failed to fetch data. Please try again later.");
		} finally {
			setLoading(false);
		}
	};
	// ===================== fatching summary data ===================================
	const fetchSummaryData = async () => {
		setLoading(true);
		try {
			const today = new Date();
			const formattedToday = today.toISOString().split("T")[0];

			const response = await fetch(
				`https://api.telemetry.staging.smswithoutborders.com/v1/summary?start_date=2021-01-10&end_date=${formattedToday}&granularity=day&group_by=date&page=1&page_size=100`
			);

			const data = await response.json();
			console.log("data", data);

			if (data && data.summary) {
				const {
					total_signup_users,
					total_retained_users,
					total_signup_countries,
					total_retained_users_with_tokens,
					total_signups_from_bridges,
					total_publications
				} = data.summary;

				setTotalUsers(total_signup_users);
				setTotalRetainedUsers(total_retained_users);
				setTotalSignupCountries(total_signup_countries);
				setTotalRetainedUsersWithTokens(total_retained_users_with_tokens);
				setTotalSignupsFromBridges(total_signups_from_bridges);
				setTotalPublications(total_publications);
			} else {
				throw new Error("Invalid data structure received.");
			}
		} catch (error) {
			console.error("Error fetching summary data:", error);
			setError(error.message);
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
		setCategory("summary");
		fetchSummaryData("summary");
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
				{/*======================================= Total section ===============================================*/}
				{/* =================================================================================================== */}
				<Grid container spacing={3}>
					{loading ? (
						<Grid container spacing={2} sx={{ p: 3 }}>
							{[...Array(6)].map((_, index) => (
								<Grid item xs={12} sm={6} md={4} lg={2} key={index}>
									<Box height="100%">
										<Paper
											elevation={4}
											sx={{
												p: 3,
												borderRadius: 3,
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "space-between",
												width: "100%",
												minHeight: 220,
												height: "100%"
											}}
										>
											<Skeleton variant="circular" width={40} height={40} />
											<Skeleton variant="text" width="60%" height={24} sx={{ mt: 2 }} />
											<Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
											<Skeleton variant="rectangular" width="100%" height={8} sx={{ mt: 2 }} />
										</Paper>
									</Box>
								</Grid>
							))}
						</Grid>
					) : error ? (
						<Typography color="error" variant="h6" align="center">
							{error}
						</Typography>
					) : (
						<Grid container sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: "white" }} spacing={3}>
							{[
								{
									title: "Sign-up Users",
									value: totalUsers,
									icon: <PersonAdd fontSize="large" />,
									color: "#000158",
									description: "Number of Signups",
									max: 5000
								},
								{
									title: "Users",
									value: totalRetainedUsers,
									icon: <People fontSize="large" />,
									color: "#B85900",
									description: "Number of current users",
									max: 5000
								},
								{
									title: "Active Users",
									value: totalRetainedUsersWithTokens,
									icon: <Group fontSize="large" />,
									color: "#2196F3",
									description: "Number of users with >1 accounts stored",
									max: 5000
								},
								{
									title: "Bridges First Users",
									value: totalSignupsFromBridges,
									icon: <AutoGraph fontSize="large" />,
									color: "#5FE9D0",
									description: "Number of users via bridges",
									max: 5000
								},
								{
									title: "Publications",
									value: totalPublications,
									icon: <Message fontSize="large" />,
									color: "#FF9E43",
									description: "Total number of messages published",
									max: 5000
								},
								{
									title: "Countries",
									value: totalSignupCountries,
									icon: <Public fontSize="large" />,
									color: "#107569",
									description: "Available Countries with Users",
									max: 200
								}
							].map((item, index) => {
								const percentage =
									item.value && item.max ? Math.min((item.value / item.max) * 100, 100) : 0;

								return (
									<Grid item xs={12} sm={6} md={4} lg={2} key={index}>
										<Box height="100%">
											<Paper
												elevation={4}
												sx={{
													p: 3,
													borderRadius: 3,
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													justifyContent: "space-between",
													bgcolor: "#f9f9f9",
													textAlign: "center",
													boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
													width: "100%",
													minHeight: 220,
													height: "100%"
												}}
											>
												<Typography variant="h6" sx={{ fontWeight: "bold" }}>
													<Typography sx={{ color: item.color }}>{item.icon}</Typography>{" "}
													{item.title}
												</Typography>

												<Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
													{item.value}
												</Typography>
												<Typography variant="body2" sx={{ color: "gray", mb: 1 }}>
													({percentage.toFixed(1)}%)
												</Typography>

												<Typography variant="body2" sx={{ color: "gray" }}>
													{item.description}
												</Typography>
											</Paper>
										</Box>
									</Grid>
								);
							})}
						</Grid>
					)}
				</Grid>

				{/* ============================= filters section =============================================== */}

				<Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: "#F4F4F5" }}>
					<Box
						sx={{
							flexGrow: 1,
							padding: 3,
							marginLeft: drawerOpen ? "250px" : "0px",
							transition: "margin-left 0.3s ease-in-out"
						}}
					>
						<Grid container spacing={3} justifyContent="center">
							{/* Category Select */}
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

							{/* Granularity Select */}
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

							{/* Group By Select */}
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

							{/* Date Filters and Buttons */}
							<Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
								<Grid item xs={12} md={6}>
									<Grid container spacing={2}>
										{/* Start Date */}
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

										{/* End Date */}
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
										<Grid item xs={12} sm={4} md="auto">
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

										<Grid item xs={12} sm={4} md="auto">
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
								</Grid>
							</Grid>
						</Grid>
					</Box>
				</Paper>

				{/* ==================================== Table section =================================== */}
				<Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: "#F4F4F5" }}>
					<Grid item xs={12} md={12}>
						<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
							<Typography color="gray" variant="h5">
								Overview Presentation
							</Typography>
						</Box>

						{loading ? (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "50vh"
								}}
							>
								<CircularProgress size={60} />
							</Box>
						) : error ? (
							<Typography color="error" variant="h6" align="center">
								{error}
							</Typography>
						) : (
							data &&
							data[category] && (
								<>
									<TableContainer
										component={Paper}
										sx={{
											borderRadius: "8px",
											boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
											overflowX: "auto"
										}}
									>
										<Table sx={{ minWidth: 750, border: "1px solid #ddd" }}>
											<TableHead>
												<TableRow
													sx={{
														backgroundColor: "#f5f5f5",
														borderBottom: "2px solid #ddd"
													}}
												>
													<TableCell
														sx={{
															fontWeight: "bold",
															color: "#333",
															borderRight: "1px solid #ddd"
														}}
													>
														<strong>Metric</strong>
													</TableCell>
													{[
														"Total Signups",
														"Total Retained Users",
														"Total Retained Users with Tokens",
														"Total Signups from Bridges",
														"Total Signup Countries",
														"Total Published Publications",
														"Signup Countries"
													].map((metric, index) => (
														<TableCell
															key={index}
															sx={{
																fontWeight: "bold",
																color: "#333",
																textAlign: "center",
																borderRight: "1px solid #ddd"
															}}
														>
															<strong>{metric}</strong>
														</TableCell>
													))}
												</TableRow>
											</TableHead>
											<TableBody>
												<TableRow
													sx={{
														"&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
														"&:hover": { backgroundColor: "#f0f0f0" }
													}}
												>
													<TableCell sx={{ fontWeight: "bold", borderRight: "1px solid #ddd" }}>
														Values
													</TableCell>
													<TableCell sx={{ textAlign: "center", borderRight: "1px solid #ddd" }}>
														{data[category]?.total_signup_users || "N/A"}
													</TableCell>
													<TableCell sx={{ textAlign: "center", borderRight: "1px solid #ddd" }}>
														{data[category]?.total_retained_users || "N/A"}
													</TableCell>
													<TableCell sx={{ textAlign: "center", borderRight: "1px solid #ddd" }}>
														{data[category]?.total_retained_users_with_tokens || "N/A"}
													</TableCell>
													<TableCell sx={{ textAlign: "center", borderRight: "1px solid #ddd" }}>
														{data[category]?.total_signups_from_bridges || "N/A"}
													</TableCell>
													<TableCell sx={{ textAlign: "center", borderRight: "1px solid #ddd" }}>
														{data[category]?.total_signup_countries || "N/A"}
													</TableCell>
													<TableCell sx={{ textAlign: "center", borderRight: "1px solid #ddd" }}>
														{data[category]?.total_publications || "N/A"}
													</TableCell>
													<TableCell sx={{ textAlign: "center", borderRight: "1px solid #ddd" }}>
														{data[category]?.signup_countries?.join(", ") || "N/A"}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
									<TablePagination
										rowsPerPageOptions={[5, 10, 25]}
										component="div"
										count={data.totalCount || 0}
										rowsPerPage={rowsPerPage}
										page={page}
										onPageChange={handleChangePage}
										onRowsPerPageChange={handleChangeRowsPerPage}
									/>
								</>
							)
						)}
					</Grid>
					{/* ===========================================end of table========================================================== */}
				</Paper>
			</Box>
		</Box>
	);
};

export default Content;
