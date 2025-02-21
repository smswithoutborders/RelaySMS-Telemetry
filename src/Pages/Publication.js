import React, { useState, useEffect } from "react";
import Navbar from "../Components/Nav";
import {
	Box,
	useTheme,
	Grid,
	CircularProgress,
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	Card,
	CardContent
} from "@mui/material";
import { getName } from "country-list";
import { Link } from "react-router-dom";
import DataFilter from "./DataFilter";
import dayjs from "dayjs";

const Publication = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const theme = useTheme();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filteredData, setFilteredData] = useState([]);
	const [publisher, setPublisher] = useState("");
	const [country, setCountry] = useState("");
	const [platform, setPlatform] = useState("");
	const [status, setStatus] = useState("");
	const [client, setClient] = useState("");

	const getCountryName = (code) => {
		if (!code || typeof code !== "string") return "Unknown Country";
		try {
			const countryName = getName(code.trim().toUpperCase());
			return countryName || "Unknown Country";
		} catch (error) {
			console.error("Country code error:", error);
			return "Unknown Country";
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		const formattedDate = dayjs(dateString).format("MMMM D, YYYY h:mm A");
		return formattedDate === "Invalid Date" ? "N/A" : formattedDate;
	};

	useEffect(() => {
		const fetchPublicationsData = async () => {
			try {
				const today = dayjs().format("YYYY-MM-DD");
				const response = await fetch(
					`https://api.telemetry.staging.smswithoutborders.com/v1/publications?start_date=2020-01-01&end_date=${today}&country_code&page=1&page_size=100`
				);

				const result = await response.json();
				setData(result);
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch data");
				setLoading(false);
			}
		};

		fetchPublicationsData();
	}, []);

	useEffect(() => {
		if (data?.publications?.data) {
			let filtered = data.publications.data;

			if (publisher) filtered = filtered.filter((item) => item.source === publisher);
			if (country) filtered = filtered.filter((item) => item.country_code === country);
			if (platform) filtered = filtered.filter((item) => item.platform_name === platform);
			if (status) filtered = filtered.filter((item) => item.status === status);
			if (client) filtered = filtered.filter((item) => item.gateway_client === client);

			setFilteredData(filtered);
		}
	}, [publisher, country, platform, status, client, data]);

	return (
		<Box
			sx={{
				display: "flex",
				minHeight: "100vh",
				backgroundColor: theme.palette.background.default
			}}
		>
			<Navbar onToggle={setDrawerOpen} />
			<Box
				sx={{
					flexGrow: 1,
					padding: 3,
					marginLeft: drawerOpen ? "250px" : "0px",
					transition: "margin-left 0.3s ease-in-out"
				}}
			>
				<Box sx={{ flexGrow: 1, padding: 3 }}>
					<Box
						className="hero"
						sx={{
							backgroundColor: theme.palette.primary.main,
							p: 2,
							mb: 3,
							boxShadow: "5px 5px 0 rgba(0, 0, 0, 0.1)",
							borderRadius: "8px",
							position: "relative",
							minHeight: "250px"
						}}
					>
						<Box sx={{ flexGrow: 1, padding: 3 }}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Link to="/OpenTelemetry" style={{ textDecoration: "none", fontWeight: "bold" }}>
										OpenTelemetry
									</Link>
								</Grid>

								{/* Filter Card */}
								<Grid item xs={12}>
									<Card sx={{ boxShadow: 3 }}>
										<CardContent>
											<Typography variant="h6" gutterBottom>
												Filter Publications
											</Typography>
											<DataFilter
												data={data}
												publisher={publisher}
												setPublisher={setPublisher}
												country={country}
												setCountry={setCountry}
												platform={platform}
												setPlatform={setPlatform}
												status={status}
												setStatus={setStatus}
												client={client}
												setClient={setClient}
											/>
										</CardContent>
									</Card>
								</Grid>

								{/* Table Card */}
								<Grid item xs={12}>
									<Card sx={{ boxShadow: 3 }}>
										<CardContent>
											{loading ? (
												<Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
													<CircularProgress size={60} />
												</Box>
											) : error ? (
												<Typography color="error" variant="h6" align="center">
													{error}
												</Typography>
											) : filteredData.length > 0 ? (
												<TableContainer component={Paper}>
													<Table sx={{ minWidth: 750, border: "1px solid #ddd" }}>
														<TableHead sx={{ backgroundColor: "#f5f5f5" }}>
															<TableRow>
																{[
																	"ID",
																	"Date & Time",
																	"Country",
																	"Platform",
																	"Source",
																	"Status",
																	"Gateway Client"
																].map((header) => (
																	<TableCell
																		key={header}
																		sx={{ fontWeight: "bold", border: "1px solid #ddd" }}
																	>
																		{header}
																	</TableCell>
																))}
															</TableRow>
														</TableHead>
														<TableBody>
															{filteredData.map((item) => (
																<TableRow
																	key={item.id}
																	sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
																>
																	<TableCell sx={{ border: "1px solid #ddd" }}>{item.id}</TableCell>
																	<TableCell sx={{ border: "1px solid #ddd" }}>
																		{formatDate(item.date_created)}
																	</TableCell>
																	<TableCell sx={{ border: "1px solid #ddd" }}>
																		{getCountryName(item.country_code)}{" "}
																	</TableCell>
																	<TableCell sx={{ border: "1px solid #ddd" }}>
																		{item.platform_name}
																	</TableCell>
																	<TableCell sx={{ border: "1px solid #ddd" }}>
																		{item.source}
																	</TableCell>
																	<TableCell sx={{ border: "1px solid #ddd" }}>
																		{item.status}
																	</TableCell>
																	<TableCell sx={{ border: "1px solid #ddd" }}>
																		{item.gateway_client || "N/A"}
																	</TableCell>
																</TableRow>
															))}
														</TableBody>
													</Table>
												</TableContainer>
											) : (
												<Typography variant="h6" align="center" sx={{ p: 2 }}>
													No publications found for the selected filters.
												</Typography>
											)}
										</CardContent>
									</Card>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Publication;
