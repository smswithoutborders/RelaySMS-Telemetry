/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import {
	Grid,
	Box,
	CircularProgress,
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper
} from "@mui/material";
import DataFilter from "./DataFilter";

const PublicationTable = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filteredData, setFilteredData] = useState([]);

	// Filter States
	const [publisher, setPublisher] = useState("");
	const [country, setCountry] = useState("");
	const [platform, setPlatform] = useState("");
	const [status, setStatus] = useState("");
	const [client, setClient] = useState("");

	// Fetch data from API
	useEffect(() => {
		const fetchPublicationsData = async () => {
			try {
				const today = new Date();
				const formattedToday = today.toISOString().split("T")[0];

				const response = await fetch(
					`https://api.telemetry.smswithoutborders.com/v1/publications?start_date=2021-01-10&end_date=${formattedToday}&country_code=ca&platform_name=twitter&status=published&page=1&page_size=10`
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

	// Apply filtering logic
	useEffect(() => {
		if (data && data.publications && data.publications.data) {
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
		<Grid container spacing={2}>
			{/* Filter Component */}
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

			{/* Content Box */}
			<Box
				className="content-block"
				sx={{
					width: "100%",
					backgroundColor: "#fff",
					boxShadow: "5px 5px 0 rgba(0, 0, 0, 0.1)",
					borderRadius: "8px",
					p: 2
				}}
			>
				{loading ? (
					<Box
						sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}
					>
						<CircularProgress size={60} />
					</Box>
				) : error ? (
					<Typography color="error" variant="h6" align="center">
						{error}
					</Typography>
				) : filteredData.length > 0 ? (
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>
										<strong>ID</strong>
									</TableCell>
									<TableCell>
										<strong>Country Code</strong>
									</TableCell>
									<TableCell>
										<strong>Platform</strong>
									</TableCell>
									<TableCell>
										<strong>Source</strong>
									</TableCell>
									<TableCell>
										<strong>Status</strong>
									</TableCell>
									<TableCell>
										<strong>Gateway Client</strong>
									</TableCell>
									<TableCell>
										<strong>Date & Time</strong>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredData.map((item) => (
									<TableRow key={item.id}>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.country_code}</TableCell>
										<TableCell>{item.platform_name}</TableCell>
										<TableCell>{item.source}</TableCell>
										<TableCell>{item.status}</TableCell>
										<TableCell>{item.gateway_client}</TableCell>
										<TableCell>{item.date_time}</TableCell>
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
			</Box>
		</Grid>
	);
};

export default PublicationTable;
