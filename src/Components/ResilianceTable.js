import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Import DataGrid from MUI X Data Grid
// import { Grid } from "@mui/material";

const apiUrl = process.env.REACT_APP_RESILIANCE_URL;

const columns = [
	{ field: "id", headerName: "ID", width: 90 },
	{ field: "msisdn", headerName: "MSISDN", width: 150 },
	{ field: "country", headerName: "Country", width: 130 },
	{ field: "operator", headerName: "Operator", width: 130 },
	{ field: "regdate", headerName: "Reg Date", width: 130 },
	{ field: "routed", headerName: "Routed", width: 130 },
	{ field: "success", headerName: "Success", width: 130 },
	{ field: "failure", headerName: "Failure", width: 130 },
	{ field: "error", headerName: "Error", width: 130 }
];

function Resiliance() {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(apiUrl);
				const jsonData = await response.json();
				const mappedData = jsonData.map((item) => ({
					id: item.id,
					msisdn: item.msisdn,
					country: item.country,
					operator: item.operator,
					regdate: new Date(item.regdate).toLocaleDateString(),
					routed: item.routed,
					success: item.success,
					failure: item.failure,
					error: item.error
				}));

				setData(mappedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="App bg-slate-700 py-10 min-h-screen grid place-items-center">
			<div style={{ height: 400, width: "100%" }}>
				<DataGrid
					rows={data}
					columns={columns}
					pageSize={5}
					rinitialState={{
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
				/>
			</div>
		</div>
	);
}

export default Resiliance;
