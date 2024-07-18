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
import axios from "axios";
import ApexCharts from "apexcharts";
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
	const [chart, setChart] = useState(null);

	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		setStartDate(today);
		setEndDate(today);
		fetchData(today, today, displayType, format);
	}, []);

	useEffect(() => {
		if (data) {
			handleData(data);
			extractChartData(data);
		}
	}, [data]);

	useEffect(() => {
		if (chart) {
			try {
				const apexChart = new ApexCharts(document.querySelector("#chart"), chart);
				apexChart.render();
			} catch (error) {
				console.error("Error rendering chart:", error);
			}
		}
	}, [chart]);

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
		if (displayType === "signup") {
			setTotalUsers(data.total_signups || 0); // Set total signups for the "Sign Up Users" display type
		} else {
			setTotalUsers(data.total_users || 0); // Set total users for the "Total Users" display type
		}
	};

	const extractChartData = (data) => {
		if (!data || !data[displayType]) {
			console.error(`Data for display type '${displayType}' is undefined.`);
			return;
		}

		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		];
		const days = Array.from({ length: 31 }, (_, i) => i + 1);
		const categories = format === "month" ? months : days;

		const chartData = categories.map((_, index) => {
			return data[displayType][index] ? data[displayType][index][1] : 0;
		});

		const options = {
			chart: {
				height: 350,
				type: "line",
				zoom: { enabled: false }
			},
			series: [{ name: displayType, data: chartData }],
			dataLabels: { enabled: false },
			stroke: { curve: "smooth" },
			xaxis: { categories }
		};

		setChart(options);
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
								<Card className={" card1 text-center"}>
									<CardContent>
										<Grid container justifyContent="center" alignItems="center">
											<Grid item xs={3} className="icondiv">
												<BarChartIcon fontSize="large" className="icon1" />
											</Grid>
											<Grid item xs={6}>
												<Typography variant="h3">{totalUsers}</Typography>
												<Typography className="textsmall">TOTAL</Typography>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>

							{/* Conditional Country Total Card */}
							{displayType === "available" && (
								<Grid item xs={12} sm={6} md={2}>
									<Card className={" card2 text-center"} id="card2">
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
										<FormControlLabel value="day" control={<Radio />} label="Day" />
									</RadioGroup>
								</FormControl>
							</Grid>

							{/* Start Date Picker */}
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									id="start-date"
									label="Start Date"
									type="date"
									value={startDate}
									onChange={handleStartDateChange}
									InputLabelProps={{ shrink: true }}
									fullWidth
								/>
							</Grid>

							{/* End Date Picker */}
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									id="end-date"
									label="End Date"
									type="date"
									value={endDate}
									onChange={handleEndDateChange}
									InputLabelProps={{ shrink: true }}
									fullWidth
								/>
							</Grid>
						</Grid>

						{/* Refresh Button */}
						<Grid item xs={12} sx={{ mt: 2 }}>
							<Stack direction="row" spacing={2} justifyContent="center">
								<Button variant="contained" color="primary" onClick={handleRefresh}>
									Refresh
								</Button>
							</Stack>
						</Grid>

						{/* Data Table */}
						<Grid item xs={6}>
							<TableContainer component={Paper} sx={{ maxHeight: 400, marginTop: 3 }}>
								<Table sx={{ minWidth: 650 }} aria-label="country table">
									<TableHead>
										<TableRow>
											<TableCell>COUNTRY</TableCell>
											<TableCell>USERS</TableCell>
											<TableCell>PERCENTAGE</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data && data[displayType] && data[displayType].length > 0 ? (
											data[displayType].map((item, index) => (
												<TableRow key={index}>
													<TableCell>{item[0]}</TableCell>
													<TableCell>{item[2]}</TableCell>
													<TableCell>{((item[2] / totalUsers) * 100).toFixed(2)}%</TableCell>
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
						<Grid item xs={6}>
							<TableContainer sx={{ minWidth: 650 }} aria-label="country table">
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
							</TableContainer>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
