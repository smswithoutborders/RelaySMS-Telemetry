import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

export default function OperatorSearch({ selectedCountry, onSelectOperator, rows }) {
	const [operators, setOperators] = useState([]);

	useEffect(() => {
		if (!selectedCountry || !rows) {
			return;
		}
		const filteredOperators = rows
			.filter((row) => row.country === selectedCountry)
			.map((row) => row.operator);
		setOperators(filteredOperators);
	}, [selectedCountry, rows]);

	const handleSelectOperator = (selectedOperator) => {
		onSelectOperator(selectedOperator);
	};

	return (
		<Stack spacing={2} sx={{ width: "100%" }}>
			<Autocomplete
				id="operator-search"
				size="small"
				options={operators}
				onChange={(event, value) => handleSelectOperator(value)}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Filter by Operator"
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
