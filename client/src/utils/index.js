export const truncateString = (str, maxLength)=> {
	if (str.length > maxLength) {
		return str.slice(0, maxLength) + '...';
	}
	return str;
}

export const formatDate = (dateStr) => {
	const date = new Date(dateStr);

	// Format the date to dd-mm-yyyy
	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
	const year = date.getUTCFullYear();

	return `${day}-${month}-${year}`;
};