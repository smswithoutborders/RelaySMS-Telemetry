import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Footer from "./Components/Footer";
import Toggle from "./Components/ThemeToggle";
import Help from "./Pages/Help";
import Contact from "./Pages/Contact";
import Data from "./Pages/TableDialog";
import PageNotFound from "./Pages/404";
import Reliability from "./Pages/Reliability";
import Resilience from "./Pages/Resilience";
import MobileNav from "./Components/MobileNav";
import Nav from "./Components/Nav";
import OpenTelemetry from "./Pages/OpenTelemetry";
import Publication from "./Pages/Publication";
import { ThemeProvider as AppThemeProvider, useThemeContext } from "./Components/ThemeContext";

function App() {
	const { darkMode, toggleDarkMode } = useThemeContext();

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
							backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
							color: darkMode ? "#ffffff" : "#000000",
							borderBottom: `1px solid ${darkMode ? "#2c2c2c" : "#e0e0e0"}`
						},
						"& .MuiDataGrid-columnHeaders": {
							backgroundColor: darkMode ? "#333333" : "#eeeeee",
							color: darkMode ? "#ffffff" : "#000000",
							borderBottom: `1px solid ${darkMode ? "#444444" : "#cccccc"}`
						},
						"& .MuiDataGrid-toolbarContainer": {
							backgroundColor: darkMode ? "#444444" : "#f5f5f5",
							color: darkMode ? "#ffffff" : "#000000"
						},
						"& .MuiDataGrid-row:hover": {
							backgroundColor: darkMode ? "#333333" : "#f5f5f5"
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
				<Nav darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
				<MobileNav darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
				<Toggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
				<Routes>
					<Route path="/Reliability" element={<Reliability />} />
					<Route path="/resilience" element={<Resilience />} />
					<Route path="/publication" element={<Publication />} />
					<Route path="/help" element={<Help />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/tests" element={<Data />} />
					<Route path="/" element={<OpenTelemetry />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
				<Footer />
			</Router>
		</ThemeProvider>
	);
}

function AppWithTheme() {
	return (
		<AppThemeProvider>
			<App />
		</AppThemeProvider>
	);
}

export default AppWithTheme;
