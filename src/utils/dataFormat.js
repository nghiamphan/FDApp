export const displayDate = seconds => {
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	const date = new Date(seconds * 1000)
	return days[date.getDay()] + ' ' + date.toLocaleString()
}

export const displayLargeNumber = n => {
	if (n >= 1000000) {
		return (n/1000000).toFixed(2) + 'M'
	} else if (n >= 1000) {
		return (n/1000).toFixed(2) + 'K'
	} else
		return n
}