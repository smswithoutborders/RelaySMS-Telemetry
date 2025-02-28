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
import TimelineIcon from "@mui/icons-material/Timeline";
import { getName } from "country-list";

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
	const isDarkMode = theme.palette.mode === "dark";

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
					padding: 12,
					marginLeft: drawerOpen ? "250px" : "0px",
					transition: "margin-left 0.3s ease-in-out"
				}}
			>
				{/* Header */}
				<Box
					sx={{
						textAlign: "start",
						mb: 2,
						p: 2,
						borderRadius: 3,
						color: isDarkMode ? "white" : "#000158"
					}}
				>
					<Typography
						variant="h3"
						sx={{
							fontWeight: "bold",
							letterSpacing: "1px",
							textShadow: isDarkMode
								? "0 3px 6px rgba(255, 255, 255, 0.3)"
								: "0 3px 6px rgba(0, 0, 0, 0.3)"
						}}
					>
						<TimelineIcon sx={{ mr: 2, fontSize: "3.5rem" }} /> Open Telemetry
					</Typography>
					<Typography
						variant="h6"
						sx={{
							fontSize: "1.2rem",
							mt: 1,
							opacity: 0.9
						}}
					>
						Usage Tracker for RelaySMS
					</Typography>
				</Box>

				{/*======================================= Total section ===============================================*/}
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
												height: "100%",
												bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "white"
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
						<Grid
							container
							sx={{
								p: 3,
								mt: 4,
								borderRadius: 2
							}}
							spacing={3}
						>
							{[
								{
									title: "Sign-up Users",
									value: totalUsers,
									icon: <PersonAdd fontSize="large" />,
									description: "Number of Signups"
								},
								{
									title: "Users",
									value: totalRetainedUsers,
									icon: <People fontSize="large" />,
									description: "Number of current users"
								},
								{
									title: "Active Users",
									value: totalRetainedUsersWithTokens,
									icon: <Group fontSize="large" />,
									description: "Number of users with >1 accounts stored"
								},
								{
									title: "Bridges First Users",
									value: totalSignupsFromBridges,
									icon: <AutoGraph fontSize="large" />,
									description: "Number of users via bridges"
								},
								{
									title: "Publications",
									value: totalPublications,
									icon: <Message fontSize="large" />,
									description: "Total number of messages published"
								},
								{
									title: "Countries",
									value: totalSignupCountries,
									icon: <Public fontSize="large" />,
									description: "Available Countries with Users"
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
													bgcolor: isDarkMode ? "#1e1e1e" : "#EEF2FF",
													textAlign: "center",
													width: "100%",
													minHeight: 220,
													height: "100%"
												}}
											>
												<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
													{/* Title */}
													<Typography
														variant="body2"
														sx={{
															color: isDarkMode ? "white" : "#000158",
															opacity: 0.8,
															fontSize: "1rem",
															mr: 3,
															fontWeight: "bold"
														}}
													>
														{item.title}
													</Typography>

													{/* Icon */}
													<Typography
														variant="h5"
														sx={{
															color: isDarkMode ? "white" : "#000158",
															fontSize: "3rem"
														}}
													>
														{item.icon}
													</Typography>
												</Box>

												{/* Value and Percentage */}
												<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
													{/* Value */}
													<Typography
														variant="h5"
														sx={{
															fontWeight: "bold",
															color: isDarkMode ? "white" : "black",
															fontSize: "1.5rem"
														}}
													>
														{item.value}
													</Typography>

													{/* Percentage */}
													<Typography
														variant="body2"
														sx={{
															color: isDarkMode ? "white" : "black",
															opacity: 0.8,
															fontSize: "1rem",
															ml: 1
														}}
													>
														({percentage.toFixed(1)}%)
													</Typography>
												</Box>

												{/* Description */}
												<Typography
													variant="body2"
													sx={{
														color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "gray",
														textAlign: "center",
														mt: 1
													}}
												>
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
				<Paper
					elevation={8}
					sx={{
						p: 5,
						mt: 4,
						borderRadius: 4,
						bgcolor: isDarkMode ? "#1e1e1e" : "#FAFAFA",
						boxShadow: isDarkMode ? "0 4px 12px rgb(5, 5, 6)" : "0 4px 12px rgb(202, 203, 206)"
					}}
				>
					<Box
						sx={{
							flexGrow: 1,
							padding: 4,
							marginLeft: drawerOpen ? "260px" : "0px",
							transition: "margin-left 0.3s ease-in-out"
						}}
					>
						<Grid container spacing={4} justifyContent="center">
							{[
								{ label: "Category", value: category, setValue: setCategory, options: categories },
								{
									label: "Granularity",
									value: granularity,
									setValue: setGranularity,
									options: granularities
								},
								{ label: "Group By", value: groupBy, setValue: setGroupBy, options: groupes }
							].map((field, index) => (
								<Grid item xs={12} sm={4} key={index}>
									<FormControl fullWidth variant="outlined">
										<InputLabel
											sx={{ color: isDarkMode ? "#90CAF9" : "#000158", fontWeight: "bold" }}
										>
											{field.label}
										</InputLabel>
										<Select
											value={field.value}
											onChange={(e) => field.setValue(e.target.value)}
											label={field.label}
											sx={{
												background: "transparent",
												borderRadius: "10px",
												borderColor: isDarkMode ? "#90CAF9" : "#4B6EFD",
												transition: "all 0.3s ease",
												"& .MuiSelect-icon": { color: isDarkMode ? "#90CAF9" : "#000158" },
												"& .MuiOutlinedInput-root": {
													padding: "10px 15px",
													"&:hover": { borderColor: isDarkMode ? "#64B5F6" : "#3C5DFF" }
												},
												"& .MuiMenuItem-root": { padding: "10px 15px" }
											}}
										>
											{field.options.map((option) => (
												<MenuItem key={option.key} value={option.key}>
													{option.label}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							))}
						</Grid>

						<Grid container spacing={4} justifyContent="center" sx={{ mt: 5 }}>
							<Grid item xs={12} md={6}>
								<Grid container spacing={3}>
									{[
										{ label: "Start Date", value: startDate, setValue: setStartDate },
										{ label: "End Date", value: endDate, setValue: setEndDate }
									].map((dateField, index) => (
										<Grid item xs={6} key={index}>
											<TextField
												label={dateField.label}
												type="date"
												fullWidth
												variant="outlined"
												InputLabelProps={{
													shrink: true,
													sx: {
														color: isDarkMode ? "#90CAF9" : "#000158",
														fontWeight: "bold"
													}
												}}
												value={dateField.value}
												onChange={(e) => dateField.setValue(e.target.value)}
											/>
										</Grid>
									))}
								</Grid>

								<Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 3 }}>
									<Button
										variant="contained"
										onClick={applyFilters}
										sx={{
											borderRadius: 4,
											px: 5,
											py: 1.5,
											fontWeight: "bold",
											textTransform: "none",
											transition: "all 0.3s",
											backgroundColor: isDarkMode ? "#1565C0" : "#1976D2",
											boxShadow: isDarkMode
												? "0px 4px 10px rgba(144, 202, 249, 0.3)"
												: "0px 4px 10px rgba(25, 118, 210, 0.3)",
											"&:hover": {
												backgroundColor: isDarkMode ? "#0D47A1" : "#1565C0",
												transform: "scale(1.05)"
											}
										}}
									>
										Apply
									</Button>
									<Button
										variant="outlined"
										onClick={resetFilters}
										sx={{
											borderRadius: 4,
											px: 5,
											py: 1.5,
											fontWeight: "bold",
											textTransform: "none",
											borderColor: isDarkMode ? "#B0BEC5" : "#757575",
											color: isDarkMode ? "#ECEFF1" : "#424242",
											transition: "all 0.3s",
											"&:hover": {
												borderColor: isDarkMode ? "#CFD8DC" : "#424242",
												transform: "scale(1.05)"
											}
										}}
									>
										Reset
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Paper>
				{/* ==================================== Table section =================================== */}
				<Paper
					elevation={8}
					sx={{
						p: 5,
						mt: 4,
						borderRadius: 4,
						bgcolor: isDarkMode ? "#1e1e1e" : "#FAFAFA",
						boxShadow: isDarkMode ? "0 4px 12px rgb(5, 5, 6)" : "0 4px 12px rgb(202, 203, 206)"
					}}
				>
					<Grid item xs={12} md={12}>
						<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
							<Typography color={isDarkMode ? "#B0BEC5" : "gray"} variant="h5">
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
								{error.includes("Network") ? "Check your network and try again." : error}
							</Typography>
						) : !data || !data[category] || Object.keys(data[category]).length === 0 ? (
							<Typography color="textSecondary" variant="h6" align="center">
								Apply filter to see data on table
							</Typography>
						) : (
							<>
								<TableContainer
									component={Paper}
									sx={{
										borderRadius: "8px",
										boxShadow: isDarkMode
											? "0px 5px 10px rgba(255, 255, 255, 0.1)"
											: "0px 5px 10px rgba(0, 0, 0, 0.1)",
										overflowX: "auto",
										bgcolor: isDarkMode ? "#2C2C2C" : "#FFFFFF"
									}}
								>
									<Table
										sx={{
											minWidth: 750,
											border: isDarkMode ? "1px solid #555" : "1px solid #ddd",
											borderRadius: 2,
											overflow: "hidden"
										}}
									>
										<TableHead>
											<TableRow
												sx={{
													backgroundColor: isDarkMode ? "#424242" : "#f5f5f5",
													borderBottom: "2px solid #ddd"
												}}
											>
												<TableCell
													sx={{
														fontWeight: "bold",
														color: isDarkMode ? "#E0E0E0" : "#333",
														borderRight: "1px solid #ddd",
														px: 2
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
															color: isDarkMode ? "#E0E0E0" : "#333",
															textAlign: "center",
															borderRight: "1px solid #ddd",
															px: 2
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
													"&:nth-of-type(odd)": {
														backgroundColor: isDarkMode ? "#383838" : "#fafafa"
													},
													"&:hover": { backgroundColor: isDarkMode ? "#4A4A4A" : "#f0f0f0" }
												}}
											>
												<TableCell
													sx={{
														fontWeight: "bold",
														borderRight: "1px solid #ddd",
														px: 2
													}}
												>
													Values
												</TableCell>
												<TableCell
													sx={{ textAlign: "center", borderRight: "1px solid #ddd", px: 2 }}
												>
													{data[category]?.total_signup_users || "N/A"}
												</TableCell>
												<TableCell
													sx={{ textAlign: "center", borderRight: "1px solid #ddd", px: 2 }}
												>
													{data[category]?.total_retained_users || "N/A"}
												</TableCell>
												<TableCell
													sx={{ textAlign: "center", borderRight: "1px solid #ddd", px: 2 }}
												>
													{data[category]?.total_retained_users_with_tokens || "N/A"}
												</TableCell>
												<TableCell
													sx={{ textAlign: "center", borderRight: "1px solid #ddd", px: 2 }}
												>
													{data[category]?.total_signups_from_bridges || "N/A"}
												</TableCell>
												<TableCell
													sx={{ textAlign: "center", borderRight: "1px solid #ddd", px: 2 }}
												>
													{data[category]?.total_signup_countries || "N/A"}
												</TableCell>
												<TableCell
													sx={{ textAlign: "center", borderRight: "1px solid #ddd", px: 2 }}
												>
													{data[category]?.total_publications || "N/A"}
												</TableCell>
												<TableCell sx={{ textAlign: "center", px: 2 }}>
													{data[category]?.signup_countries?.length
														? data[category].signup_countries
																.map((code) => getName(code) || code)
																.join(", ")
														: "N/A"}
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
						)}
					</Grid>
				</Paper>
			</Box>
		</Box>
	);
};

export default Content;
