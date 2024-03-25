import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter and Routes
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from "./Pages/Dashboard";
import ResponsiveDrawer from "./Components/Nav";
import Chart from "./Pages/Charts";
import Loader from "./Components/Loader";
import DialogTable from "./Pages/TableDialog";
import Footer from "./Components/Footer";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

function App() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	}, []);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<ThemeProvider theme={darkTheme}>
					<CssBaseline />
					<Router>
						<ResponsiveDrawer />
						<Routes>
							{" "}
							<Route path="/" element={<Dashboard />} />
							<Route path="/charts" element={<Chart />} />
							<Route path="/data" element={<DialogTable />} />
						</Routes>
						<Footer />
					</Router>
				</ThemeProvider>
			)}
		</>
	);
}

export default App;
