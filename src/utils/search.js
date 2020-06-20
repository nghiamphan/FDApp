import commons from './commonWords.json'

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
	let tickerMatches = []
	let optionMatches = []

	for (const ticker of tickers) {
		const pattern = `(\\s|^|\\.)[$]{0,1}${ticker}([^a-zA-Z0-9_]+|$)`
		let isDetected = false

		if (ticker.length === 1 || commons.includes(ticker)) {
			const stricterPattern = `[$]${ticker}([^a-zA-Z0-9_]+|$)`

			if (thread.title.match(pattern)) {
				if (thread.title.match(stricterPattern))
					isDetected = true
				const options = searchOptions(ticker, thread.title)
				if (options.length > 0) {
					isDetected = true
					optionMatches = optionMatches.concat(options)
				}
			}

			if (thread.content.match(pattern)) {
				if (thread.content.match(stricterPattern))
					isDetected = true
				const options = searchOptions(ticker, thread.content)
				if (options.length > 0) {
					isDetected = true
					optionMatches = optionMatches.concat(options)
				}
			}

			for (const comment of thread.comments) {
				if (comment.content.match(pattern)) {
					if (comment.content.match(stricterPattern))
						isDetected = true
					const options = searchOptions(ticker, comment.content)
					if (options.length > 0) {
						isDetected = true
						optionMatches = optionMatches.concat(options)
					}
				}
			}

			if (isDetected)
				tickerMatches.push(ticker)

		} else {
			if (thread.title.match(pattern)) {
				isDetected = true
				optionMatches = optionMatches.concat(searchOptions(ticker, thread.title))
			}

			if (thread.content.match(pattern)) {
				isDetected = true
				optionMatches = optionMatches.concat(searchOptions(ticker, thread.content))
			}

			for (const comment of thread.comments) {
				if (comment.content.match(pattern)) {
					isDetected = true
					optionMatches = optionMatches.concat(searchOptions(ticker, comment.content))
				}
			}

			if (isDetected)
				tickerMatches.push(ticker)
		}
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

/**
 * Search the @param searchItem against the @param companies, and return up to the best six matches.
 * @param searchItem
 * @param companies an array of objects, each has a company's symbol and name
 */
export const filterTickers = (searchItem, companies) => {
	let matches = []
	let goodMatches = 0

	if (searchItem) {
		searchItem = searchItem.toUpperCase()
		for (const company of companies) {
			const point = company.symbol.indexOf(searchItem)
			if (point >= 0) {
				matches.push({ point: point, company: company })
				if (point === 0)
					goodMatches++
			} else if (company.name.toUpperCase().includes(searchItem)) {
				matches.push({ point: 10, company: company })
			}
			if (goodMatches >= 6)
				break
		}
	}
	matches.sort((x, y) => x.point - y.point)
	return matches.slice(0, 6)
}