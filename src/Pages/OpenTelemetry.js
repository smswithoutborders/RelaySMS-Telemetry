import React, { useState, useEffect } from "react";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField
} from "@mui/material";
import { BarChart as BarChartIcon, LocationOn as LocationOnIcon } from "@mui/icons-material";
import "../index.css";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define drawer width for the sidebar
const drawerWidth = 240;

const OpenTelemetry = () => {
	// Define state variables
	const [countryTableData, setCountryTableData] = useState([]);
	const [totalUsers, setTotalUsers] = useState(0);
	const [displayType, setDisplayType] = useState("Total Users"); // Add displayType state

	// Dummy data for demonstration
	useEffect(() => {
		const dummyCountryTableData = [
			["USA", "Washington", 100],
			["Canada", "Ottawa", 200],
			["Mexico", "Mexico City", 300]
		];
		setCountryTableData(dummyCountryTableData);

		const dummyTotalUsers = 600;
		setTotalUsers(dummyTotalUsers);
	}, []);

	const monthlyData = [
		{ month: "January", availableUsers: 120 },
		{ month: "February", availableUsers: 150 },
		{ month: "March", availableUsers: 130 },
		{ month: "April", availableUsers: 170 }
	];
	const lineChartData = {
		labels: monthlyData.map((data) => data.month),
		datasets: [
			{
				label: displayType === "Sign Up Users" ? "Sign Up Users" : "Available Users",
				data:
					displayType === "Sign Up Users"
						? [50, 60, 45, 55]
						: monthlyData.map((data) => data.availableUsers),
				fill: false,
				backgroundColor: "rgb(75, 192, 192)",
				borderColor: "rgba(75, 192, 192, 0.2)"
			}
		]
	};

	return (
		<Box
			component="main"
			sx={{
				px: { md: 3, sm: 3, xs: 2 },
				pb: { md: 3, sm: 3, xs: 14 },
				flexGrow: 1
			}}
		>
			{/* Container Grid for Main Layout */}
			<Grid container sx={{ p: 2 }} justifyContent="center" alignItems="center" direction="row">
				{/* Sidebar Section */}
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

				{/* Main Content Area */}
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
						{/* Total and Country Cards */}
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
												<Typography variant="h3" className="total" id="total">
													{totalUsers}
												</Typography>
												<Typography className="textsmall" id="totalheader">
													TOTAL
												</Typography>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>

							{/* Country Total Card */}
							<Grid item xs={12} sm={6} md={2}>
								<Card className={" card2 text-center"} id="card2">
									<CardContent>
										<Grid container justifyContent="center" alignItems="center">
											<Grid item xs={3}>
												<LocationOnIcon fontSize="large" className="icon2" />
											</Grid>
											<Grid item xs={6} id="countrytotaldiv">
												<Typography variant="h3" className="total" id="countrytotal">
													{countryTableData.reduce((acc, row) => acc + row[2], 0)}
												</Typography>
												<Typography className="textsmall">COUNTRY TOTAL</Typography>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
						</Grid>

						{/* Form Controls for Filtering Data */}
						<Grid container spacing={2} sx={{ mt: 3 }}>
							{/* Type Select */}
							<Grid item xs={12} sm={6} md={3}>
								<FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
									<InputLabel id="display-type-label">Display Type</InputLabel>
									<Select
										labelId="display-type-label"
										id="display-type"
										value={displayType}
										onChange={(e) => setDisplayType(e.target.value)}
										label="Display Type"
									>
										<MenuItem value="Total Users">Total Users</MenuItem>
										<MenuItem value="Sign Up Users">Sign Up Users</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							{/* Start Date Picker */}
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									id="start-date"
									label="Start Date"
									type="date"
									defaultValue="2023-01-01"
									InputLabelProps={{
										shrink: true
									}}
									fullWidth
								/>
							</Grid>

							{/* End Date Picker */}
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									id="end-date"
									label="End Date"
									type="date"
									defaultValue="2023-12-31"
									InputLabelProps={{
										shrink: true
									}}
									fullWidth
								/>
							</Grid>
						</Grid>

						{/* Chart and Table in Row and Column */}
						<Grid container spacing={2} sx={{ mt: 3 }}>
							<Grid item xs={12} md={6}>
								<Box sx={{ height: "300px" }}>
									<Typography variant="h6">Users Over Time</Typography>
									<Line
										data={lineChartData}
										options={{
											responsive: true,
											maintainAspectRatio: false
										}}
									/>
								</Box>
							</Grid>

							<Grid item xs={12} md={6}>
								<Table className="table text-center text-light">
									<TableHead>
										<TableRow>
											<TableCell>Country</TableCell>
											<TableCell>Users</TableCell>
											<TableCell>Percentage</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{countryTableData.map((row, index) => (
											<TableRow key={index}>
												<TableCell>{row[0]}</TableCell>
												<TableCell>{row[2]}</TableCell>
												<TableCell>{((row[2] / totalUsers) * 100).toFixed(1) + "%"}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								<br />

								<Table className="table text-center text-light">
									<TableHead>
										<TableRow>
											<TableCell>Country</TableCell>
											<TableCell>Users</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{countryTableData.map((row, index) => (
											<TableRow key={index}>
												<TableCell>{row[0]}</TableCell>
												<TableCell>{row[2]}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
