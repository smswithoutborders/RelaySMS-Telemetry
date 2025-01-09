import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Grid
} from "@mui/material";
import axios from "axios";

function OpenTelemetry() {
	const [data, setData] = useState([]);
	const [totalUsers, setTotalUsers] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [category, setCategory] = useState("signup"); // Default category

	useEffect(() => {
		loadUsersData();
	}, [category]); // Re-fetch data when the category changes

	const loadUsersData = async () => {
		try {
			setLoading(true);
			const response = await axios.get(
				`https://api.telemetry.staging.smswithoutborders.com/v1/${category}?start_date=2022-01-10&end_date=2025-01-10&granularity=day&group_by=date&page=1&page_size=10`
			);
			setData(response.data[category].data);
			setTotalUsers(response.data[category].total_signup_users || 0); // Adjust based on your API response
			setLoading(false);
		} catch (err) {
			console.error("Error loading data:", err);
			setError(err.message || "Failed to load data");
			setLoading(false);
		}
	};

	const handleCategoryChange = (event) => {
		setCategory(event.target.value);
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
			<Grid container sx={{ p: 2 }} justifyContent="center" alignItems="center">
				<Grid item lg={2} md={3} sx={{ display: { xs: "none", md: "block" } }}></Grid>
				<Grid
					item
					lg={10}
					md={9}
					xs={12}
					sx={{
						p: { md: 3, sm: 2, xs: 1 }
					}}
				>
					<Typography variant="h4" gutterBottom>
						Telemetry Data
					</Typography>

					<FormControl sx={{ minWidth: 200, mb: 2 }}>
						<InputLabel id="category-select-label">Category</InputLabel>
						<Select
							labelId="category-select-label"
							value={category}
							onChange={handleCategoryChange}
						>
							<MenuItem value="signup">Signup Users</MenuItem>
							<MenuItem value="retained">Retained Users</MenuItem>
							<MenuItem value="summary">Summary</MenuItem>
						</Select>
					</FormControl>

					{loading && <Typography>Loading data...</Typography>}
					{error && <Typography color="error">Error: {error}</Typography>}
					{!loading && !error && (
						<>
							<Typography variant="h6" gutterBottom>
								Total{" "}
								{category === "signup"
									? "Signup"
									: category === "retained"
										? "Retained"
										: "Summary"}{" "}
								Users: {totalUsers}
							</Typography>
							<TableContainer component={Paper}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>
												<strong>Date</strong>
											</TableCell>
											<TableCell align="right">
												<strong>Users</strong>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data.map((row, index) => (
											<TableRow key={index}>
												<TableCell>{row.timeframe}</TableCell>
												<TableCell align="right">
													{row.signup_users || row.retained_users || row.summary_users || "N/A"}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</>
					)}
				</Grid>
			</Grid>
		</Box>
	);
}

export default OpenTelemetry;
