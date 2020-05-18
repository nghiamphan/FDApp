const displayDate = seconds => {
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	const date = new Date(seconds * 1000)
	return days[date.getDay()] + ' ' + date.toLocaleString()
}

export default displayDate