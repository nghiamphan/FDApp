export const displayDate = seconds => {
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	const date = new Date(seconds * 1000)
	return days[date.getDay()] + ' ' + date.toLocaleString()
}

export const displayLargeNumber = n => {
	if (n >= 1E12) {
		return (n/1E12).toFixed(2) + 'T'
	} else if (n >= 1E9) {
		return (n/1E9).toFixed(2) + 'B'
	} else if (n >= 1E6) {
		return (n/1E6).toFixed(2) + 'M'
	} else if (n >= 1000) {
		return (n/1000).toFixed(2) + 'K'
	} else
		return n
}

export const textColorStyle = change => {
	if (change >= 0) {
		return { color: 'green' }
	} else {
		return { color: 'red' }
	}
}