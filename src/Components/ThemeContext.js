import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export function useThemeContext() {
	return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
	const [darkMode, setDarkMode] = useState(
		localStorage.getItem("darkMode") === "true" ? true : false
	);

	const toggleDarkMode = () => {
		const newMode = !darkMode;
		setDarkMode(newMode);
		localStorage.setItem("darkMode", newMode);
	};

	return (
		<ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
	);
}
