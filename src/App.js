import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from "./Pages/Dashboard";
import ResponsiveDrawer from "./Components/Nav";
import Chart from "./Pages/Charts";
import Loader from "./Components/Loader";
import DialogTable from "./Pages/TableDialog";
import Footer from "./Components/Footer";
import Toggle from "./Components/ThemeToggle";

function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [darkMode, setDarkMode] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	}, []);

	const toggleDarkMode = () => {
		setDarkMode((prevMode) => !prevMode);
	};

	const theme = createTheme({
		palette: {
			mode: darkMode ? "dark" : "light"
		}
	});

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Router>
						<ResponsiveDrawer darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
						<Toggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
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
