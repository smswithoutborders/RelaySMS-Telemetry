import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from "./Pages/Dashboard";
import ResponsiveDrawer from "./Components/Nav";
import Loader from "./Components/Loader";
import Footer from "./Components/Footer";
import Toggle from "./Components/ThemeToggle";
import { fetchData } from "./Utils/FetchData";
import Help from "./Pages/Help";
import Contact from "./Pages/Contact";
import Data from "./Pages/TableDialog";

function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [darkMode, setDarkMode] = useState(true);
	const [filteredRows, setFilteredRows] = useState([]);

	useEffect(() => {
		fetchData("https://6603f6ac2393662c31d04103.mockapi.io/gatewayclients/api/gateways")
			.then((data) => {
				setFilteredRows(data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
				setIsLoading(false);
			});
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
							<Route path="/" element={<Dashboard filteredRows={filteredRows} />} />
							<Route path="/help" element={<Help />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/data" element={<Data />} />
						</Routes>
						<Footer />
					</Router>
				</ThemeProvider>
			)}
		</>
	);
}

export default App;
