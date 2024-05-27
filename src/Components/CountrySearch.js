import React, { Fragment } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

const CountrySearch = ({ countries, onSelectCountry, loading }) => {
	const handleCountryChange = (event, newValue) => {
		onSelectCountry(newValue);
	};

	return (
		<Autocomplete
			disabled={loading}
			options={countries}
			onChange={handleCountryChange}
			renderInput={(params) => (
				<Fragment>
					<TextField
						{...params}
						label="Filter by Country"
						variant="outlined"
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<Fragment>
									{loading ? <CircularProgress size={20} /> : params.InputProps.endAdornment}
								</Fragment>
							),
							type: "search"
						}}
					/>
				</Fragment>
			)}
		/>
	);
};

export default CountrySearch;
