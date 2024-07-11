import React from "react";
import {
	Box,
	Grid,
	IconButton,
	Card,
	CardContent,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	RadioGroup,
	FormControlLabel,
	Radio,
	TextField
} from "@mui/material";
import {
	Refresh as RefreshIcon,
	BarChart as BarChartIcon,
	LocationOn as LocationOnIcon
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import "../index.css";

// Define drawer width for the sidebar
const drawerWidth = 240;

// Create styles using makeStyles
const useStyles = makeStyles((theme) => ({
	homeSection: {
		padding: theme.spacing(3),
		minHeight: "100vh",
		backgroundColor: theme.palette.mode === "dark" ? "#282c34" : "#f0f0f0",
		color: theme.palette.mode === "dark" ? "#fff" : "#000"
	},
	homeContent: {
		color: theme.palette.mode === "dark" ? "#fff" : "#000"
	},
	iconButton: {
		color: theme.palette.mode === "dark" ? "#fff" : "#000"
	},
	card: {
		backgroundColor: theme.palette.mode === "dark" ? "#3c3f41" : "#fff",
		color: theme.palette.mode === "dark" ? "#fff" : "#000",
		height: "100%"
	},
	cardContent: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	formControl: {
		minWidth: 120
	},
	select: {
		color: theme.palette.mode === "dark" ? "#fff" : "#000",
		".MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.mode === "dark" ? "#fff" : "#000"
		},
		"&:hover .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.mode === "dark" ? "#fff" : "#000"
		},
		"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.mode === "dark" ? "#fff" : "#000"
		}
	},
	textField: {
		"& .MuiInputBase-input": {
			color: theme.palette.mode === "dark" ? "#fff" : "#000"
		},
		"& .MuiInputLabel-root": {
			color: theme.palette.mode === "dark" ? "#fff" : "#000"
		},
		"& .MuiOutlinedInput-root": {
			"& fieldset": {
				borderColor: theme.palette.mode === "dark" ? "#fff" : "#000"
			},
			"&:hover fieldset": {
				borderColor: theme.palette.mode === "dark" ? "#fff" : "#000"
			},
			"&.Mui-focused fieldset": {
				borderColor: theme.palette.mode === "dark" ? "#fff" : "#000"
			}
		}
	},
	radioGroup: {
		color: theme.palette.mode === "dark" ? "#fff" : "#000"
	},
	radio: {
		color: theme.palette.mode === "dark" ? "#fff" : "#000"
	},
	formControlLabel: {
		color: theme.palette.mode === "dark" ? "#fff" : "#000"
	}
}));

const OpenTelemetry = () => {
	const classes = useStyles();

	return (
		<Box
			className={classes.homeSection}
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
					<Box className={classes.homeContent}>
						{/* Header Section */}
						<Grid container spacing={2} alignItems="center">
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

						{/* Total and Country Cards */}
						<Grid container spacing={2} className={classes.homeContent} sx={{ mt: 3 }}>
							{/* Total Card */}
							<Grid item xs={12} sm={6} md={2}>
								<Card className={`${classes.card} card1 text-center`}>
									<CardContent className={classes.cardContent}>
										<Grid container justifyContent="center" alignItems="center">
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

							{/* Country Total Card */}
							<Grid item xs={12} sm={6} md={2}>
								<Card className={`${classes.card} card2 text-center`} id="card2">
									<CardContent className={classes.cardContent}>
										<Grid container justifyContent="center" alignItems="center">
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

						{/* Form Controls for Filtering Data */}
						<Grid container spacing={2} className={classes.homeContent} sx={{ mt: 3 }}>
							{/* Type Select */}
							<Grid item xs={12} sm={6} md={3}>
								<FormControl variant="outlined" className={classes.formControl} fullWidth>
									<InputLabel id="type-label" className={classes.formControlLabel}>
										Type
									</InputLabel>
									<Select
										labelId="type-label"
										id="type-select"
										value={""}
										onChange={() => {}}
										className={classes.select}
									>
										<MenuItem value="">
											<em>None</em>
										</MenuItem>
										<MenuItem value={10}>Type 1</MenuItem>
										<MenuItem value={20}>Type 2</MenuItem>
										<MenuItem value={30}>Type 3</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							{/* Format Radio Buttons */}
							<Grid item xs={12} sm={6} md={3}>
								<FormControl component="fieldset">
									<RadioGroup
										row
										aria-label="format"
										name="format"
										value={"json"}
										onChange={() => {}}
										className={classes.radioGroup}
									>
										<FormControlLabel
											value="json"
											control={<Radio className={classes.radio} />}
											label="JSON"
											className={classes.formControlLabel}
										/>
										<FormControlLabel
											value="csv"
											control={<Radio className={classes.radio} />}
											label="CSV"
											className={classes.formControlLabel}
										/>
									</RadioGroup>
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
									className={classes.textField}
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
									className={classes.textField}
								/>
							</Grid>
						</Grid>

						{/* Add the map, table, chart, and other sections here */}
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OpenTelemetry;
