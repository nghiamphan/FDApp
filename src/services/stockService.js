import axios from 'axios'

const baseUrl = 'https://api.tdameritrade.com/v1/marketdata/'
// eslint-disable-next-line no-undef
const apiKey = process.env.REACT_APP_TD_API_KEY

/**
 * Fetch stock data for a given @param ticker
 * @param ticker
 */
const fetchQuote = async ticker => {
	try {
		const url = `${baseUrl}${ticker}/quotes`
		const response = await axios.get(url, {
			params: { apikey: apiKey }
		})
		return response.data[ticker]
	} catch (error) {
		console.log(error.message)
		return null
	}
}

/**
 * Return an array of option objects given the @param ticker, @param type, @param strike, @param date.
 * If @param strikeCount == null, the array contains exactly one option at @param strike price.
 * If @param strikeCount > 1, return that amount of options around the at-the-money price (@param strike has no effect).
 */
const fetchOptions = async (ticker, type, strike, date, strikeCount) => {
	try {
		const url = `${baseUrl}/chains`
		const response = await axios.get(url, {
			params: {
				apikey: apiKey,
				symbol: ticker,
				contractType: type,
				strike: strike,
				fromDate: date,
				toDate: date,
				strikeCount: strikeCount,
				includeQuotes: true,
			}
		})

		if (response.data.status !== 'SUCCESS')
			return null

		return processOptionResponse(response.data)
	} catch (error) {
		console.log(error.message)
		return null
	}
}


//////////////////
// Helpers
//////////////////
const processOptionResponse = (data) => {
	let option = {
		underlying: data.underlying,
		positions: [],
	}

	const types = ['callExpDateMap', 'putExpDateMap']
	for (const type of types) {
		if (data[type] !== {}) {
			const dates = Object.keys(data[type])
			for (const date of dates) {
				const strikes = Object.keys(data[type][date])
				for (const strike of strikes) {
					const optionStat = data[type][date][strike][0]
					option.positions.push({
						ticker: data.symbol,
						type: optionStat.putCall,
						strike: strike,
						date: date.split(':')[0],
						bid: optionStat.bid,
						ask: optionStat.ask,
						last: optionStat.last,
						bidSize: optionStat.bidSize,
						askSize: optionStat.askSize,
						high: optionStat.highPrice,
						low: optionStat.lowPrice,
						previousClose: optionStat.closePrice,
						percentChange: optionStat.percentChange,
						volume: optionStat.totalVolume,
						openInterest: optionStat.openInterest,
						volatility: optionStat.volatility,
						delta: optionStat.delta,
						gamma: optionStat.gamma,
						theta: optionStat.theta,
						vega: optionStat.vega,
						rho: optionStat.rho
					})
				}
			}
		}
	}

	return option
}

export default {
	fetchQuote,
	fetchOptions,
}