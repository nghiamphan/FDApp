/**
 * Return an array of threads to be displayed based on filtering parameters.
 * @param filter contains two information: subreddits whose threads to be display, and whether to display no-text threads
 * @param data Redux store data that contains fetched threads in format: { 'WallStreetBets' : { threads: [...], }, ... }
 */

export const filterThreads = (filter, data) => {
	let threadsToDisplay = []

	const subreddits = Object.keys(data)

	for (const subreddit of subreddits) {
		if (filter.subreddits.includes(subreddit)) {
			if (filter.show_notext_threads) {
				threadsToDisplay = threadsToDisplay.concat(data[subreddit].threads)
			} else {
				for (const thread of data[subreddit].threads) {
					if (thread.content)
						threadsToDisplay.push(thread)
				}
			}
		}
	}

	return threadsToDisplay
}

/**
 * Return all tickers and option positions appearing in a thread's title, post and comments.
 * More specific: Search a ticker against a thread's title, post and each comment. If it appears in each of these piece of text, search for option position of that ticker in the text that it appears.
 * @param tickers an array of predefined tickers (case sensitive)
 * @param thread data of a post including title, post content and comments
 */

export const searchTickersAndOptions = (tickers, thread) => {
	const commons = [
		'A', 'ALL', 'AN', 'ANY', 'ARE', 'AT', 'ATH', 'AWAY',
		'BE', 'BEAT', 'BUY', 'CAN', 'CDC', 'CEO', 'DD', 'DON', 'GDP',
		'EDIT', 'EPS', 'EV', 'EVER', 'FOR', 'GL', 'GO', 'HOME', 'HOLD', 'HUGE',
		'IMO', 'ING', 'IP', 'IPO', 'IRS', 'IT', 'ITM', 'JP',
		'LOAN', 'MEET', 'MS', 'MUST', 'NEW', 'NEXT',
		'OI', 'ONE', 'OUT', 'PE', 'PM', 'RH', 'TA','TV', 'UI', 'USD', 'VERY', 'YOLO'
	]

	let tickerMatches = []
	let optionMatches = []
	for (const ticker of tickers) {
		const pattern = `(\\s|^)[$]{0,1}${ticker}[^a-zA-Z0-9_]+`
		let tickerScore = 0

		const titleMatches = thread.title.match(new RegExp(pattern, 'g'))
		if (titleMatches) {
			for (const match of titleMatches) {
				if (match.includes('$'))
					tickerScore += 10
				else
					tickerScore += 3
			}
			const options = searchOptions(ticker, thread.title)
			optionMatches = optionMatches.concat(options)
			if (options.length > 0)
				tickerScore += 10
		}

		const postMatches = thread.content.match(new RegExp(pattern, 'g'))
		if (postMatches) {
			for (const match of postMatches) {
				if (match.includes('$'))
					tickerScore += 10
				else
					tickerScore += 2
			}
			const options = searchOptions(ticker, thread.content)
			optionMatches = optionMatches.concat(options)
			if (options.length > 0)
				tickerScore += 10
		}

		const comments = thread.comments
		for (const comment of comments) {
			const commentsMatches = comment.content.match(new RegExp(pattern, 'g'))
			if (commentsMatches) {
				if (comments.length >= 10)
					tickerScore += commentsMatches.length * 5 / comments.length
				else
					tickerScore += commentsMatches.length
				const options = searchOptions(ticker, comment.content)
				optionMatches = optionMatches.concat(options)
				if (options.length > 0)
					tickerScore += 10
			}
		}

		if (ticker.length === 1 || commons.includes(ticker)) {
			if (tickerScore >= 10)
				tickerMatches.push(ticker)
		}
		else if (tickerScore >= 2)
			tickerMatches.push(ticker)
	}

	return { tickers: tickerMatches, options: optionMatches }
}

/**
 * Return all option positions appearing in a piece of text in either of patterns: SPY 300C 6/19 or SPY 6/19/ 300C.
 * @param ticker
 * @param thread
 */

const searchOptions = (ticker, text) => {
	let optionMatches = []

	const optionPattern1 = `[$]{0,1}${ticker} [$]{0,1}[0-9.]{1,5}[ ]{0,1}(C|P|Call|Put) [0-9]{1,2}[/][0-9]{1,2}([/][0-9]{1,4}){0,1}[^a-zA-Z0-9_/]{1}`
	const optionPattern2 = `[$]{0,1}${ticker} [0-9]{1,2}[/][0-9]{1,2}([/][0-9]{1,4}){0,1} [$]{0,1}[0-9.]{1,5}[ ]{0,1}(C|P|Call|Put)[^a-zA-Z0-9_/{]{1}`
	const patterns = [optionPattern1, optionPattern2]

	for (const pattern of patterns) {
		const regex = new RegExp(pattern, 'gi')
		const matches = text.match(regex)
		if (matches) {
			for (const match of matches) {
				const option = extractOption(ticker, match)
				if (option) {
					optionMatches.push(option)
				}
			}
		}
	}

	return optionMatches
}

/**
 * Extract information about an option position from the given text: type, strike price and expiration date.
 * If the expiration date is invalid, return false.
 * Otherwise, return an option object with the extracted information as its properties.
 * @param ticker the ticker whose option position appears in the @param text
 * @param text the string that already contains an option position patterns
 */

const extractOption = (ticker, text) => {
	const type = (text.match(new RegExp('C', 'i')) || text.match(new RegExp('Call', 'i')))
		? 'CALL'
		: 'PUT'

	const strike = text
		.match(new RegExp('[0-9.]{1,5}[ ]{0,1}(C|P|Call|Put)', 'gi'))[0]
		.match(new RegExp('[0-9.]{1,5}', 'g'))[0]

	let [month, day, year] = text
		.match(new RegExp('[0-9]{1,2}[/][0-9]{1,2}([/][0-9]{1,4}){0,1}', 'gi'))[0]
		.split('/')

	if (!year)
		year = new Date().getFullYear()
	if (month.length === 1)
		month = '0' + month
	if (day.length === 1)
		day = '0' + day

	let date = `${year}-${month}-${day}`

	const expiration = new Date(date)
	if (isNaN(expiration.getTime())) {
		return false
	} else if (expiration.getTime() < new Date().getTime()) {
		date = `${++year}-${month}-${day}`
	}

	return {
		ticker: ticker,
		type: type,
		strike: strike,
		date: date,
	}
}