import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ResponsiveDrawer from "./Components/Nav";
import Footer from "./Components/Footer";
import Toggle from "./Components/ThemeToggle";
import Help from "./Pages/Help";
import Contact from "./Pages/Contact";
import Data from "./Pages/TableDialog";
import PageNotFound from "./Pages/404";
import Reliability from "./Pages/Reliability";
import Resilience from "./Pages/Resilience";

function App() {
	const [darkMode, setDarkMode] = useState(
		localStorage.getItem("darkMode") === "true" ? true : false
	);

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
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<ResponsiveDrawer darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
				<Toggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
				<Routes>
					<Route path="/" element={<Reliability />} />
					<Route path="/resilience" element={<Resilience />} />
					<Route path="/help" element={<Help />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/data" element={<Data />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
				<Footer />
			</Router>
		</ThemeProvider>
	);
}

export default App;
