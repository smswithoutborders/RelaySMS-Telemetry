import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchData } from "../Utils/FetchData";

const apiUrl = process.env.REACT_APP_RELIABILITY_URL;

export default function CountrySearch({ onSelectCountry }) {
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		fetchData(apiUrl).then((data) => setCountries(data));
	}, []);

	const handleSelectCountry = (selectedCountry) => {
		onSelectCountry(selectedCountry);
	};

	return (
		<Stack spacing={2} sx={{ width: "100%" }}>
			<Autocomplete
				id="country-search"
				size="small"
				options={countries.map((country) => country.country)}
				onChange={(event, value) => handleSelectCountry(value)}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Filter by Country"
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
