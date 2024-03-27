// TheTable.js
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { FaChevronDown } from "react-icons/fa6";

export default function TheTable({ rows = [], selectedCountry, selectedOperator, selectedDate }) {
	const columns = [
		{ field: "msisdn", headerName: "MSISDN", width: 230 },
		{
			field: "country",
			headerName: "Country",
			width: 230,
			renderCell: (params) => (
				<React.Fragment>
					{params.value && <ReactCountryFlag countryCode={params.row.countrycode} svg />}
					{params.value}
				</React.Fragment>
			)
		},
		{ field: "operator", headerName: "Operator", width: 200 },
		{ field: "resiliance", headerName: "Resiliance%", width: 100 },
		{ field: "date", headerName: "Date/Time", width: 200 },
		{
			field: "action",
			headerName: "",
			width: 100,
			renderCell: () => (
				<Link to="/data">
					<IconButton>
						<FaChevronDown />
					</IconButton>
				</Link>
			)
		}
	];

	const filteredRows = rows.filter(
		(row) =>
			(!selectedCountry || row.country === selectedCountry) &&
			(!selectedOperator || row.operator === selectedOperator) &&
			(!selectedDate || row.date === selectedDate)
	);

	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				rows={filteredRows}
				columns={columns}
				pageSize={5}
				pagination
				pageSizeOptions={[10, 100, { value: 10, label: "10" }]}
			/>
		</div>
	);
}
