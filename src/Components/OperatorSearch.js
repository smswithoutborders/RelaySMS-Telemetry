import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

export default function OperatorSearch({ selectedCountry, onSelectOperator, apiUrl }) {
	const [operators, setOperators] = useState([]);

	useEffect(() => {
		const fetchOperators = async () => {
			try {
				const response = await fetch(apiUrl);
				const data = await response.json();
				const filteredOperators = data
					.filter((item) => item.country === selectedCountry)
					.map((item) => item.operator);
				setOperators(filteredOperators);
			} catch (error) {
				console.error("Error fetching operators:", error);
			}
		};

		if (selectedCountry) {
			fetchOperators();
		} else {
			setOperators([]);
		}
	}, [selectedCountry, apiUrl]);

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
