import React, { useEffect, useState } from "react";
import {
	Box,
	Grid,
	Card,
	CardContent,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	RadioGroup,
	FormControlLabel,
	Radio,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	FormLabel
} from "@mui/material";
import { BarChart as BarChartIcon, LocationOn as LocationOnIcon } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "../index.css";

const drawerWidth = 240;
const baseUrl = "https://smswithoutborders.com:11000";

const OpenTelemetry = () => {
	const [data, setData] = useState(null);
	const [totalUsers, setTotalUsers] = useState(0);
	const [displayType, setDisplayType] = useState("available");
	const [format, setFormat] = useState("month");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [chartData, setChartData] = useState([]);

	const theme = useTheme();
	const isDarkMode = theme.palette.mode === "dark";
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
	const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		setStartDate(today);
		setEndDate(today);
		fetchData(today, today, displayType, format);
	}, []);

	useEffect(() => {
		if (data) {
			handleData(data);
			prepareChartData(data);
		}
	}, [data]);

	const fetchData = async (start, end, type, format) => {
		try {
			const response = await axios.get(
				`${baseUrl}/users?start=${start}&end=${end}&type=${type}&format=${format}`
			);
			if (response.status === 200) {
				const responseData = response.data;
				setData(responseData);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleData = (data) => {
		setTotalUsers(data.total_users || 0);
	};

	const prepareChartData = (data) => {
		const chartData = [];
		const countries = data.countries || {}; // Ensure countries is defined

		for (const date in data) {
			if (date !== "countries" && date !== "total_countries" && date !== "total_users") {
				data[date].forEach((entry) => {
					const [monthDay, users, countryCode] = entry;
					const country = countries[countryCode] || "N/A"; // Use country name or "N/A"
					const percentage = totalUsers ? ((users / totalUsers) * 100).toFixed(2) + "%" : "0%";
					chartData.push({ monthDay, users, country, percentage });
				});
			}
		}
		setChartData(chartData);
	};

	const handleDisplayTypeChange = (e) => {
		const newDisplayType = e.target.value;
		setDisplayType(newDisplayType);
		fetchData(startDate, endDate, newDisplayType, format);
	};

	const handleFormatChange = (e) => {
		const newFormat = e.target.value;
		setFormat(newFormat);
		fetchData(startDate, endDate, displayType, newFormat);
	};

	const handleStartDateChange = (e) => {
		const newStartDate = e.target.value;
		setStartDate(newStartDate);
		fetchData(newStartDate, endDate, displayType, format);
	};

	const handleEndDateChange = (e) => {
		const newEndDate = e.target.value;
		setEndDate(newEndDate);
		fetchData(startDate, newEndDate, displayType, format);
	};

	const handleRefresh = () => {
		fetchData(startDate, endDate, displayType, format);
	};

	// Custom Tooltip component
	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const { monthDay, users, country } = payload[0].payload;
			return (
				<div
					className="custom-tooltip"
					style={{
						backgroundColor: isDarkMode ? "#333" : "#fff",
						color: isDarkMode ? "#fff" : "#000"
					}}
				>
					<p className="label">{`Date: ${monthDay}`}</p>
					<p className="intro">{`Users: ${users}`}</p>
					<p className="intro">{`Country: ${country}`}</p>
				</div>
			);
		}
		return null;
	};

	return (
		<Box
			className="bg"
			component="main"
			sx={{
				px: { md: 3, sm: 3, xs: 2 },
				pb: { md: 3, sm: 3, xs: 14 },
				pr: { md: 3, sm: 3, xs: 2 },
				flexGrow: 1
			}}
		>
			<Grid container sx={{ p: 2 }} justifyContent="center" alignItems="center" direction="row">
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
					<Box>
						<Grid container spacing={2} sx={{ mt: 3 }}>
							{/* Total Card */}
							<Grid item xs={12} sm={6} md={2}>
								<Card className={"card1 text-center"}>
									<CardContent>
										<Grid container justifyContent="center" alignItems="center">
											<Grid item xs={3} className="icondiv">
												<BarChartIcon fontSize="large" className="icon1" />
											</Grid>
											<Grid item xs={6}>
												<Typography variant="h3">{totalUsers}</Typography>
												<Typography className="textsmall">TOTAL USERS</Typography>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>

							{/* Conditional Country Total Card */}
							{displayType === "available" && (
								<Grid item xs={12} sm={6} md={2}>
									<Card className={"card2 text-center"} id="card2">
										<CardContent>
											<Grid container justifyContent="center" alignItems="center">
												<Grid item xs={3}>
													<LocationOnIcon fontSize="large" className="icon2" />
												</Grid>
												<Grid item xs={6} id="countrytotaldiv">
													<Typography variant="h3">
														{data ? data.total_countries || 0 : 0}
													</Typography>
													<Typography className="textsmall">COUNTRY TOTAL</Typography>
												</Grid>
											</Grid>
										</CardContent>
									</Card>
								</Grid>
							)}
						</Grid>

						<Grid container spacing={2} sx={{ mt: 3 }}>
							{/* Display Type Select */}
							<Grid item xs={12} sm={6} md={3}>
								<FormControl variant="outlined" fullWidth>
									<InputLabel id="display-type-label">Display Type</InputLabel>
									<Select
										labelId="display-type-label"
										id="display-type"
										value={displayType}
										onChange={handleDisplayTypeChange}
										label="Display Type"
									>
										<MenuItem value="available">Total Users</MenuItem>
										<MenuItem value="signup">Sign Up Users</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							{/* Format Radio Buttons */}
							<Grid item xs={12} sm={6} md={3}>
								<FormControl component="fieldset">
									<FormLabel component="legend">Date Format</FormLabel>
									<RadioGroup
										row
										aria-label="date-format"
										name="date-format"
										value={format}
										onChange={handleFormatChange}
									>
										<FormControlLabel value="month" control={<Radio />} label="Month" />
										<FormControlLabel value="day" control={<Radio />} label="Day" />
									</RadioGroup>
								</FormControl>
							</Grid>

							{/* Date Range */}
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									label="Start Date"
									type="date"
									value={startDate}
									onChange={handleStartDateChange}
									InputLabelProps={{
										shrink: true
									}}
									fullWidth
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									label="End Date"
									type="date"
									value={endDate}
									onChange={handleEndDateChange}
									InputLabelProps={{
										shrink: true
									}}
									fullWidth
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<Button variant="contained" onClick={handleRefresh} sx={{ mt: 2 }}>
									Refresh
								</Button>
							</Grid>
						</Grid>

						<Grid container spacing={2} sx={{ mt: 3 }}>
							{/* Chart */}
							<Grid item xs={12} md={6}>
								<Box
									sx={{
										width: "100%",
										maxWidth: "100%"
									}}
								>
									<LineChart
										data={chartData}
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
										width={
											isSmallScreen
												? window.innerWidth
												: isMediumScreen
													? 600
													: isLargeScreen
														? 800
														: window.innerWidth
										}
										height={450}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="monthDay" />
										<YAxis />
										<Tooltip content={<CustomTooltip />} />
										<Legend />
										<Line
											type="monotone"
											dataKey="users"
											stroke={isDarkMode ? "#82ca9d" : "#8884d8"}
											activeDot={{ r: 8 }}
										/>
									</LineChart>
								</Box>
							</Grid>

							{/* Table */}
							<Grid item xs={12} md={6}>
								<Box sx={{ maxHeight: "30rem", overflow: "auto" }}>
									<TableContainer component={Paper}>
										<Table sx={{ minWidth: 800 }}>
											<TableHead>
												<TableRow>
													<TableCell>Date</TableCell>
													<TableCell align="right">Users</TableCell>
													<TableCell align="right">Country</TableCell>
													<TableCell align="right">Percentage</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{chartData.map((row, index) => (
													<TableRow key={index}>
														<TableCell>{row.monthDay}</TableCell>
														<TableCell align="right">{row.users}</TableCell>
														<TableCell align="right">{row.country || "N/A"}</TableCell>
														<TableCell align="right">{row.percentage}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
