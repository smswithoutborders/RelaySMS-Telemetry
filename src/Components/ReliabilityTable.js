import React, { useCallback } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa6";
import Loader from "./Loader";

export default function Reliability({
	rows = [],
	selectedCountry,
	selectedOperator,
	selectedDate,
	isLoading
}) {
	const navigate = useNavigate();

	const handleRowClick = useCallback(
		(params) => {
			const data = params.row.testdata;
			navigate("/data", { state: { test_data: data } });
		},
		[navigate]
	);

	const columns = [
		{
			field: "msisdn",
			headerName: "MSISDN",
			width: 230
		},
		{
			field: "country",
			headerName: "Country",
			width: 230
		},
		{ field: "operator", headerName: "Operator", width: 200 },
		{ field: "resiliance", headerName: "Resiliance%", width: 150 },
		{ field: "date", headerName: "Date/Time", width: 200 },
		{
			field: "action",
			headerName: "",
			width: 100,
			renderCell: () => (
				<IconButton onRowClick={handleRowClick}>
					<FaChevronDown />
				</IconButton>
			)
		}
	];

	if (isLoading) {
		return (
			<div
				style={{
					height: 400,
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<Loader />
			</div>
		);
	}

	const filteredRows = rows.filter(
		(row) =>
			(!selectedCountry || row.country === selectedCountry) &&
			(!selectedOperator || row.operator === selectedOperator) &&
			(!selectedDate || row.date === selectedDate)
	);

	return (
		<DataGrid
			rows={filteredRows}
			columns={columns}
			initialState={{
				pagination: {
					paginationModel: {
						pageSize: 7
					}
				}
			}}
			pageSizeOptions={[7]}
			slots={{
				toolbar: GridToolbar
			}}
			sx={{ height: 500, width: "100%", color: "paper" }}
			onRowClick={handleRowClick}
		/>
	);
}
