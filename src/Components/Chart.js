import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from "recharts";

// LineChart component
const LineChartComponent = ({ data }) => {
	// Format the data to match the structure needed for the LineChart
	const formattedData = data.map((row) => ({
		name: row.timeframe, // Use the timeframe as the label
		signupUsers: row.signup_users, // Number of signup users
		retainedUsers: row.retained_users // Number of retained users
	}));

	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart data={formattedData}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line type="monotone" dataKey="signupUsers" stroke="#8884d8" activeDot={{ r: 8 }} />
				<Line type="monotone" dataKey="retainedUsers" stroke="#82ca9d" />
			</LineChart>
		</ResponsiveContainer>
	);
};

export default LineChartComponent;
