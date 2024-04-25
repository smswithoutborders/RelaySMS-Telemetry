import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchData } from "../Utils/FetchData";

export default function DateSearch({ onSelectDate, apiUrl }) {
	const [dates, setDates] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData(apiUrl)
			.then((data) => {
				const uniqueDates = Array.from(new Set(data.map((item) => item?.last_published_date)));
				setDates(uniqueDates);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching countries:", error);
				setLoading(false);
			});
	}, []);

	const handleSelectDate = (selectedDate) => {
		onSelectDate(selectedDate);
	};

	return (
		<Stack spacing={2} sx={{ width: "100%" }}>
			{loading ? (
				<TextField label="Loading..." variant="standard" disabled fullWidth />
			) : dates.length > 0 ? (
				<Autocomplete
					id="date-search"
					size="small"
					options={dates}
					onChange={(event, value) => handleSelectDate(value)}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Filter by Date"
							variant="standard"
							InputProps={{
								...params.InputProps,
								type: "search"
							}}
						/>
					)}
				/>
			) : (
				<TextField label="No options" variant="standard" disabled fullWidth />
			)}
		</Stack>
	);
}
