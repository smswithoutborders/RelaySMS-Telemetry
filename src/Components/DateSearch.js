import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchData } from "../Utils/FetchData";

const apiUrl = process.env.REACT_APP_API_URL;

export default function DateSearch({ onSelectDate }) {
	const [dates, setDates] = useState([]);

	useEffect(() => {
		fetchData(apiUrl)
			.then((data) => {
				const uniqueDates = Array.from(new Set(data.map((item) => item.date)));
				setDates(uniqueDates);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	const handleSelectDate = (selectedDate) => {
		onSelectDate(selectedDate);
	};

	return (
		<Stack spacing={2} sx={{ width: "100%" }}>
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
		</Stack>
	);
}
