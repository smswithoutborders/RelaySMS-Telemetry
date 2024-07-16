import React, { useState, useEffect } from "react";
import {
	Grid,
	Box,
	Card,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	FormControl,
	InputLabel,
	Select,
	MenuItem
} from "@mui/material";
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

import DateSearch from "../Components/DateSearch";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const apiUrl = `${process.env.REACT_APP_GATEWAY_SERVER_URL}/v3/clients`;

const useClientData = (startDate, endDate) => {
	const [totalRows, setTotalRows] = useState(0);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchClientData = async () => {
			setLoading(true);
			try {
				const url = new URL(apiUrl);
				const params = {
					per_page: 10,
					...(startDate && { start_date: startDate }),
					...(endDate && { end_date: endDate })
				};
				url.search = new URLSearchParams(params).toString();

				const response = await fetch(url);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const totalCount = parseInt(response.headers.get("X-Total-Count"));
				setTotalRows(totalCount);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchClientData();
	}, [startDate, endDate]);

	return { totalRows, loading };
};

const OpenTelemetry = () => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const [countryFilter, setCountryFilter] = useState("");
	const [monthFilter, setMonthFilter] = useState("");
	const [displayType, setDisplayType] = useState("Total Users");

	const { totalRows } = useClientData(startDate, endDate);

	const countryData = [
		{ country: "USA", percentage: 20 },
		{ country: "Canada", percentage: 15 },
		{ country: "UK", percentage: 10 },
		{ country: "Germany", percentage: 5 }
	];

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

	const getFilteredCountryData = () => {
		if (!countryFilter) return countryData;
		return countryData.filter((item) =>
			item.country.toLowerCase().includes(countryFilter.toLowerCase())
		);
	};

	const getFilteredMonthlyData = () => {
		if (!monthFilter) return monthlyData;
		return monthlyData.filter((item) =>
			item.month.toLowerCase().includes(monthFilter.toLowerCase())
		);
	};

	const getTotalUsers = () => {
		return getFilteredMonthlyData().reduce((total, item) => total + item.availableUsers, 0);
	};

	const getTotalPercentage = () => {
		return getFilteredCountryData().reduce((total, item) => total + item.percentage, 0);
	};

	return (
		<Box
			className="bg"
			component="main"
			sx={{
				px: { md: 3, sm: 3, xs: 2 },
				pb: { md: 3, sm: 3, xs: 14 },
				flexGrow: 1
			}}
		>
			<Grid container justifyContent="center" alignItems="center" direction="row">
				<Grid
					item
					xs={12}
					md={10}
					lg={10}
					sx={{
						p: { md: 3, sm: 2, xs: 0 }
					}}
				>
					<Grid
						container
						spacing={4}
						alignItems="flex-end"
						sx={{ py: { md: 5, sm: 5, xs: 1 }, pt: { md: 3, xs: 2, sm: 2 } }}
					>
						<Grid item md={3} xs={6}>
							<Card sx={{ p: 2 }}>
								<Typography textAlign="center" variant="h3" sx={{ fontWeight: 600 }}>
									{displayType === "Sign Up Users" ? 200 : totalRows}
								</Typography>
								<Typography
									textAlign="center"
									variant="body1"
									sx={{ fontWeight: 500, p: 1, fontSize: { md: 14, sm: 14, xs: 12 } }}
								>
									{displayType === "Sign Up Users" ? "Total Sign Up Users" : "Total Available"}
								</Typography>
							</Card>
						</Grid>
						<Grid item md={3} xs={6}>
							<Card sx={{ p: 2 }}>
								<Typography textAlign="center" variant="h3" sx={{ fontWeight: 600 }}>
									{getTotalPercentage()}%
								</Typography>
								<Typography
									textAlign="center"
									variant="body1"
									sx={{ fontWeight: 500, p: 1, fontSize: { md: 14, sm: 14, xs: 12 } }}
								>
									Country Total Percentage
								</Typography>
							</Card>
						</Grid>
						<Grid item md={3} xs={6}>
							<DateSearch onSelectDate={setStartDate} />
						</Grid>
						<Grid item md={3} xs={6}>
							<DateSearch onSelectDate={setEndDate} />
						</Grid>
					</Grid>

					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
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
						<Grid item xs={12} md={6}>
							<FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
								<InputLabel id="country-filter-label">Filter by Country</InputLabel>
								<Select
									labelId="country-filter-label"
									id="country-filter"
									value={countryFilter}
									onChange={(e) => setCountryFilter(e.target.value)}
									label="Filter by Country"
								>
									<MenuItem value="">
										<em>All Countries</em>
									</MenuItem>
									{countryData.map((item, index) => (
										<MenuItem key={index} value={item.country}>
											{item.country}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
								<InputLabel id="date-filter-label">Filter by Date</InputLabel>
								<Select
									labelId="date-filter-label"
									id="date-filter"
									value={monthFilter}
									onChange={(e) => setMonthFilter(e.target.value)}
									label="Filter by Date"
								>
									<MenuItem value="">
										<em>All</em>
									</MenuItem>
									<MenuItem value="months">Months</MenuItem>
									<MenuItem value="days">Days</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>

					<Grid container spacing={4} sx={{ mt: 4 }}>
						<Grid item xs={12} md={6}>
							<Typography variant="h6">Country Data</Typography>
							<Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Country</TableCell>
											<TableCell>
												{displayType === "Sign Up Users" ? "Sign Up Users" : "Percentage of Users"}
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{getFilteredCountryData().map((row, index) => (
											<TableRow key={index}>
												<TableCell>{row.country}</TableCell>
												<TableCell>
													{displayType === "Sign Up Users" ? "N/A" : `${row.percentage}%`}
												</TableCell>
											</TableRow>
										))}
										<TableRow>
											<TableCell>Total</TableCell>
											<TableCell>{getTotalPercentage()}%</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</Box>
						</Grid>

						<Grid item xs={12} md={6}>
							<Typography variant="h6">Monthly Data</Typography>
							<Box sx={{ height: "400px", overflowY: "auto" }}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Month</TableCell>
											<TableCell>
												{displayType === "Sign Up Users" ? "Sign Up Users" : "Available Users"}
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{getFilteredMonthlyData().map((row, index) => (
											<TableRow key={index}>
												<TableCell>{row.month}</TableCell>
												<TableCell>
													{displayType === "Sign Up Users" ? "N/A" : row.availableUsers}
												</TableCell>
											</TableRow>
										))}
										<TableRow>
											<TableCell>Total</TableCell>
											<TableCell>{getTotalUsers()}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</Box>
						</Grid>

						<Grid item xs={12}>
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
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
