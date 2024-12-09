import React, { useState, useEffect } from "react";
import { Box, Grid, Card, TextField, Button } from "@mui/material";
import { Typography } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Country = [
	{ value: "US", label: "United States" },
	{ value: "IN", label: "India" }
];

const OpenTelemetry = () => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [country, setCountry] = useState("");
	const [category, setCategory] = useState("");
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);

	// Fetch data from the API
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"https://6616b7bbed6b8fa4348132c4.mockapi.io/api/v1/summaries"
				);
				const apiData = await response.json();
				setData(apiData);
				setFilteredData(apiData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	// Apply Filters
	const applyFilters = () => {
		let result = data;

		if (startDate) {
			result = result.filter((item) => new Date(item.date) >= new Date(startDate));
		}
		if (endDate) {
			result = result.filter((item) => new Date(item.date) <= new Date(endDate));
		}
		if (country) {
			result = result.filter((item) => item.summary?.country === country);
		}
		if (category) {
			result = result.filter((item) => item.summary?.category === category);
		}

		setFilteredData(result);
	};

	// Calculate Total Countries
	const totalCountries = [...new Set(filteredData.map((item) => item.summary?.country))].length;

	// Calculate Percentage Per Month
	const currentMonth = dayjs().month(); // Get current month index (0-11)
	const currentMonthEntries = filteredData.filter(
		(item) => dayjs(item.date).month() === currentMonth
	).length;
	const percentagePerMonth =
		filteredData.length > 0 ? ((currentMonthEntries / filteredData.length) * 100).toFixed(2) : 0;

	return (
		<Box
			className="main-container"
			component="main"
			sx={{
				px: { md: 3, sm: 3, xs: 2 },
				pb: { md: 3, sm: 3, xs: 14 },
				flowGrow: 1
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
						display: { xs: "none", sm: "none", md: "block" }
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
						p: { md: 3, sm: 2, xs: 0 }
					}}
				>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(250, 1fr))",
							gap: 3
						}}
					>
						<Grid item md={12} xs={12}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									flexWrap: "wrap",
									gap: 2,
									backgroundColor: "transparent",
									width: "100%",
									padding: 2
								}}
							>
								{/* Total Countries */}
								<Card
									sx={{
										flex: "1 1 calc(33.33% - 16px)",
										minWidth: "250px",
										maxWidth: "300px",
										height: "150px",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										backgroundColor: "#fff",
										borderRadius: 2,
										boxShadow: 3,
										textAlign: "center"
									}}
								>
									<Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
										Total Countries
									</Typography>
									<Typography variant="h4">{totalCountries}</Typography>
								</Card>

								{/* Total Users */}
								<Card
									sx={{
										flex: "1 1 calc(33.33% - 16px)",
										minWidth: "250px",
										maxWidth: "300px",
										height: "150px",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										backgroundColor: "#fff",
										borderRadius: 2,
										boxShadow: 3,
										textAlign: "center"
									}}
								>
									<Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
										Total Users
									</Typography>
									<Typography variant="h4">{filteredData.length}</Typography>
								</Card>

								{/* Percentage Per Month */}
								<Card
									sx={{
										flex: "1 1 calc(33.33% - 16px)",
										minWidth: "250px",
										maxWidth: "300px",
										height: "150px",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										backgroundColor: "#fff",
										borderRadius: 2,
										boxShadow: 3,
										textAlign: "center"
									}}
								>
									<Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
										Percentage per Month
									</Typography>
									<Typography variant="h4">{percentagePerMonth}%</Typography>
								</Card>
							</Box>
						</Grid>

						{/* Filter Section */}
						<Grid item md={12} xs={6}>
							<Card
								sx={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
									gap: 3,
									p: 2
								}}
							>
								{/* Country filter */}
								<TextField
									id="country"
									select
									value={country}
									onChange={(e) => setCountry(e.target.value)}
									SelectProps={{ native: true }}
									helperText="Please select your country"
									variant="filled"
								>
									<option value="" disabled>
										Select a country
									</option>
									{Country.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</TextField>

								{/* Category filter */}
								<TextField
									id="category"
									select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									SelectProps={{ native: true }}
									helperText="Pick a category"
									variant="filled"
								>
									<option value="" disabled>
										Select a category
									</option>
									<option value="sign_up">Sign-Up Users</option>
									<option value="active_user">Active Users</option>
									<option value="users_with_token">Users with Token</option>
								</TextField>
							</Card>
							{/* second section */}
							<Card
								sx={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
									gap: 3,
									p: 2
								}}
							>
								{/* Start date filter */}
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										label="Start Date"
										value={startDate}
										onChange={(newValue) => setStartDate(newValue)}
										renderInput={(params) => <TextField {...params} variant="filled" />}
									/>
								</LocalizationProvider>

								{/* End date filter */}
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										label="End Date"
										value={endDate}
										onChange={(newValue) => setEndDate(newValue)}
										renderInput={(params) => <TextField {...params} variant="filled" />}
									/>
								</LocalizationProvider>
								<Button variant="contained" color="primary" onClick={applyFilters} fullWidth>
									Apply Filters
								</Button>
							</Card>
						</Grid>
						{/* End of filter */}

						{/* table section  */}
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
