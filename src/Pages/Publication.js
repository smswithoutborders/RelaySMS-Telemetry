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
	useTheme
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import Navbar from "../Components/Nav";

const CircleChart = ({ value, maxValue, color }) => {
	const radius = 10.91549431; // radius of the circle
	const circumference = 2 * Math.PI * radius;
	const percentage = (value / maxValue) * 100;
	const strokeDasharray = (circumference * percentage) / 100;

	return (
		<div className="update-charts">
			<svg
				className="circle-chart"
				viewBox="0 0 33.83098862 33.83098862"
				width="200"
				height="200"
				xmlns="http://www.w3.org/2000/svg"
			>
				{/* Background Circle */}
				<circle
					className="circle-chart__background"
					stroke="#e0e0e0"
					strokeWidth="2"
					fill="none"
					cx="16.91549431"
					cy="16.91549431"
					r={radius}
				/>

				{/* Progress Circle */}
				<circle
					className="circle-chart__circle"
					stroke={color || "#ffa000"}
					strokeWidth="2"
					strokeDasharray={strokeDasharray}
					strokeLinecap="round"
					fill="none"
					cx="16.91549431"
					cy="16.91549431"
					r={radius}
					transform="rotate(-90 16.91549431 16.91549431)"
				/>

				{/* Text Showing the Percentage */}
				<g className="circle-chart__info">
					<text
						className="circle-chart__percent"
						x="16.91549431"
						y="16.5"
						alignmentBaseline="central"
						fill="white"
						textAnchor="middle"
						fontSize="5"
					>
						{percentage.toFixed(1)}%
					</text>
				</g>
			</svg>
		</div>
	);
};

const Dashboard = () => {
	const theme = useTheme();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	const salesData = [
		{ month: "Jan", sales: 4000 },
		{ month: "Feb", sales: 6000 },
		{ month: "Mar", sales: 8000 },
		{ month: "Apr", sales: 10000 },
		{ month: "May", sales: 15000 }
	];

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
					`https://api.telemetry.smswithoutborders.com/v1/summary?start_date=2021-01-10&end_date=${formattedToday}&granularity=day&group_by=date&page=1&page_size=100`
				);
				const result = await response.json();
				setData(result);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (loading) {
		return <Typography>Loading...</Typography>;
	}

	const summary = data?.summary || {};

	// Get data from API response for the chart
	const sales = summary.total_signup_users || 0;
	const expenses = summary.total_retained_users || 0;
	const income = sales - expenses;

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
					{[
						{ title: "Signups", Total: summary.total_signup_users, max: 30000, color: "primary" },
						{
							title: "Retained Users",
							Total: summary.total_retained_users,
							max: 20000,
							color: "error"
						},
						{ title: "Income", Total: income, max: 30000, color: "success" }
					].map((item, index) => (
						<Grid item xs={12} sm={4} md={3} key={index}>
							<Paper
								elevation={3}
								sx={{ p: 2, borderRadius: 2, bgcolor: "white", textAlign: "center" }}
							>
								<Typography variant="h6">{item.title}</Typography>
								<Typography variant="h5" color={item.color} fontWeight="bold">
									${item.Total.toLocaleString()}
								</Typography>
								<Box sx={{ position: "relative", display: "inline-flex", mt: 2 }}>
									<CircleChart value={item.Total} maxValue={item.max} color={item.color} />
								</Box>
							</Paper>
						</Grid>
					))}
				</Grid>

				{/* ======================================================= */}
				{/* Second Row (4 Columns with Tables) */}
				<Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
					{[
						{ title: "Signup Countries", data: summary.signup_countries, headers: ["Country"] },
						{ title: "Retained Countries", data: summary.retained_countries, headers: ["Country"] }
					].map((item, index) => (
						<Grid item xs={12} sm={6} md={6} key={index}>
							<Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: "white" }}>
								<Typography variant="h6" sx={{ mb: 2 }}>
									{item.title}
								</Typography>
								{renderTable(
									item.data.map((country) => ({ Country: country })),
									item.headers
								)}
							</Paper>
						</Grid>
					))}
				</Grid>

				{/* Third Row (Charts & Additional Table) */}
				<Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
					{/* Sales Bar Chart */}
					<Grid item xs={12} md={6}>
						<Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: "white" }}>
							<Typography variant="h6" sx={{ mb: 2 }}>
								Sales Trend
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
	);
};

export default Dashboard;
