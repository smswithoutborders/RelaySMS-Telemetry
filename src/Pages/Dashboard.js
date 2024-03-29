import { Box, Button, Card, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import TheTable from "../Components/Table";
import FreeSolo from "../Components/CountrySearch";
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
				px: 3
			}}
		>
			<Grid container sx={{ p: 2, display: { md: "flex", xs: "none", sm: "none" } }}>
				<Grid item md={2}></Grid>
				<Grid item md={10}>
					<Grid container columnSpacing={4} sx={{ py: 5 }}>
						<Grid item md={4}>
							<Card className="card" sx={{ p: 3 }}>
								<Typography variant="h6" sx={{ fontWeight: 700, pb: 4 }}>
									👋🏽 Welcome!
								</Typography>
								<Typography variant="boby1">
									Let’s find the most reliable gateway client for you.
								</Typography>
							</Card>
						</Grid>
						<Grid item md={3}>
							<Card className="cards" sx={{ p: 3 }}>
								<Typography variant="h6" sx={{ fontWeight: 500, pb: 4 }}>
									Total Gateway Clients
								</Typography>
								<Typography variant="h4" sx={{ fontWeight: 700 }}>
									{totalEntries}
								</Typography>
							</Card>
						</Grid>
					</Grid>

					<Box sx={{ pb: 4 }}>
						<Grid container columnSpacing={4} sx={{ py: 5 }}>
							<Grid item md={3}>
								<CountrySearch onSelectCountry={handleSelectCountry} />
								{selectedCountry && (
									<OperatorSearch
										selectedCountry={selectedCountry}
										onSelectOperator={handleSelectOperator}
										rows={rows}
									/>
								)}
							</Grid>
							<Grid item md={3}>
								<DateSearch onSelectDate={handleSelectDate} />
							</Grid>
							<Grid item md={3}>
								<Button
									onClick={handleDownload}
									sx={{ p: 1 }}
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
							<Grid item md={12}>
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
			{/* Mobile View */}
			<Box sx={{ display: { md: "none", xs: "block", sm: "block" } }}>
				<Grid container columnSpacing={4} rowSpacing={4} sx={{ py: 2, mt: 4 }}>
					<Grid item xs={12}>
						<Card className="card" sx={{ p: 3 }}>
							<Typography variant="h6" sx={{ fontWeight: 700, pb: 4 }}>
								👋🏽 Welcome!
							</Typography>
							<Typography variant="boby1" justifyContent="">
								Let’s find the most reliable gateway client for you.
							</Typography>
						</Card>
					</Grid>
					<Grid item xs={6}>
						<Card className="cards" sx={{ p: 3 }}>
							<Typography variant="h6" sx={{ fontWeight: 500, pb: 4 }}>
								Total Tests
							</Typography>
							<Typography variant="h4" sx={{ fontWeight: 700 }}>
								95
							</Typography>
						</Card>
					</Grid>
					<Grid item xs={6}>
						<Card className="cards" sx={{ p: 3 }}>
							<Typography variant="h6" sx={{ fontWeight: 500, pb: 4 }}>
								Resiliance%
							</Typography>
							<Typography variant="h4" sx={{ fontWeight: 700 }}>
								80%
							</Typography>
						</Card>
					</Grid>
				</Grid>
				<Box sx={{ py: 3 }}>
					<Box sx={{ pb: 4 }}>
						<Grid container columnSpacing={4} rowSpacing={4} sx={{ py: 5 }}>
							<Grid item xs={6}>
								<FreeSolo />
							</Grid>
							<Grid item xs={6}>
								<FreeSolo />
							</Grid>
							<Grid item xs={6}>
								<FreeSolo />
							</Grid>
							<Grid item xs={6}>
								<Button sx={{ p: 1 }} autoFocus color="success" variant="contained">
									Download Data{" "}
									<FaDownload size="13px" style={{ marginLeft: 7, marginBottom: 1 }} />
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Box className="cards">
					<Grid container>
						<Grid item xs={12}>
							<TheTable />
						</Grid>
						<Grid
							item
							xs={12}
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center"
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "100%"
								}}
							>
								<Box
									component="img"
									src="/map.png"
									sx={{
										width: "100%",
										my: "auto",
										display: "block",
										mx: "auto"
									}}
								/>
							</div>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}
