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
	LinearProgress
} from "@mui/material";
import Navbar from "../Components/Nav";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const categories = [
	{ key: "summary", label: "Summary" },
	{ key: "signup", label: "Signup Users" },
	{ key: "retained", label: "Active Users" },
	{ key: "total_signups_from_bridges", label: "Users with Bridges" },
	{ key: "total_retained_users_with_tokens", label: "Retained Users with Tokens" },
	{ key: "total_signup_countries", label: "Signup Countries" },
	{ key: "total_publications", label: "Total Publications" },
	{ key: "total_published_publications", label: "Published Publications" }
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
	const [totalPublishedPublications, setTotalPublishedPublications] = useState(0);
	const [category, setCategory] = useState("summary");
	const [granularity, setGranularity] = useState("month");
	const [groupBy, setGroupBy] = useState("country");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);
	const theme = useTheme();

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
					total_publications,
					total_published_publications
				} = data.summary;

				setTotalUsers(total_signup_users);
				setTotalRetainedUsers(total_retained_users);
				setTotalSignupCountries(total_signup_countries);
				setTotalRetainedUsersWithTokens(total_retained_users_with_tokens);
				setTotalSignupsFromBridges(total_signups_from_bridges);
				setTotalPublications(total_publications);
				setTotalPublishedPublications(total_published_publications);
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
				{/*===================== First Row (3 Summary Cards with Circle Charts) */}
				<Grid container spacing={3} justifyContent="center">
					{/* =================================================================================================== */}

					{loading && (
						<Box
							sx={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								backgroundColor: "rgba(255, 255, 255, 0.7)",
								borderRadius: "8px",
								zIndex: 10
							}}
						>
							<CircularProgress size={60} />
						</Box>
					)}

					{error ? (
						<Typography color="error" variant="h6" align="center">
							{error}
						</Typography>
					) : (
						<Grid container sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: "white" }} spacing={2}>
							{[
								{
									title: "Users",
									value: totalUsers,
									color: "#1F4FFF", // Indigo
									max: 100
								},
								{
									title: "Active Users",
									value: totalRetainedUsers,
									color: "#FF9E43", // Orange
									max: 100
								},
								{
									title: "Signup Countries",
									value: totalSignupCountries,
									color: "#2ED3B7", // Teal
									max: 100
								},
								{
									title: "Active Users with Tokens",
									value: totalRetainedUsersWithTokens,
									color: "#E66F00", // Orange
									max: 100
								},
								{
									title: "Signups from Bridges",
									value: totalSignupsFromBridges,
									color: "#577BFF", // Indigo (lighter)
									max: 100
								},
								{
									title: "Publications",
									value: totalPublications,
									color: "#26272B", // Gray (dark)
									max: 100
								},
								{
									title: "Published Publications",
									value: totalPublishedPublications,
									color: "#FFBD80", // Orange (muted)
									max: 100
								}
							].map((item, index) => {
								const percentage = item.value && item.max ? (item.value / item.max) * 100 : 0;
								const displayPercentage = isNaN(percentage) ? 0 : percentage;

								return (
									<Grid item xs={12} sm={4} md={3} key={index}>
										<Paper
											elevation={3}
											sx={{
												p: 2,
												borderRadius: 2,
												bgcolor: "white",
												textAlign: "center",
												display: "flex",
												flexDirection: "column",
												alignItems: "center"
											}}
										>
											<Typography variant="h6" sx={{ mb: 2 }}>
												{item.title}
											</Typography>

											{/* Process Chart as LinearProgress */}
											<Box sx={{ width: "100%", mt: 2 }}>
												<LinearProgress
													variant="determinate"
													value={displayPercentage}
													sx={{
														height: 10,
														borderRadius: 5,
														backgroundColor: "#e0e0e0", // light gray background
														"& .MuiLinearProgress-bar": {
															backgroundColor: item.color // custom color for the progress bar
														}
													}}
												/>
											</Box>

											<Box
												sx={{
													mt: 2,
													display: "flex",
													flexDirection: "column",
													alignItems: "center"
												}}
											>
												<Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
													{item.value}
												</Typography>
												<Typography variant="body2" sx={{ fontWeight: "bold" }}>
													({displayPercentage.toFixed(1)}%)
												</Typography>
											</Box>
										</Paper>
									</Grid>
								);
							})}
						</Grid>
					)}
				</Grid>

				{/* Second Row (4 Columns with Tables) */}
				<Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: "#EEF2FF" }}>
					<Box
						sx={{
							flexGrow: 1,
							padding: 3,
							marginLeft: drawerOpen ? "250px" : "0px",
							transition: "margin-left 0.3s ease-in-out"
						}}
					>
						<Grid container spacing={3} justifyContent="center">
							{/* Publication Link */}
							<Grid item xs={12}>
								<Link to="/publication" style={{ textDecoration: "none", fontWeight: "bold" }}>
									Publication
								</Link>
							</Grid>

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

							<Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
								<Grid item xs={12} md={6}>
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

										{/* Reset Button */}
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

				<Grid container spacing={2}>
					{/* ==================================== table =================================== */}
					<Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
						<Grid item xs={12} md={12}>
							<Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: "white" }}>
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
														sx={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}
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
															{data[category]?.signup_countries?.join(", ") || "N/A"}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</TableContainer>
									)
								)}
							</Paper>
						</Grid>
					</Grid>
					{/* ===========================================end of table========================================================== */}
				</Grid>
			</Box>
		</Box>
	);
};

export default Content;
