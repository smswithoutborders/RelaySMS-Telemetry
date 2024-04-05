import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ResponsiveDrawer from "./Components/Nav";
import Loader from "./Components/Loader";
import Footer from "./Components/Footer";
import Toggle from "./Components/ThemeToggle";
import { fetchData } from "./Utils/FetchData";
import Help from "./Pages/Help";
import Contact from "./Pages/Contact";
import Data from "./Pages/TableDialog";
import PageNotFound from "./Pages/404";
import Reliability from "./Pages/Reliability";
import Resilience from "./Pages/Resilience";

const reliabilityApiUrl = process.env.REACT_APP_RELIABILITY_URL;
const resilienceApiUrl = process.env.REACT_APP_RESILIENCE_URL;

function App(selectedCountry, selectedDate, selectedOperator) {
	const [isLoading, setIsLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const [filteredRows, setFilteredRows] = useState([]);

	const [selectedTable, setSelectedTable] = useState("reliability");
	const [darkMode, setDarkMode] = useState(
		localStorage.getItem("darkMode") === "true" ? true : false
	);

	useEffect(() => {
		if (rows.length < 1) {
			fetchData(resilienceApiUrl)
				.then((data) => {
					setRows(data);
					setFilteredRows(data);
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		}
	}, [rows, resilienceApiUrl]);

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

	useEffect(() => {
		fetchData(reliabilityApiUrl)
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
		const newMode = !darkMode;
		setDarkMode(newMode);
		localStorage.setItem("darkMode", newMode);
	};

	const customPalette = {
		light: {
			palette: {
				mode: "light"
			}
		},
		dark: {
			palette: {
				mode: "dark"
			}
		}
	};

	const theme = createTheme(darkMode ? customPalette.dark : customPalette.light);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Router>
						<ResponsiveDrawer
							darkMode={darkMode}
							toggleDarkMode={toggleDarkMode}
							setSelectedTable={setSelectedTable}
						/>
						<Toggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
						<Routes>
							<Route
								path="/"
								element={
									<Reliability
										rows={filteredRows}
										selectedCountry={selectedCountry}
										selectedOperator={selectedOperator}
										selectedDate={selectedDate}
										selectedTable={selectedTable}
										filteredRows={filteredRows}
									/>
								}
							/>
							<Route
								path="/resilience"
								element={
									<Resilience
										rows={filteredRows}
										selectedCountry={selectedCountry}
										selectedOperator={selectedOperator}
										selectedDate={selectedDate}
										selectedTable={selectedTable}
										filteredRows={filteredRows}
									/>
								}
							/>
							<Route path="/help" element={<Help />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/data" element={<Data />} />
							<Route path="*" element={<PageNotFound />} />
						</Routes>
						<Footer />
					</Router>
				</ThemeProvider>
			)}
		</>
	);
}

export default App;
