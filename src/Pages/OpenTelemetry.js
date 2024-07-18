import React, { useEffect, useState } from "react";
import {
	Box,
	Grid,
	Card,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper
} from "@mui/material";
import { BarChart as BarChartIcon, LocationOn as LocationOnIcon } from "@mui/icons-material";
import { Card as BootstrapCard } from "react-bootstrap";
import axios from "axios";
import ApexCharts from "apexcharts";
import "../index.css";

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
				zoom: {
					enabled: false
				}
			},
			series: [
				{
					name: displayType,
					data: chartData
				}
			],
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: "smooth"
			},
			xaxis: {
				categories
			}
		};

		setChart(options);
	};

	const handleData = (data) => {
		setTotalUsers(data.total_users || 0);
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

	return (
		<Box
			component="main"
			sx={{
				paddingX: { md: 3, sm: 3, xs: 2 },
				paddingBottom: { md: 3, sm: 3, xs: 14 },
				flexGrow: 1,
				marginTop: 6
			}}
		>
			<Grid container spacing={2} justifyContent="center">
				<Grid item xs={12} md={8}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={3}>
							<Card>
								<BootstrapCard>
									<BootstrapCard.Body>
										<BarChartIcon fontSize="large" />
										<Typography variant="h3">{totalUsers}</Typography>
										<Typography className="textsmall">TOTAL</Typography>
									</BootstrapCard.Body>
								</BootstrapCard>
							</Card>
						</Grid>

						<Grid item xs={12} sm={6} md={3}>
							<Card>
								<BootstrapCard>
									<BootstrapCard.Body>
										<LocationOnIcon fontSize="large" />
										<Typography variant="h3">{data ? data.total_countries || 0 : 0}</Typography>
										<Typography className="textsmall">COUNTRY TOTAL</Typography>
									</BootstrapCard.Body>
								</BootstrapCard>
							</Card>
						</Grid>

						<Grid item xs={12} sm={6} md={3}>
							<FormControl fullWidth variant="outlined">
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

						<Grid item xs={12} sm={6} md={3}>
							<FormControl fullWidth variant="outlined">
								<InputLabel id="format-label">Format</InputLabel>
								<Select
									labelId="format-label"
									id="format"
									value={format}
									onChange={handleFormatChange}
									label="Format"
								>
									<MenuItem value="month">Month</MenuItem>
									<MenuItem value="day">Day</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12} md={6}>
							<TextField
								id="start-date"
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

						<Grid item xs={12} md={6}>
							<TextField
								id="end-date"
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

						<Grid item xs={12}>
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

						<Grid item xs={12} style={{ marginTop: "3rem" }}>
							<Box id="chart" sx={{ marginTop: 3 }} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
