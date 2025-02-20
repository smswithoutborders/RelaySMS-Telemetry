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
	TableBody
} from "@mui/material";
import Navbar from "../Components/Nav";
import dayjs from "dayjs";
import PublicationTable from "./OpenTable";

const categories = [
	{ key: "summary", label: "Summary" },
	{ key: "signup", label: "Signup Users" },
	{ key: "retained", label: "Active Users" },
	{ key: "Total_signups_from_bridges", label: "User with Bridges" },
	{ key: "total_retained_users_with_tokens", label: "retained users with Tokens" }
];

const Publish = [
	{ key: "publications", label: "publications" },
	{ key: "total_publications", label: "total_publications" },
	{ key: "total_published", label: "total_published" },
	{ key: "total_failed", label: "total_failed" }
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
	const [category, setCategory] = useState("summary");
	const [granularity, setGranularity] = useState("month");
	const [groupBy, setGroupBy] = useState("country");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);
	const theme = useTheme();
	const [publisher, setPublisher] = useState("summary");

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
				`https://api.telemetry.smswithoutborders.com/v1/summary?start_date=2021-01-10&end_date=${formattedToday}&granularity=day&group_by=date&page=1&page_size=100`
			);

			const data = await response.json();
			console.log("data", data);

			if (data && data.summary) {
				const {
					total_signup_users,
					total_retained_users,
					total_signup_countries,
					total_retained_users_with_tokens,
					total_signups_from_bridges
				} = data.summary;

				setTotalUsers(total_signup_users);
				setTotalRetainedUsers(total_retained_users);
				setTotalSignupCountries(total_signup_countries);
				setTotalRetainedUsersWithTokens(total_retained_users_with_tokens);
				setTotalSignupsFromBridges(total_signups_from_bridges);
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
		fetchSummaryData();
	};

	return (
		<Box
			sx={{
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
					{/* =================================================================================================== */}
					<Box
						className="hero"
						sx={{
							backgroundColor: theme.palette.primary.main,
							p: 2,
							mb: 3,
							boxShadow: "5px 5px 0 rgba(0, 0, 0, 0.1)",
							borderRadius: "8px"
						}}
					>
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
						) : (
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6} md={4} lg={4}>
									<StatCard
										title="Total Users"
										value={totalUsers}
										subtitle="Total number of people who have used RelaySMS"
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={4} lg={4}>
									<StatCard
										title="Total Retained Users"
										value={totalRetainedUsers}
										subtitle="Total number of active users"
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={4} lg={4}>
									<StatCard
										title="Total Signup Countries"
										value={totalSignupCountries}
										subtitle="Total countries using RelaySMS"
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={4} lg={4}>
									<StatCard
										title="Total Retained Users with Tokens"
										value={totalRetainedUsersWithTokens}
										subtitle="People who have saved platforms"
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={4} lg={4}>
									<StatCard
										title="Total Signups from Bridges"
										value={totalSignupsFromBridges}
										subtitle="Users who signed up via bridges"
									/>
								</Grid>
							</Grid>
						)}
					</Box>
					{/* ================================Main Content Blocks =============================================*/}
					{/* =================================================================================================================== */}
					<Grid container spacing={3}>
						{/* Two Column Layout */}
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

										{/*----------------------------------- Publisher Filter------------------------------------------------ */}
										{/* Publisher Filter */}
										<Grid item xs={12} sm={6} md={4}>
											<FormControl fullWidth>
												<InputLabel id="publisher-label">Publisher</InputLabel>
												<Select
													labelId="publisher-label"
													value={publisher}
													onChange={(e) => setPublisher(e.target.value)}
												>
													<MenuItem value="">All</MenuItem>
													{Publish.map((cat) => (
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

						<Grid container item spacing={3}>
							{/* ================== table one for summary data ========================= */}
							<Grid item xs={12} md={4}>
								<Box
									className="content-block"
									sx={{
										height: "150px",
										backgroundColor: "#fff",
										boxShadow: "5px 5px 0 rgba(0, 0, 0, 0.1)",
										borderRadius: "8px"
									}}
								>
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
											<TableContainer component={Paper}>
												<Table>
													<TableHead>
														<TableRow>
															<TableCell>
																<strong>Metric</strong>
															</TableCell>
															<TableCell>
																<strong>Value</strong>
															</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														<TableRow>
															<TableCell>Total Signups</TableCell>
															<TableCell>{data[category]?.total_signup_users || "N/A"}</TableCell>
														</TableRow>
														<TableRow>
															<TableCell>Total Retained Users</TableCell>
															<TableCell>{data[category]?.total_retained_users || "N/A"}</TableCell>
														</TableRow>
														<TableRow>
															<TableCell>Total Retained Users with Tokens</TableCell>
															<TableCell>
																{data[category]?.total_retained_users_with_tokens || "N/A"}
															</TableCell>
														</TableRow>
														<TableRow>
															<TableCell>Total Signups from Bridges</TableCell>
															<TableCell>
																{data[category]?.total_signups_from_bridges || "N/A"}
															</TableCell>
														</TableRow>
														<TableRow>
															<TableCell>Total Signup Countries</TableCell>
															<TableCell>
																{data[category]?.total_signup_countries || "N/A"}
															</TableCell>
														</TableRow>
														<TableRow>
															<TableCell>Total Retained Countries</TableCell>
															<TableCell>
																{data[category]?.total_retained_countries || "N/A"}
															</TableCell>
														</TableRow>
														<TableRow>
															<TableCell>Signup Countries</TableCell>
															<TableCell>
																{data[category]?.signup_countries?.join(", ") || "N/A"}
															</TableCell>
														</TableRow>
														<TableRow>
															<TableCell>Retained Countries</TableCell>
															<TableCell>
																{data[category]?.retained_countries?.join(", ") || "N/A"}
															</TableCell>
														</TableRow>
													</TableBody>
												</Table>
											</TableContainer>
										)
									)}
								</Box>
							</Grid>
							{/* =================================================== */}
							<Grid item xs={12} md={6}>
								<Box
									className="content-block"
									sx={{
										height: "150px",
										backgroundColor: "#fff",
										boxShadow: "5px 5px 0 rgba(0, 0, 0, 0.1)",
										borderRadius: "8px"
									}}
								>
									<PublicationTable />
								</Box>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
};

const StatCard = ({ title, value }) => {
	const theme = useTheme();
	return (
		<Box
			sx={{
				padding: 2,
				borderRadius: "10px",
				boxShadow:
					theme.palette.mode === "dark"
						? "0 2px 8px rgba(255, 255, 255, 0.2)"
						: "0 2px 8px rgba(0, 0, 0, 0.2)",
				backgroundColor: theme.palette.background.paper,
				color: theme.palette.text.primary
			}}
		>
			<Typography variant="h6">{title}</Typography>
			<Typography variant="h5" sx={{ fontWeight: "bold" }}>
				{value}
			</Typography>
		</Box>
	);
};

export default Content;
