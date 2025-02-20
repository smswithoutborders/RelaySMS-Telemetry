import React, { useState, useEffect } from "react";

const DataFilter = () => {
	const [publications, setPublications] = useState(null);
	const [filters, setFilters] = useState({
		country_code: "",
		platform_name: "",
		status: "",
		gateway_client: ""
	});

	// Fetch data from the API when the component mounts
	useEffect(() => {
		const fetchPublications = async () => {
			try {
				const today = new Date();
				const formattedToday = today.toISOString().split("T")[0];

				const response = await fetch(
					`https://api.telemetry.staging.smswithoutborders.com/v1/publications?start_date=2021-01-10&end_date=${formattedToday}&country_code=ca&platform_name=twitter&status=published&page=1&page_size=10`
				);
				const data = await response.json();
				setPublications(data.publications);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchPublications();
	}, []);

	// Return loading message if data is not available yet
	if (!publications) {
		return <div>Loading...</div>;
	}

	const { data } = publications;

	// Extract unique values for filtering
	const uniqueCountries = [...new Set(data.map((item) => item.country_code))];
	const uniquePlatforms = [...new Set(data.map((item) => item.platform_name))];
	const uniqueStatuses = [...new Set(data.map((item) => item.status))];
	const uniqueClients = [...new Set(data.map((item) => item.gateway_client))];

	// Handle filter changes
	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: value
		}));
	};

	// Apply filters to data
	const filteredData = data.filter((item) => {
		return (
			(filters.country_code === "" || item.country_code === filters.country_code) &&
			(filters.platform_name === "" || item.platform_name === filters.platform_name) &&
			(filters.status === "" || item.status === filters.status) &&
			(filters.gateway_client === "" || item.gateway_client === filters.gateway_client)
		);
	});

	return (
		<div>
			<h2>Publications Data</h2>

			{/* Filters Section */}
			<div>
				<label>Country: </label>
				<select name="country_code" onChange={handleFilterChange}>
					<option value="">All</option>
					{uniqueCountries.map((country) => (
						<option key={country} value={country}>
							{country}
						</option>
					))}
				</select>

				<label>Platform: </label>
				<select name="platform_name" onChange={handleFilterChange}>
					<option value="">All</option>
					{uniquePlatforms.map((platform) => (
						<option key={platform} value={platform}>
							{platform}
						</option>
					))}
				</select>

				<label>Status: </label>
				<select name="status" onChange={handleFilterChange}>
					<option value="">All</option>
					{uniqueStatuses.map((status) => (
						<option key={status} value={status}>
							{status}
						</option>
					))}
				</select>

				<label>Client: </label>
				<select name="gateway_client" onChange={handleFilterChange}>
					<option value="">All</option>
					{uniqueClients.map((client) => (
						<option key={client} value={client}>
							{client}
						</option>
					))}
				</select>
			</div>

			{/* Data Table */}
			<table border="1">
				<thead>
					<tr>
						<th>Country Code</th>
						<th>Platform</th>
						<th>Source</th>
						<th>Status</th>
						<th>Client</th>
						<th>Date Time</th>
					</tr>
				</thead>
				<tbody>
					{filteredData.length > 0 ? (
						filteredData.map((item) => (
							<tr key={item.id}>
								<td>{item.country_code}</td>
								<td>{item.platform_name}</td>
								<td>{item.source}</td>
								<td>{item.status}</td>
								<td>{item.gateway_client}</td>
								<td>{item.date_time}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="6">No data available</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default DataFilter;
