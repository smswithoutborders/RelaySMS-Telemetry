import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Grid, FormHelperText } from "@mui/material";
import dayjs from "dayjs";

const DateSearch = ({ onSelectDate }) => {
	const [error, setError] = useState("");

	const handleDateChange = (date) => {
		const formattedDate = dayjs(date).format("YYYY-MM-DD");

		if (formattedDate.toLowerCase() === "invalid date") {
			onSelectDate(null);
			setError("Invalid date format. Please enter a valid date.");
			return;
		}

		onSelectDate(formattedDate);
		setError("");
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<DatePicker
						label="Filter by Date"
						format="YYYY-MM-DD"
						onin
						onChange={handleDateChange}
						slotProps={{
							textField: { variant: "outlined" },
							field: { clearable: true },
							toolbar: {
								toolbarPlaceholder: "---- -- --",
								toolbarFormat: "YYYY - MM - DD",
								hidden: false
							}
						}}
						error={error !== ""}
					/>
					{error !== "" && (
						<FormHelperText sx={{ position: "absolute" }} error>
							{error}
						</FormHelperText>
					)}
				</Grid>
			</Grid>
		</LocalizationProvider>
	);
};

export default DateSearch;
