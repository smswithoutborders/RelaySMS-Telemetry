import React, { useState } from "react";
import {
	Box,
	Grid,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper
} from "@mui/material";

const drawerWidth = 240;

const OpenTelemetry = () => {
	// State variables for filtering and data representation
	const [filterType, setFilterType] = useState("perDay");
	const [filterCountry, setFilterCountry] = useState("");
	const [filterDate, setFilterDate] = useState("");

	// Sample data
	const countries = ["USA", "Canada", "Germany", "France"];
	const signupData = [
		{ id: 1, signupTime: "2024-10-01", country: "USA" },
		{ id: 2, signupTime: "2024-10-02", country: "Canada" },
		{ id: 3, signupTime: "2024-09-15", country: "Germany" },
		{ id: 4, signupTime: "2024-08-21", country: "France" }
	];
	const deletedAccounts = 15;
	const totalSignupUsers = signupData.length;
	const totalCountries = new Set(signupData.map((data) => data.country)).size;

	// Handle filter change
	const handleFilterChange = (e) => {
		setFilterType(e.target.value);
	};

	// Handle country filter change
	const handleCountryChange = (e) => {
		setFilterCountry(e.target.value);
	};

	// Handle date filter change
	const handleDateChange = (e) => {
		setFilterDate(e.target.value);
	};

	// Filtered data based on filters applied
	const filteredData = signupData.filter((item) => {
		return (
			(filterCountry === "" || item.country === filterCountry) &&
			(filterDate === "" || item.signupTime.includes(filterDate))
		);
	});

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
			<Grid container sx={{ p: 2 }} justifyContent="center" alignItems="center">
				{/* sidenavbar */}
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

				{/* Main content area that adjusts based on screen size */}
				<Grid
					mx="auto"
					item
					lg={10}
					md={9}
					xs={12}
					sm={12}
					sx={{
						p: { md: 3, sm: 2, xs: 0 },
						width: {
							sm: `calc(100% - ${drawerWidth}px)`,
							md: `calc(100% - ${drawerWidth}px)`
						}
					}}
				>
					{/* Nested Grid for additional layout control (spacing between elements) */}
					<Grid container columnSpacing={4} rowSpacing={4} alignItems="flex-end">
						<Grid item xs={12}>
							<Typography variant="h4">Open Telemetry Data</Typography>
						</Grid>

						{/* Display Boxes for Total Counts */}
						<Grid item xs={12} md={4}>
							<Box p={2} bgcolor="lightblue" borderRadius={2}>
								<Typography variant="h6">Total Countries</Typography>
								<Typography variant="h5">{totalCountries}</Typography>
							</Box>
						</Grid>

						<Grid item xs={12} md={4}>
							<Box p={2} bgcolor="lightgreen" borderRadius={2}>
								<Typography variant="h6">Total Signup Users</Typography>
								<Typography variant="h5">{totalSignupUsers}</Typography>
							</Box>
						</Grid>

						<Grid item xs={12} md={4}>
							<Box p={2} bgcolor="lightcoral" borderRadius={2}>
								<Typography variant="h6">Deleted Accounts</Typography>
								<Typography variant="h5">{deletedAccounts}</Typography>
							</Box>
						</Grid>

						{/* Filter Section */}
						<Grid item xs={12}>
							<Box p={2} border="1px solid lightgray" borderRadius={2}>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={4}>
										<FormControl fullWidth>
											<InputLabel>Filter By</InputLabel>
											<Select value={filterType} onChange={handleFilterChange}>
												<MenuItem value="perDay">Per Day</MenuItem>
												<MenuItem value="perMonth">Per Month</MenuItem>
												<MenuItem value="perYear">Per Year</MenuItem>
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12} sm={4}>
										<TextField
											fullWidth
											label="Filter by Date"
											type="date"
											InputLabelProps={{ shrink: true }}
											value={filterDate}
											onChange={handleDateChange}
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<FormControl fullWidth>
											<InputLabel>Filter by Country</InputLabel>
											<Select value={filterCountry} onChange={handleCountryChange}>
												<MenuItem value="">All Countries</MenuItem>
												{countries.map((country) => (
													<MenuItem key={country} value={country}>
														{country}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>
								</Grid>
							</Box>
						</Grid>

						{/* Tables for displaying filtered data */}
						<Grid item xs={12}>
							<Typography variant="h6">Filtered Signup Data</Typography>
							<TableContainer component={Paper}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Signup Time</TableCell>
											<TableCell>Country</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{filteredData.map((row) => (
											<TableRow key={row.id}>
												<TableCell>{row.signupTime}</TableCell>
												<TableCell>{row.country}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
