// import React, { useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChartSimple, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
// import {
// 	Box,
// 	Grid,
// 	Typography,
// 	Table,
// 	TableHead,
// 	TableBody,
// 	TableCell,
// 	TableRow,
// 	Tabs,
// 	Tab
// } from "@mui/material";
// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles((theme) => ({
// 	card: {
// 		borderRadius: "8px",
// 		boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
// 		backgroundColor: "#f0f0f0", // Example background color
// 		padding: theme.spacing(2),
// 		textAlign: "center"
// 	},
// 	smallbox: {
// 		backgroundColor: "#d0e8f2", // Example background color
// 		borderRadius: "8px",
// 		padding: theme.spacing(2),
// 		textAlign: "center"
// 	},
// 	bigbox: {
// 		backgroundColor: "#333", // Example background color
// 		borderRadius: "8px",
// 		padding: theme.spacing(2),
// 		textAlign: "center"
// 	}
// }));

// const OpenTelemetry = () => {
// 	const classes = useStyles();

// 	useEffect(() => {
// 		// Load Google Charts API
// 		google.charts.load("current", { packages: ["corechart"] });
// 		google.charts.setOnLoadCallback(drawLineChart); // Example callback function

// 		// Example callback function to draw a chart
// 		function drawLineChart() {
// 			const data = google.visualization.arrayToDataTable([
// 				["Year", "Sales", "Expenses"],
// 				["2004", 1000, 400],
// 				["2005", 1170, 460],
// 				["2006", 660, 1120],
// 				["2007", 1030, 540]
// 			]);

// 			const options = {
// 				vAxis: {
// 					title: "Sales and Expenses",
// 					format: "0"
// 				},
// 				hAxis: {
// 					title: "Year"
// 				},
// 				backgroundColor: "#212121",
// 				legendTextStyle: { color: "#FFF" },
// 				titleTextStyle: { color: "#FFF" },
// 				trendlines: { 0: {} }
// 			};

// 			const chart = new google.visualization.LineChart(document.getElementById("line_div"));
// 			chart.draw(data, options);
// 		}
// 	}, []); // Empty dependency array ensures this effect runs only once on mount

// 	return (
// 		<Box component="main" sx={{ flexGrow: 1 }}>
// 			<Grid container spacing={2} justifyContent="center">
// 				{/* Total Box 1 */}
// 				<Grid item xs={12} sm={6} md={3} className={`${classes.card} card1 text-center m-1`}>
// 					<Grid container alignItems="center" justifyContent="center">
// 						<Grid item xs={3} md={3} className="icondiv">
// 							<div className="icon1">
// 								<FontAwesomeIcon icon={faChartSimple} className="fa-2x" />
// 							</div>
// 						</Grid>
// 						<Grid item xs={9} md={9}>
// 							<Typography variant="h3" className="total text-light" id="total">
// 								0
// 							</Typography>
// 							<Typography variant="body1" className="text-light textsmall" id="totalheader">
// 								TOTAL
// 							</Typography>
// 						</Grid>
// 					</Grid>
// 				</Grid>

// 				{/* Total Box 2 */}
// 				<Grid item xs={12} sm={6} md={3} className={`${classes.card} card2 text-center m-1`}>
// 					<Grid container alignItems="center" justifyContent="center">
// 						<Grid item xs={3} md={3}>
// 							<div className="icon2">
// 								<FontAwesomeIcon icon={faMapLocationDot} className="fa-2x" />
// 							</div>
// 						</Grid>
// 						<Grid item xs={9} md={9}>
// 							<Typography variant="h3" className="total text-light" id="countrytotal">
// 								0
// 							</Typography>
// 							<Typography variant="body1" className="text-light textsmall">
// 								COUNTRY TOTAL
// 							</Typography>
// 						</Grid>
// 					</Grid>
// 				</Grid>

// 				{/* Example: Display Google Line Chart */}
// 				<Grid item xs={12} md={6}>
// 					<div id="line_div" style={{ width: "100%", height: "300px" }}></div>
// 				</Grid>

// 				{/* Example: Display Tabs and Table */}
// 				<Grid item xs={12} md={6}>
// 					<Tabs orientation="vertical" variant="scrollable" id="v-pills-tab">
// 						<Tab label="Tab 1" />
// 						<Tab label="Tab 2" />
// 					</Tabs>
// 					<div id="v-pills-tabContent">
// 						<div className="tab-pane fade show active" id="v-pills-tab1">
// 							<Table>
// 								<TableHead>
// 									<TableRow>
// 										<TableCell>Header 1</TableCell>
// 										<TableCell>Header 2</TableCell>
// 									</TableRow>
// 								</TableHead>
// 								<TableBody>
// 									<TableRow>
// 										<TableCell>Data 1</TableCell>
// 										<TableCell>Data 2</TableCell>
// 									</TableRow>
// 								</TableBody>
// 							</Table>
// 						</div>
// 					</div>
// 				</Grid>
// 			</Grid>
// 		</Box>
// 	);
// };

// export default OpenTelemetry;

// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChartSimple, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
// import {
// 	Box,
// 	Grid,
// 	Typography,
// 	FormControlLabel,
// 	Radio,
// 	RadioGroup,
// 	TextField,
// 	Table,
// 	TableHead,
// 	TableBody,
// 	TableCell,
// 	TableRow,
// 	Tabs,
// 	Tab,
// 	ThemeProvider,
// 	createTheme
// } from "@mui/material";

// const theme = createTheme({
// 	palette: {
// 		mode: "dark", // Set dark mode as default
// 		background: {
// 			default: "#121212" // Dark background color
// 		},
// 		text: {
// 			primary: "#ffffff" // White text color
// 		}
// 	}
// });

// const OpenTelemetry = () => {
// 	const drawerWidth = 240;

// 	// Function to generate dummy table data
// 	const generateTableData = () => {
// 		return [
// 			{ id: 1, country: "Country A", value: 100 },
// 			{ id: 2, country: "Country B", value: 200 },
// 			{ id: 3, country: "Country C", value: 150 }
// 		];
// 	};

// 	// Function to generate dummy chart data
// 	const generateChartData = () => {
// 		return [
// 			{ month: "Jan", value: 50 },
// 			{ month: "Feb", value: 80 },
// 			{ month: "Mar", value: 120 },
// 			{ month: "Apr", value: 100 },
// 			{ month: "May", value: 180 }
// 		];
// 	};

// 	// Example table data
// 	const tableData = generateTableData();

// 	// Example chart data
// 	const chartData = generateChartData();

// 	return (
// 		<ThemeProvider theme={theme}>
// 			<Box
// 				component="main"
// 				sx={{
// 					flexGrow: 1,
// 					bgcolor: "background.default",
// 					p: 3,
// 					marginLeft: `${drawerWidth}px`,
// 					minHeight: "100vh",
// 					boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Adding shadow
// 					borderRadius: "8px" // Adding border radius
// 				}}
// 			>
// 				<Grid container justifyContent="center">
// 					<Grid item xs={12} md={10}>
// 						<Grid container spacing={4} alignItems="center" sx={{ py: 5 }}>
// 							<Grid item xs={12} md={6}>
// 								<Grid container spacing={2} className="text-light">
// 									{/* Total Box 1 */}
// 									<Grid
// 										item
// 										xs={12}
// 										sm={6}
// 										md={6}
// 										className="card1 text-center m-1"
// 										sx={{
// 											borderRadius: "8px",
// 											boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
// 										}}
// 									>
// 										<Grid container alignItems="center" justify="center">
// 											<Grid item xs={3} md={3} className="icondiv">
// 												<div className="icon1">
// 													<FontAwesomeIcon icon={faChartSimple} className="fa-2x" />
// 												</div>
// 											</Grid>
// 											<Grid item xs={9} md={9}>
// 												<Typography variant="h3" className="total text-light" id="total">
// 													0
// 												</Typography>
// 												<Typography
// 													variant="body1"
// 													className="text-light textsmall"
// 													id="totalheader"
// 												>
// 													TOTAL
// 												</Typography>
// 											</Grid>
// 										</Grid>
// 									</Grid>

// 									{/* Total Box 2 */}
// 									<Grid
// 										item
// 										xs={12}
// 										sm={6}
// 										md={6}
// 										className="card2 text-center m-1"
// 										id="card2"
// 										sx={{
// 											borderRadius: "8px",
// 											boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
// 										}}
// 									>
// 										<Grid container alignItems="center" justify="center">
// 											<Grid item xs={3} md={3}>
// 												<div className="icon2">
// 													<FontAwesomeIcon icon={faMapLocationDot} className="fa-2x" />
// 												</div>
// 											</Grid>
// 											<Grid item xs={9} md={9} id="countrytotaldiv">
// 												<Typography variant="h3" className="total text-light" id="countrytotal">
// 													0
// 												</Typography>
// 												<Typography variant="body1" className="text-light textsmall">
// 													COUNTRY TOTAL
// 												</Typography>
// 											</Grid>
// 										</Grid>
// 									</Grid>
// 								</Grid>
// 							</Grid>

// 							{/* Filter Section */}
// 							<Grid container spacing={2} className="mt-3">
// 								{/* Type Filter */}
// 								<Grid
// 									item
// 									xs={12}
// 									md={3}
// 									className="type"
// 									sx={{
// 										borderRadius: "8px",
// 										boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
// 									}}
// 								>
// 									<Typography variant="h6" className="text-light">
// 										Type
// 									</Typography>
// 									<TextField
// 										select
// 										fullWidth
// 										id="type"
// 										variant="outlined"
// 										className="mb-4"
// 										SelectProps={{
// 											native: true
// 										}}
// 									>
// 										<option value="signup">Signed-up Users</option>
// 										<option value="available">Available Users</option>
// 									</TextField>
// 								</Grid>

// 								{/* Format Filter */}
// 								<Grid
// 									item
// 									xs={12}
// 									md={2}
// 									className="p-3"
// 									sx={{
// 										borderRadius: "8px",
// 										boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
// 									}}
// 								>
// 									<Typography variant="h6" className="text-light">
// 										Format
// 									</Typography>
// 									<RadioGroup row aria-label="format" name="format" defaultValue="month">
// 										<FormControlLabel
// 											value="month"
// 											control={<Radio color="primary" />}
// 											label="Month"
// 										/>
// 										<FormControlLabel
// 											value="day"
// 											control={<Radio color="primary" />}
// 											label="Days"
// 										/>
// 									</RadioGroup>
// 								</Grid>

// 								{/* Date Range Filter */}
// 								<Grid
// 									item
// 									xs={12}
// 									md={3}
// 									className="text-light ps-1 pe-5 pb-3"
// 									sx={{
// 										borderRadius: "8px",
// 										boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
// 									}}
// 								>
// 									<Grid container spacing={2}>
// 										<Grid item xs={6}>
// 											<Typography variant="body2">Start Date</Typography>
// 											<TextField
// 												id="start_date"
// 												type="date"
// 												variant="outlined"
// 												fullWidth
// 												InputLabelProps={{
// 													shrink: true
// 												}}
// 											/>
// 										</Grid>
// 										<Grid item xs={6}>
// 											<Typography variant="body2">End Date</Typography>
// 											<TextField
// 												id="end_date"
// 												type="date"
// 												variant="outlined"
// 												fullWidth
// 												InputLabelProps={{
// 													shrink: true
// 												}}
// 											/>
// 										</Grid>
// 									</Grid>
// 								</Grid>
// 							</Grid>

// 							{/* Table and Chart Section */}
// 							<Grid container spacing={2}>
// 								{/* Table 1 */}
// 								<Grid item md={7} className="bigbox m-1">
// 									<div className="text-light mb-3" id="line_div">
// 										<Table className="table text-center text-light">
// 											<TableHead>
// 												<TableRow>
// 													<TableCell>Country</TableCell>
// 													<TableCell>Value</TableCell>
// 												</TableRow>
// 											</TableHead>
// 											<TableBody>
// 												{tableData.map((row) => (
// 													<TableRow key={row.id}>
// 														<TableCell>{row.country}</TableCell>
// 														<TableCell>{row.value}</TableCell>
// 													</TableRow>
// 												))}
// 											</TableBody>
// 										</Table>
// 									</div>
// 								</Grid>

// 								<Box
// 									component="main"
// 									sx={{
// 										flexGrow: 1,
// 										bgcolor: "background.default",
// 										p: 3,
// 										marginLeft: `${drawerWidth}px`,
// 										minHeight: "100vh",
// 										boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Adding shadow
// 										borderRadius: "8px" // Adding border radius
// 									}}
// 								>
// 									<Grid container justifyContent="center">
// 										<Grid item xs={12} md={10}>
// 											<Grid container spacing={4} alignItems="center" sx={{ py: 5 }}>
// 												{/* First Row */}
// 												<Grid item xs={12}>
// 													<Grid container spacing={2}>
// 														{/* Chart 1 and Table 1 */}
// 														<Grid item md={7} className="bigbox m-1">
// 															<div className="text-light mb-3" id="line_div">
// 																{/* Replace with actual chart component */}
// 																<Typography variant="h6" className="text-light">
// 																	Chart 1 Placeholder
// 																</Typography>
// 															</div>
// 														</Grid>

// 														<Grid item md={4} className="smallbox m-1">
// 															<div className="table-responsive rest" id="countrytableid">
// 																<Table className="table text-center text-light">
// 																	<TableHead>
// 																		<TableRow>
// 																			<TableCell>Country</TableCell>
// 																			<TableCell>Value</TableCell>
// 																		</TableRow>
// 																	</TableHead>
// 																	<TableBody>
// 																		{tableData.map((row) => (
// 																			<TableRow key={row.id}>
// 																				<TableCell>{row.country}</TableCell>
// 																				<TableCell>{row.value}</TableCell>
// 																			</TableRow>
// 																		))}
// 																	</TableBody>
// 																</Table>
// 															</div>
// 														</Grid>
// 													</Grid>
// 												</Grid>

// 												{/* Second Row */}
// 												<Grid item xs={12}>
// 													<Grid container spacing={2}>
// 														{/* Chart 2 and Table 2 */}
// 														<Grid item md={7} className="bigbox m-1">
// 															<div className="text-light mb-3" id="line_div">
// 																{/* Replace with actual chart component */}
// 																<Typography variant="h6" className="text-light">
// 																	Chart 2 Placeholder
// 																</Typography>
// 															</div>
// 														</Grid>

// 														<Grid item md={4} className="smallbox m-1">
// 															<Tabs
// 																orientation="vertical"
// 																variant="scrollable"
// 																id="v-pills-tab"
// 																className="me-3"
// 																aria-label="Vertical tabs example"
// 															>
// 																<Tab label="Chart 1" />
// 																<Tab label="Chart 2" />
// 																{/* Add more tabs as needed */}
// 															</Tabs>
// 															{/* Placeholder for chart components */}
// 															{/* Render chart based on selected tab */}
// 															{chartData.map((data) => (
// 																<div key={data.month} hidden={true}>
// 																	{/* Replace with actual chart component */}
// 																	<Typography variant="h6" className="text-light">
// 																		{data.month} - {data.value}
// 																	</Typography>
// 																</div>
// 															))}
// 														</Grid>
// 													</Grid>
// 												</Grid>
// 											</Grid>
// 										</Grid>
// 									</Grid>
// 								</Box>
// 							</Grid>
// 						</Grid>
// 					</Grid>
// 				</Grid>
// 			</Box>
// 		</ThemeProvider>
// 	);
// };

// export default OpenTelemetry;

// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChartSimple, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
// import {
// 	Box,
// 	Grid,
// 	Typography,
// 	FormControlLabel,
// 	Radio,
// 	RadioGroup,
// 	TextField,
// 	Table,
// 	TableHead,
// 	TableBody,
// 	TableCell,
// 	TableRow,
// 	Tabs,
// 	Tab
// } from "@mui/material";
// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles((theme) => ({
// 	homeSection: {
// 		padding: theme.spacing(3),
// 		minHeight: "100vh"
// 	},
// 	card: {
// 		borderRadius: "8px",
// 		boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
// 	},
// 	formControl: {
// 		borderRadius: "8px",
// 		boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
// 		padding: theme.spacing(2)
// 	},
// 	filterSection: {
// 		marginTop: theme.spacing(5)
// 	},
// 	bigbox: {
// 		backgroundColor: "#333",
// 		borderRadius: "8px",
// 		padding: theme.spacing(2)
// 	},
// 	smallbox: {
// 		backgroundColor: "#555",
// 		borderRadius: "8px",
// 		padding: theme.spacing(2)
// 	}
// }));

// const OpenTelemetry = () => {
// 	const classes = useStyles();

// 	const tableData = [
// 		{ id: 1, country: "Country A", value: 100 },
// 		{ id: 2, country: "Country B", value: 200 },
// 		{ id: 3, country: "Country C", value: 300 }
// 	];

// 	const chartData = [
// 		{ month: "January", value: 500 },
// 		{ month: "February", value: 600 },
// 		{ month: "March", value: 700 }
// 	];

// 	return (
// 		<Box
// 			className={classes.homeSection}
// 			component="main"
// 			sx={{
// 				px: { md: 3, sm: 3, xs: 2 },
// 				pb: { md: 3, sm: 3, xs: 14 },
// 				flexGrow: 1
// 			}}
// 		>
// 			{/* Main Grid Container */}
// 			<Grid container sx={{ p: 2 }} justifyContent="center" alignItems="center" direction="row">
// 				<Grid item lg={2} md={3} sm={3} xs={0} />

// 				<Grid item lg={10} md={9} sm={12} xs={12} sx={{ p: { md: 3, sm: 2, xs: 0 } }}>
// 					<Grid container spacing={2} sx={{ mb: 4 }}>
// 						{/* Total Box 1 */}
// 						<Grid
// 							item
// 							xs={12}
// 							sm={6}
// 							md={3}
// 							className={`${classes.card} card1 text-center m-1`}
// 							style={{ backgroundColor: "#f0f0f0" }}
// 						>
// 							<Grid container alignItems="center" justifyContent="center">
// 								<Grid item xs={3} md={3} className="icondiv">
// 									<div className="icon1">
// 										<FontAwesomeIcon icon={faChartSimple} className="fa-2x" />
// 									</div>
// 								</Grid>
// 								<Grid item xs={9} md={9}>
// 									<Typography variant="h3" className="total text-light" id="total">
// 										0
// 									</Typography>
// 									<Typography variant="body1" className="text-light textsmall" id="totalheader">
// 										TOTAL
// 									</Typography>
// 								</Grid>
// 							</Grid>
// 						</Grid>

// 						{/* Total Box 2 */}
// 						<Grid
// 							item
// 							xs={12}
// 							sm={6}
// 							md={3}
// 							className={`${classes.card} card2 text-center m-1`}
// 							style={{ backgroundColor: "#d0e8f2" }} // Add your desired background color here
// 						>
// 							<Grid container alignItems="center" justifyContent="center">
// 								<Grid item xs={3} md={3}>
// 									<div className="icon2">
// 										<FontAwesomeIcon icon={faMapLocationDot} className="fa-2x" />
// 									</div>
// 								</Grid>
// 								<Grid item xs={9} md={9}>
// 									<Typography variant="h3" className="total text-light" id="countrytotal">
// 										0
// 									</Typography>
// 									<Typography variant="body1" className="text-light textsmall">
// 										COUNTRY TOTAL
// 									</Typography>
// 								</Grid>
// 							</Grid>
// 						</Grid>
// 					</Grid>

// 					{/* Filter Section */}
// 					<Grid container spacing={5} className={classes.filterSection} sx={{ mt: 4, mb: 4 }}>
// 						{/* Type Filter */}
// 						<Grid item xs={12} md={3} className={`${classes.formControl} type`}>
// 							<Typography variant="h6" className="text-light">
// 								Type
// 							</Typography>
// 							<TextField
// 								select
// 								fullWidth
// 								id="type"
// 								variant="outlined"
// 								className="mb-4"
// 								SelectProps={{
// 									native: true
// 								}}
// 							>
// 								<option value="signup">Signed-up Users</option>
// 								<option value="available">Available Users</option>
// 							</TextField>
// 						</Grid>

// 						{/* Format Filter */}
// 						<Grid item xs={12} md={2} className={`${classes.formControl} p-3`}>
// 							<Typography variant="h6" className="text-light">
// 								Format
// 							</Typography>
// 							<RadioGroup row aria-label="format" name="format" defaultValue="month">
// 								<FormControlLabel value="month" control={<Radio color="primary" />} label="Month" />
// 								<FormControlLabel value="day" control={<Radio color="primary" />} label="Days" />
// 							</RadioGroup>
// 						</Grid>

// 						{/* Date Range Filter */}
// 						<Grid
// 							item
// 							xs={12}
// 							md={3}
// 							className={`${classes.formControl} text-light ps-1 pe-5 pb-3`}
// 						>
// 							<Grid container spacing={2}>
// 								<Grid item xs={6}>
// 									<Typography variant="body2">Start Date</Typography>
// 									<TextField
// 										id="start_date"
// 										type="date"
// 										variant="outlined"
// 										fullWidth
// 										InputLabelProps={{
// 											shrink: true
// 										}}
// 									/>
// 								</Grid>
// 								<Grid item xs={6}>
// 									<Typography variant="body2">End Date</Typography>
// 									<TextField
// 										id="end_date"
// 										type="date"
// 										variant="outlined"
// 										fullWidth
// 										InputLabelProps={{
// 											shrink: true
// 										}}
// 									/>
// 								</Grid>
// 							</Grid>
// 						</Grid>
// 					</Grid>

// 					{/* Table and Chart Section */}
// 					<Grid container spacing={2}>
// 						{/* Table 1 */}
// 						<Grid item md={7} className="bigbox m-1">
// 							<div className="text-light mb-3" id="line_div">
// 								<Table className="table text-center text-light">
// 									<TableHead>
// 										<TableRow>
// 											<TableCell>Country</TableCell>
// 											<TableCell>Value</TableCell>
// 										</TableRow>
// 									</TableHead>
// 									<TableBody>
// 										{tableData.map((row) => (
// 											<TableRow key={row.id}>
// 												<TableCell>{row.country}</TableCell>
// 												<TableCell>{row.value}</TableCell>
// 											</TableRow>
// 										))}
// 									</TableBody>
// 								</Table>
// 							</div>
// 						</Grid>

// 						{/* Chart and Tabs */}
// 						<Grid item xs={12} md={4} className="smallbox m-1">
// 							<Tabs
// 								orientation="vertical"
// 								variant="scrollable"
// 								id="v-pills-tab"
// 								className="me-3"
// 								aria-label="Vertical tabs example"
// 							>
// 								<Tab label="Chart 1" />
// 								<Tab label="Chart 2" />
// 								{/* Add more tabs as needed */}
// 							</Tabs>
// 							{/* Placeholder for chart components */}
// 							{/* Render chart based on selected tab */}
// 							{chartData.map((data) => (
// 								<div key={data.month} hidden={true}>
// 									{/* Replace with actual chart component */}
// 									<Typography variant="h6" className="text-light">
// 										{data.month} - {data.value}
// 									</Typography>
// 								</div>
// 							))}
// 						</Grid>
// 					</Grid>
// 				</Grid>
// 			</Grid>
// 		</Box>
// 	);
// };

// export default OpenTelemetry;
