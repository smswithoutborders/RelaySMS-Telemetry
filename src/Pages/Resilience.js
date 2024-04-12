import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Grid, Box, Card, Typography } from "@mui/material";
import CountrySearch from "../Components/CountrySearch";
import OperatorSearch from "../Components/OperatorSearch";
import DateSearch from "../Components/DateSearch";

const apiUrl = process.env.REACT_APP_RESILIENCE_URL;

export default function Resilience() {
	const [data, setData] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [selectedOperator, setSelectedOperator] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);

	const handleSelectCountry = (selectedCountry) => {
		setSelectedCountry(selectedCountry);
	};

	const handleSelectOperator = (selectedOperator) => {
		setSelectedOperator(selectedOperator);
	};

	const handleSelectDate = (selectedDate) => {
		setSelectedDate(selectedDate);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(apiUrl);
				const jsonData = await response.json();

				const mappedData = jsonData.map((item) => ({
					id: item.id || null,
					msisdn: item.msisdn,
					country: item.country,
					operator: item.operator,
					regdate: new Date(item.regdate).toLocaleDateString(),
					protocols: item.protocols,
					status: item.status,
					error: item.error
				}));
				const filteredData = mappedData.filter((row) => row.id !== null);
				setData(filteredData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	const filteredRows = data.filter(
		(row) =>
			(!selectedCountry || row.country === selectedCountry) &&
			(!selectedOperator || row.operator === selectedOperator) &&
			(!selectedDate || row.date === selectedDate)
	);

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "msisdn", headerName: "MSISDN", width: 150 },
		{ field: "country", headerName: "Country", width: 130 },
		{ field: "operator", headerName: "Operator", width: 130 },
		{ field: "regdate", headerName: "Reg Date", width: 130 },
		{ field: "protocols", headerName: "Protocols", width: 130 },
		{ field: "status", headerName: "Status", width: 130 },
		{ field: "error", headerName: "Error", width: 130 }
	];

	return (
		<Box
			className="bg"
			component="main"
			sx={{ px: { md: 3, sm: 3, xs: 2 }, pb: { md: 3, sm: 3, xs: 14 } }}
		>
			<Grid container sx={{ p: 2 }}>
				<Grid item md={2}></Grid>
				<Grid item md={10}>
					<Grid
						container
						columnSpacing={4}
						rowSpacing={4}
						alignItems="flex-end"
						sx={{ py: { md: 5, sm: 5, xs: 1 }, pt: { md: 3, xs: 10, sm: 10 } }}
					>
						<Grid item md={2.5} xs={6}>
							<Card sx={{ p: 2 }}>
								<Typography textAlign="center" variant="h3" sx={{ fontWeight: 600 }}>
									{filteredRows.length}
								</Typography>
								<Typography
									textAlign="center"
									variant="body1"
									sx={{ fontWeight: 500, p: 1, fontSize: { md: 14, sm: 14, xs: 12 } }}
								>
									Total Gateway Servers
								</Typography>
							</Card>
						</Grid>
						<Grid item md={3} xs={6}>
							<CountrySearch onSelectCountry={handleSelectCountry} apiUrl={apiUrl} />
							{selectedCountry && (
								<OperatorSearch
									selectedCountry={selectedCountry}
									onSelectOperator={handleSelectOperator}
									apiUrl={apiUrl}
								/>
							)}
						</Grid>
						<Grid item md={3} xs={6}>
							<DateSearch onSelectDate={handleSelectDate} apiUrl={apiUrl} />
						</Grid>
					</Grid>
					<DataGrid
						rows={filteredRows}
						columns={columns}
						pageSize={5}
						initialState={{ pagination: { paginationModel: { pageSize: 7 } } }}
						pageSizeOptions={[7]}
						slots={{
							toolbar: GridToolbar,
							noRowsOverlay: () => (
								<div style={{ textAlign: "center", padding: "20px" }}>No rows found</div>
							)
						}}
						sx={{ height: 500, width: "100%", color: "paper", py: 4 }}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
