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
	Stack,
	Button,
	FormLabel
} from "@mui/material";
import { BarChart as BarChartIcon, LocationOn as LocationOnIcon } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
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
		for (const year in data) {
			if (year !== "countries" && year !== "total_countries" && year !== "total_users") {
				data[year].forEach((entry) => {
					const month = entry[0];
					const users = entry[1];
					const country = entry[2] || "N/A"; // Adjust as needed
					chartData.push({ month, users, country });
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
			const { month, users, country } = payload[0].payload;
			return (
				<div
					className="custom-tooltip"
					style={{
						backgroundColor: isDarkMode ? "#333" : "#fff",
						color: isDarkMode ? "#fff" : "#000"
					}}
				>
					<p className="label">{`Month: ${month}`}</p>
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
									<FormLabel component="legend">Format</FormLabel>
									<RadioGroup
										row
										aria-label="format"
										name="format"
										value={format}
										onChange={handleFormatChange}
									>
										<FormControlLabel value="month" control={<Radio />} label="Month" />
										<FormControlLabel value="year" control={<Radio />} label="Year" />
									</RadioGroup>
								</FormControl>
							</Grid>

							{/* Date Range Inputs */}
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									label="Start Date"
									type="date"
									value={startDate}
									onChange={handleStartDateChange}
									InputLabelProps={{ shrink: true }}
									fullWidth
								/>
							</Grid>

							<Grid item xs={12} sm={6} md={3}>
								<TextField
									label="End Date"
									type="date"
									value={endDate}
									onChange={handleEndDateChange}
									InputLabelProps={{ shrink: true }}
									fullWidth
								/>
							</Grid>

							{/* Refresh Button */}
							<Grid item xs={12}>
								<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
									<Button variant="contained" color="primary" onClick={handleRefresh}>
										Refresh Data
									</Button>
								</Stack>
							</Grid>
						</Grid>

						{/* Chart and Table */}
						<Grid container spacing={2} sx={{ mt: 3 }}>
							{/* Chart */}
							<Grid item xs={12} md={6}>
								<Box sx={{ width: "100%" }}>
									<LineChart
										data={chartData}
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
										width={500}
										height={300}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="month" />
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
								<TableContainer component={Paper} sx={{ maxHeight: 400, overflowX: "auto" }}>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>COUNTRY</TableCell>
												<TableCell>USERS</TableCell>
												<TableCell>PERCENTAGE</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{data && data.countries && data.countries.length > 0 ? (
												data.countries.map((country, index) => (
													<TableRow key={index}>
														<TableCell>{country[0]}</TableCell>
														<TableCell>{country[2]}</TableCell>
														<TableCell>{((country[2] / totalUsers) * 100).toFixed(2)}%</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell colSpan={3} align="center">
														No data available
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</TableContainer>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
