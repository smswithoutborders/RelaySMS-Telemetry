import React from "react";
import {
	Box,
	Container,
	Grid,
	Typography,
	IconButton,
	Card,
	CardContent,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Radio,
	RadioGroup,
	FormControlLabel,
	TextField,
	CircularProgress,
	Table,
	TableBody,
	TableHead
} from "@mui/material";
import {
	Refresh as RefreshIcon,
	BarChart as BarChartIcon,
	LocationOn as LocationOnIcon,
	Menu as MenuIcon
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import "../index.css";
import "../Components/OPentelematryjsfile";

const useStyles = makeStyles((theme) => ({
	homeSection: {
		padding: theme.spacing(3),
		backgroundColor: "#282c34",
		minHeight: "100vh"
	},
	homeContent: {
		color: "#fff"
	},
	iconButton: {
		color: "#fff"
	},
	card: {
		backgroundColor: "#3c3f41",
		color: "#fff"
	},
	cardContent: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	select: {
		color: "#fff",
		borderColor: "#fff"
	},
	radioGroup: {
		color: "#fff"
	},
	dateInput: {
		color: "#fff",
		"& .MuiInput-underline:before": {
			borderBottomColor: "#fff"
		},
		"& .MuiInput-underline:hover:before": {
			borderBottomColor: "#fff"
		},
		"& .MuiInput-underline:after": {
			borderBottomColor: "#fff"
		},
		"& .MuiInputBase-input": {
			color: "#fff"
		}
	},
	footer: {
		color: "rgb(126, 128, 129)",
		marginTop: theme.spacing(3)
	},
	spinner: {
		marginTop: theme.spacing(5),
		width: theme.spacing(8),
		height: theme.spacing(8)
	}
}));

const OpenTelemetry = () => {
	const classes = useStyles();

	return (
		<Container>
			<Box className={classes.homeSection}>
				<Box className={classes.homeContent}>
					<IconButton className={classes.iconButton}>
						<MenuIcon />
					</IconButton>
					<Box className="main">
						<Grid container>
							<Grid item xs={12} md={6}>
								<Typography variant="h4" className={classes.homeContent}>
									Open Telemetry
									<IconButton
										className={classes.iconButton}
										onClick={() => window.location.reload()}
									>
										<RefreshIcon />
									</IconButton>
								</Typography>
							</Grid>
							<Grid item xs={12} md={6} className="text-end pe-5">
								{/* Additional content can go here */}
							</Grid>
						</Grid>

						<Grid container spacing={2} className={classes.homeContent}>
							<Grid item xs={12} sm={6} md={2}>
								<Card className={`${classes.card} card1 text-center m-1`}>
									<CardContent className={classes.cardContent}>
										<Grid container justifyContent="center">
											<Grid item xs={3} className="icondiv">
												<BarChartIcon fontSize="large" className="icon1" />
											</Grid>
											<Grid item xs={6}>
												<Typography variant="h3" className="total" id="total">
													0
												</Typography>
												<Typography className="textsmall" id="totalheader">
													TOTAL
												</Typography>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={2}>
								<Card className={`${classes.card} card2 text-center m-1`} id="card2">
									<CardContent className={classes.cardContent}>
										<Grid container justifyContent="center">
											<Grid item xs={3}>
												<LocationOnIcon fontSize="large" className="icon2" />
											</Grid>
											<Grid item xs={6} id="countrytotaldiv">
												<Typography variant="h3" className="total" id="countrytotal">
													0
												</Typography>
												<Typography className="textsmall">COUNTRY TOTAL</Typography>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
						</Grid>

						<Grid container spacing={2} className="mt-3">
							<Grid item xs={12} md={3} className="type">
								<FormControl fullWidth>
									<InputLabel className={classes.homeContent}>Type</InputLabel>
									<Select id="type" defaultValue="signup" className={classes.select}>
										<MenuItem value="signup">Signed-up Users</MenuItem>
										<MenuItem value="available">Available Users</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={2} className="p-3">
								<Typography className={classes.homeContent}>Format</Typography>
								<RadioGroup row name="format" className={classes.radioGroup}>
									<FormControlLabel value="month" control={<Radio />} label="Month" />
									<FormControlLabel value="day" control={<Radio />} label="Days" />
								</RadioGroup>
							</Grid>
							<Grid item xs={12} md={3} className="text-light ps-1 pe-5 pb-3">
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<TextField
											id="start_date"
											label="Start-Date"
											type="date"
											fullWidth
											InputLabelProps={{
												shrink: true
											}}
											className={classes.dateInput}
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											id="end_date"
											label="End-Date"
											type="date"
											fullWidth
											InputLabelProps={{
												shrink: true
											}}
											className={classes.dateInput}
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>

						<Grid container spacing={2} id="maprow">
							<Grid item xs={12} md={7} className="bigbox2 m-1" id="bigbox2">
								<Box className="mapouter" id="mapping">
									<Box className="d-flex justify-content-center">
										<CircularProgress color="inherit" className={classes.spinner} />
									</Box>
								</Box>
							</Grid>
							<Grid item xs={12} md={4} className="smallbox2 m-1" id="smallbox2">
								<Box className="table-responsive rest" id="countrytableid">
									<Table className="text-center">
										<TableHead id="countrytable_head" className={classes.homeContent}>
											{/* Table Head content */}
										</TableHead>
										<TableBody id="countrytable_data" className={classes.homeContent}>
											{/* Table Body content */}
										</TableBody>
									</Table>
								</Box>
							</Grid>
						</Grid>

						<Grid container spacing={2}>
							<Grid item xs={12} md={7} className="bigbox m-1">
								<Box className="text-light mb-3" id="line_div">
									<Box className="d-flex justify-content-center">
										<CircularProgress color="inherit" className={classes.spinner} />
									</Box>
								</Box>
							</Grid>
							<Grid item xs={12} md={4} className="smallbox m-1">
								<Box className="d-flex align-items-start">
									<Box
										className="nav flex-column nav-pills me-3"
										id="v-pills-tab"
										role="tablist"
										aria-orientation="vertical"
									>
										{/* Tab List */}
									</Box>
									<Box className="tab-content w-100" id="v-pills-tabContent">
										{/* Tab Content */}
									</Box>
								</Box>
							</Grid>
						</Grid>

						<Typography className={`${classes.footer} p-3`}>
							&copy; 2023 -{" "}
							<a href="https://smswithoutborders.com/">
								<span>SMSWithoutBorders</span>
							</a>
							.
						</Typography>
					</Box>
				</Box>
			</Box>
		</Container>
	);
};

export default OpenTelemetry;
