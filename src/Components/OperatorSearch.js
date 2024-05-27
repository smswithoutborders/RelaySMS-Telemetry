import React, { Fragment } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

const OperatorSearch = ({ operators, onSelectOperator, loading }) => {
	const handleOperatorChange = (event, newValue) => {
		onSelectOperator(newValue);
	};

	return (
		<Autocomplete
			sx={{ mt: 3 }}
			options={operators}
			disabled={loading}
			onChange={handleOperatorChange}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Filter by Operator"
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
			)}
		/>
	);
};

export default OperatorSearch;
