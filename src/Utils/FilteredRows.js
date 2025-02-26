import React, { createContext, useContext, useState } from "react";

const FilteredRowsContext = createContext();

export const useFilteredRows = () => useContext(FilteredRowsContext);

export const FilteredRowsProvider = ({ children }) => {
	const [filteredRows, setFilteredRows] = useState([]);

	return (
		<FilteredRowsContext.Provider value={{ filteredRows, setFilteredRows }}>
			{children}
		</FilteredRowsContext.Provider>
	);
};
