import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const CountrySearch = ({ countries, onSelectCountry }) => {
	const handleCountryChange = (event, newValue) => {
		onSelectCountry(newValue);
	};

	return (
		<Autocomplete
			options={countries}
			onChange={handleCountryChange}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Filter by Country"
					variant="outlined"
					InputProps={{
						...params.InputProps,
						type: "search"
					}}
				/>
			)}
		/>
	);
};

export default CountrySearch;
