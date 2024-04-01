import { Box, Button, Card, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import TheTable from "../Components/Table";
import { FaDownload } from "react-icons/fa6";
import CountrySearch from "../Components/CountrySearch";
import OperatorSearch from "../Components/OperatorSearch";
import DateSearch from "../Components/DateSearch";
import { fetchData } from "../Utils/FetchData";

const apiUrl = "https://6603f6ac2393662c31d04103.mockapi.io/gatewayclients/api/gateways";

export default function Dashboard() {
	const [rows, setRows] = useState([]);
	const [filteredRows, setFilteredRows] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [selectedOperator, setSelectedOperator] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [totalEntries, setTotalEntries] = useState(0);

	useEffect(() => {
		if (rows.length < 1) {
			fetchData(apiUrl)
				.then((data) => {
					setRows(data);
					setFilteredRows(data);
					setTotalEntries(data.length);
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		}
	}, []);

	useEffect(() => {
		if (!selectedCountry || !rows) {
			setFilteredRows(rows);
			return;
		}
		const filteredData = rows.filter(
			(row) =>
				row.country === selectedCountry &&
				(!selectedOperator || row.operator === selectedOperator) &&
				(!selectedDate || row.date === selectedDate)
		);
		setFilteredRows(filteredData);
	}, [selectedCountry, selectedOperator, selectedDate, rows]);

	const handleSelectCountry = (selectedCountry) => {
		setSelectedCountry(selectedCountry);
	};

	const handleSelectOperator = (selectedOperator) => {
		setSelectedOperator(selectedOperator);
	};

	const handleSelectDate = (selectedDate) => {
		setSelectedDate(selectedDate);
	};

	const handleDownload = () => {
		const headers = Object.keys(filteredRows[0]);

		const csvContent =
			"data:text/csv;charset=utf-8," +
			[headers.join(",")]
				.concat(filteredRows.map((row) => headers.map((header) => row[header]).join(",")))
				.join("\n");

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "reliablity_test.csv");

		document.body.appendChild(link);
		link.click();
	};

	return (
		<Box
			className="bg"
			component="main"
			sx={{
				px: { md: 3, sm: 3, xs: 2 },
				pb: { md: 3, sm: 3, xs: 14 }
			}}
		>
			<Grid container sx={{ p: 2 }}>
				<Grid item md={2}></Grid>
				<Grid item md={10} xs={12}>
					<Grid
						container
						columnSpacing={4}
						rowSpacing={4}
						sx={{ py: { md: 5, sm: 5, xs: 1 }, pt: { md: 3, xs: 10, sm: 10 } }}
					>
						<Grid item md={4} xs={6}>
							<Card className="card" sx={{ p: 3 }}>
								<Typography
									variant="h6"
									sx={{
										fontWeight: 700,
										pb: { md: 2.3, xs: 0, sm: 3 },
										fontSize: { md: 20, sm: 20, xs: 14 }
									}}
								>
									👋🏽 Welcome!
								</Typography>
								<Typography variant="boby1" sx={{ fontSize: { md: 15, sm: 15, xs: 12 } }}>
									Let’s find the most reliable gateway client for you.
								</Typography>
							</Card>
						</Grid>
						<Grid item md={3} xs={6}>
							<Card className="cards" sx={{ p: 3 }}>
								<Typography
									variant="h6"
									sx={{
										fontWeight: 500,
										pb: { md: 4, xs: 5, sm: 4 },
										fontSize: { md: 15, sm: 15, xs: 12 }
									}}
								>
									Total Gateway Clients
								</Typography>
								<Typography variant="h4" sx={{ fontWeight: 700 }}>
									{totalEntries}
								</Typography>
							</Card>
						</Grid>
					</Grid>

					<Box sx={{ pb: 4 }}>
						<Grid container columnSpacing={4} rowSpacing={4} sx={{ py: 5 }}>
							<Grid item md={3} xs={6}>
								<CountrySearch onSelectCountry={handleSelectCountry} />
								{selectedCountry && (
									<OperatorSearch
										selectedCountry={selectedCountry}
										onSelectOperator={handleSelectOperator}
										rows={rows}
									/>
								)}
							</Grid>
							<Grid item md={3} xs={6}>
								<DateSearch onSelectDate={handleSelectDate} />
							</Grid>
							<Grid item md={3} xs={8}>
								<Button
									onClick={handleDownload}
									sx={{ p: 1, fontSize: { md: 15.5, xs: 11 } }}
									autoFocus
									color="success"
									variant="contained"
								>
									Download Data{" "}
									<FaDownload size="18px" style={{ marginLeft: 7, marginBottom: 4 }} />
								</Button>
							</Grid>
						</Grid>
					</Box>

					<Box className="cards">
						<Grid container>
							<Grid item md={12} xs={12}>
								<TheTable
									rows={filteredRows}
									selectedCountry={selectedCountry}
									selectedOperator={selectedOperator}
									selectedDate={selectedDate}
								/>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
