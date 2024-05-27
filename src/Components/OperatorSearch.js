import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const OperatorSearch = ({ operators, onSelectOperator }) => {
	const handleOperatorChange = (event, newValue) => {
		onSelectOperator(newValue);
	};

	return (
		<Autocomplete
			sx={{ mt: 3 }}
			options={operators}
			onChange={handleOperatorChange}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Filter by Operator"
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

export default OperatorSearch;
