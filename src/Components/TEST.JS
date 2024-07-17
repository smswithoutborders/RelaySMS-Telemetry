// const baseUrl = "https://smswithoutborders.com:11000";

// window.onload = () => {
// 	let getFormat = () => {
// 		let result;
// 		let format = document.getElementsByName("format");

// 		for (let i = 0; i < format.length; i++) {
// 			if (format[i].checked) {
// 				result = format[i].value;
// 				break;
// 			}
// 		}

// 		return result;
// 	};

// 	let checkDate = () => {
// 		if (start_date.value == "") {
// 			start_date.value = end_date.value;
// 		} else if (end_date.value == "") {
// 			end_date.value = start_date.value;
// 		}

// 		return;
// 	};

// 	document.getElementById("mapping").style.display = "none";

// 	checkDate();
// 	let format_value = getFormat();

// 	if (format_value == "month" || format_value == "day") {
// 		const URL = `${baseUrl}/users?start=${start_date.value}&end=${end_date.value}&type=${type.value}&format=${format_value}`;
// 		fetchData(URL, format_value, type.value);
// 	} else {
// 		let today = new Date();
// 		let dd = String(today.getDate()).padStart(2, "0");
// 		let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
// 		let yyyy = today.getFullYear();

// 		today = yyyy + "-" + mm + "-" + dd;

// 		// Default chart
// 		start_date.value = today;
// 		end_date.value = today;
// 		format_month.checked = true;
// 		type.value = "available";
// 		format_value = "month";

// 		const URL = `${baseUrl}/users?start=${start_date.value}&end=${end_date.value}&type=${type.value}&format=${format_value}`;
// 		fetchData(URL, format_value, type.value);
// 	}

// 	format_month.addEventListener("click", () => {
// 		checkDate();
// 		let format_value = getFormat();

// 		const URL = `${baseUrl}/users?start=${start_date.value}&end=${end_date.value}&type=${type.value}&format=${format_value}`;
// 		fetchData(URL, format_value, type.value);
// 	});

// 	format_day.addEventListener("click", () => {
// 		checkDate();
// 		let format_value = getFormat();

// 		const URL = `${baseUrl}/users?start=${start_date.value}&end=${end_date.value}&type=${type.value}&format=${format_value}`;
// 		fetchData(URL, format_value, type.value);
// 	});

// 	type.addEventListener("change", () => {
// 		checkDate();
// 		let format_value = getFormat();

// 		const URL = `${baseUrl}/users?start=${start_date.value}&end=${end_date.value}&type=${type.value}&format=${format_value}`;
// 		fetchData(URL, format_value, type.value);
// 	});
// 	start_date.addEventListener("change", () => {
// 		checkDate();
// 		let format_value = getFormat();

// 		const URL = `${baseUrl}/users?start=${start_date.value}&end=${end_date.value}&type=${type.value}&format=${format_value}`;
// 		fetchData(URL, format_value, type.value);
// 	});

// 	end_date.addEventListener("change", () => {
// 		checkDate();
// 		let format_value = getFormat();

// 		const URL = `${baseUrl}/users?start=${start_date.value}&end=${end_date.value}&type=${type.value}&format=${format_value}`;
// 		fetchData(URL, format_value, type.value);
// 	});
// };

// 		{/* Container Grid for Main Layout */}
// 		<Grid container sx={{ p: 2 }} justifyContent="center" alignItems="center" direction="row">
// 		{/* Main Content Area */}
// 		<Grid
// 			mx="auto"
// 			item
// 			lg={10}
// 			md={9}
// 			xs={12}
// 			sm={12}
// 			sx={{
// 				p: { md: 3, sm: 2, xs: 0 },
// 				width: { sm: `calc(100% - ${drawerWidth}px)`, md: `calc(100% - ${drawerWidth}px)` }
// 			}}
// 		>
// 			<Box>

// 				{/* Total and Country Cards */}
// 				<Grid container spacing={2} sx={{ mt: 3 }}>
// 					{/* Total Card */}
// 					<Grid item xs={12} sm={6} md={2}>
// 						<Card className={" card1 text-center"}>
// 							<CardContent>
// 								<Grid container justifyContent="center" alignItems="center">
// 									<Grid item xs={3} className="icondiv">
// 										<BarChartIcon fontSize="large" className="icon1" />
// 									</Grid>
// 									<Grid item xs={6}>
// 										<Typography variant="h3" className="total" id="total">
// 											{totalUsers}
// 										</Typography>
// 										<Typography className="textsmall" id="totalheader">
// 											TOTAL
// 										</Typography>
// 									</Grid>
// 								</Grid>
// 							</CardContent>
// 						</Card>
// 					</Grid>

// 					{/* Country Total Card */}
// 					<Grid item xs={12} sm={6} md={2}>
// 						<Card className={" card2 text-center"} id="card2">
// 							<CardContent>
// 								<Grid container justifyContent="center" alignItems="center">
// 									<Grid item xs={3}>
// 										<LocationOnIcon fontSize="large" className="icon2" />
// 									</Grid>
// 									<Grid item xs={6} id="countrytotaldiv">
// 										<Typography variant="h3" className="total" id="countrytotal">
// 											{countryTableData.reduce((acc, row) => acc + row[2], 0)}
// 										</Typography>
// 										<Typography className="textsmall">COUNTRY TOTAL</Typography>
// 									</Grid>
// 								</Grid>
// 							</CardContent>
// 						</Card>
// 					</Grid>
// 				</Grid>

// 				{/* Form Controls for Filtering Data */}
// 				<Grid container spacing={2} sx={{ mt: 3 }}>
// 					{/* Type Select */}
// 					<Grid item xs={12} sm={6} md={3}>
// 						<FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
// 							<InputLabel id="display-type-label">Display Type</InputLabel>
// 							<Select
// 								labelId="display-type-label"
// 								id="display-type"
// 								value={displayType}
// 								onChange={(e) => setDisplayType(e.target.value)}
// 								label="Display Type"
// 							>
// 								<MenuItem value="Total Users">Total Users</MenuItem>
// 								<MenuItem value="Sign Up Users">Sign Up Users</MenuItem>
// 							</Select>
// 						</FormControl>
// 					</Grid>

// 					{/* Start Date Picker */}
// 					<Grid item xs={12} sm={6} md={3}>
// 						<TextField
// 							id="start-date"
// 							label="Start Date"
// 							type="date"
// 							value={startDate}
// 							onChange={(e) => setStartDate(e.target.value)}
// 							InputLabelProps={{
// 								shrink: true
// 							}}
// 							fullWidth
// 						/>
// 					</Grid>

// 					{/* End Date Picker */}
// 					<Grid item xs={12} sm={6} md={3}>
// 						<TextField
// 							id="end-date"
// 							label="End Date"
// 							type="date"
// 							value={endDate}
// 							onChange={(e) => setEndDate(e.target.value)}
// 							InputLabelProps={{
// 								shrink: true
// 							}}
// 							fullWidth
// 						/>
// 					</Grid>
// 				</Grid>
