// dataFetchingUtils.js
export async function fetchData(apiUrl) {
	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching data:", error);
		return []; // Return an empty array or handle the error accordingly
	}
}
