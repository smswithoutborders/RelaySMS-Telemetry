import React, { useState, useEffect } from "react";

const DataFilter = ({ publisher, country, platform, status, client }) => {
	const [publications, setPublications] = useState(null);

	// Fetch data from the API when the component mounts
	useEffect(() => {
		const fetchPublications = async () => {
			try {
				const response = await fetch(
					"https://api.telemetry.staging.smswithoutborders.com/v1/publications?start_date=2020-01-01&end_date=2025-01-01&country_code=CA&platform_name=Twitter&status=published&page=1&page_size=10"
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

	const { data: publicationData } = publications;

	// Ensure data is available before mapping
	if (!publicationData || publicationData.length === 0) {
		return <div>No publications available</div>;
	}

	// Extract unique values for filtering
	const uniqueCountries = [...new Set(publicationData.map((item) => item.country_code))];
	const uniquePlatforms = [...new Set(publicationData.map((item) => item.platform_name))];
	const uniqueStatuses = [...new Set(publicationData.map((item) => item.status))];
	const uniqueClients = [...new Set(publicationData.map((item) => item.gateway_client))];

	return (
		<div>
			{/* Publisher filter */}
			<label>Publisher: </label>
			<select name="publisher" value={publisher}>
				<option value="">All</option>
				{["Publisher 1", "Publisher 2", "Publisher 3"].map((publisherOption) => (
					<option key={publisherOption} value={publisherOption}>
						{publisherOption}
					</option>
				))}
			</select>

			{/* Country filter */}
			<label>Country: </label>
			<select name="country" value={country}>
				<option value="">All</option>
				{uniqueCountries.map((countryOption) => (
					<option key={countryOption} value={countryOption}>
						{countryOption}
					</option>
				))}
			</select>

			{/* Platform filter */}
			<label>Platform: </label>
			<select name="platform" value={platform}>
				<option value="">All</option>
				{uniquePlatforms.map((platformOption) => (
					<option key={platformOption} value={platformOption}>
						{platformOption}
					</option>
				))}
			</select>

			{/* Status filter */}
			<label>Status: </label>
			<select name="status" value={status}>
				<option value="">All</option>
				{uniqueStatuses.map((statusOption) => (
					<option key={statusOption} value={statusOption}>
						{statusOption}
					</option>
				))}
			</select>

			{/* Client filter */}
			<label>Client: </label>
			<select name="client" value={client}>
				<option value="">All</option>
				{uniqueClients.map((clientOption) => (
					<option key={clientOption} value={clientOption}>
						{clientOption}
					</option>
				))}
			</select>
		</div>
	);
};

export default DataFilter;
