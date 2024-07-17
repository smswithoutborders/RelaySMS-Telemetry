import React, { useState, useEffect } from "react";
import {
	Box,
	Grid,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from "recharts";
import { Container, Card as BootstrapCard } from "react-bootstrap";

const baseUrl = "https://smswithoutborders.com:11000"; // Base URL for API

const OpenTelemetry = () => {
	const [data, setData] = useState(null);
	const [totalUsers, setTotalUsers] = useState(0);
	const [displayType, setDisplayType] = useState("Total Users");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const fetchData = async (url) => {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();
			setData(data);
			handleData(data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleData = (data) => {
		setTotalUsers(data.total_users);
	};

	const displayLineChart = (type) => {
		let chartData = [];
		if (data) {
			Object.keys(data).forEach((item) => {
				if (item !== "countries" && item !== "total_users" && item !== "total_countries") {
					chartData.push({ name: item, [type]: data[item] });
				}
			});
		}

		return (
			<ResponsiveContainer width="100%" height={300}>
				<LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey={type} stroke="#8884d8" activeDot={{ r: 8 }} />
				</LineChart>
			</ResponsiveContainer>
		);
	};

	const handleDisplayTypeChange = (e) => {
		setDisplayType(e.target.value);
		fetchData(
			`${baseUrl}/users?start=${startDate}&end=${endDate}&type=available&format=${e.target.value.toLowerCase()}`
		);
	};

	const handleStartDateChange = (e) => {
		setStartDate(e.target.value);
		checkDate();
		fetchData(
			`${baseUrl}/users?start=${e.target.value}&end=${endDate}&type=available&format=${displayType.toLowerCase()}`
		);
	};

	const handleEndDateChange = (e) => {
		setEndDate(e.target.value);
		checkDate();
		fetchData(
			`${baseUrl}/users?start=${startDate}&end=${e.target.value}&type=available&format=${displayType.toLowerCase()}`
		);
	};

	const checkDate = () => {
		if (startDate === "") {
			setStartDate(endDate);
		} else if (endDate === "") {
			setEndDate(startDate);
		}
	};

	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		setStartDate(today);
		setEndDate(today);
		fetchData(`${baseUrl}/users?start=${today}&end=${today}&type=available&format=month`);
	}, []);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Container>
				<Grid container spacing={3} justifyContent="center">
					<Grid item xs={12} sm={6} md={4}>
						<BootstrapCard className="text-center">
							<BootstrapCard.Body>
								<BarChartIcon fontSize="large" />
								<Typography variant="h3">{totalUsers}</Typography>
								<Typography className="textsmall">TOTAL</Typography>
							</BootstrapCard.Body>
						</BootstrapCard>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<BootstrapCard className="text-center">
							<BootstrapCard.Body>
								<LocationOnIcon fontSize="large" />
								<Typography variant="h3">{data ? data.total_countries : 0}</Typography>
								<Typography className="textsmall">COUNTRY TOTAL</Typography>
							</BootstrapCard.Body>
						</BootstrapCard>
					</Grid>
				</Grid>

				<Grid container spacing={3} sx={{ mt: 3 }}>
					<Grid item xs={12} md={4}>
						<FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
							<InputLabel id="display-type-label">Display Type</InputLabel>
							<Select
								labelId="display-type-label"
								id="display-type"
								value={displayType}
								onChange={handleDisplayTypeChange}
								label="Display Type"
							>
								<MenuItem value="Total Users">Total Users</MenuItem>
								<MenuItem value="Sign Up Users">Sign Up Users</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4}>
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
					<Grid item xs={12} md={4}>
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
				</Grid>

				<Grid item xs={12} sx={{ mt: 3 }}>
					<div className="chart-container">
						{data && displayLineChart(displayType.toLowerCase())}
					</div>
				</Grid>
			</Container>
		</Box>
	);
};

export default OpenTelemetry;
