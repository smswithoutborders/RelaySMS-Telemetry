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
	const [selectedTable, setSelectedTable] = useState("reliability");
	const [darkMode, setDarkMode] = useState(
		localStorage.getItem("darkMode") === "true" ? true : false
	);
	const [filteredRows, setFilteredRows] = useState([]);

	useEffect(() => {
		fetchData(process.env.REACT_APP_RELIABILITY_URL)
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

	const theme = createTheme({
		...customPalette[darkMode ? "dark" : "light"],
		components: {
			MuiDataGrid: {
				styleOverrides: {
					root: {
						"& .MuiDataGrid-cell": {
							backgroundColor: darkMode ? "#393939" : "#FFFFFF",
							color: darkMode ? "#FFFFFF" : "#000000"
						},
						"& .MuiDataGrid-virtualScroller": {
							backgroundColor: darkMode ? "#282727" : "#FFFFFF"
						},
						"& .MuiDataGrid-toolbarContainer": {
							backgroundColor: darkMode ? "#333" : "#FFFFFF",
							color: darkMode ? "#FFFFFF" : "#000000"
						}
					}
				}
			}
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
						<ResponsiveDrawer
							darkMode={darkMode}
							toggleDarkMode={toggleDarkMode}
							setSelectedTable={setSelectedTable}
						/>
						<Toggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
						<Routes>
							<Route
								path="/"
								element={<Dashboard selectedTable={selectedTable} filteredRows={filteredRows} />}
							/>
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
