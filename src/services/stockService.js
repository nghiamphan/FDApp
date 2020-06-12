//import { config } from 'dotenv'
import axios from 'axios'

const baseUrl = 'https://api.tdameritrade.com/v1/marketdata/'
// eslint-disable-next-line no-undef
const apiKey = process.env.REACT_APP_TD_API_KEY

const fetchQuote = async ticker => {
	const url = `${baseUrl}${ticker}/quotes`
	const response = await axios.get(url, {
		params: { apikey: apiKey }
	})
	return response.data
}

/**
 * Return an array of option objects given the @param ticker, @param type, @param strike, @param date.
 * If @param strikeCount == null, the array contains exactly one option at @param strike price.
 * If @param strikeCount > 1, return that amount of options around the at-the-money price (@param strike has no effect).
 */
const fetchOptions = async (ticker, type, strike, date, strikeCount) => {
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

	return processOptionResponse(response.data, type, strike, date)
}


//////////////////
// Helpers
//////////////////
const processOptionResponse = (data, type, strike, date) => {
	let options = []

	const expDateMap = type === 'CALL'
		? data.callExpDateMap
		: data.putExpDateMap

	const dateKey = Object.keys(expDateMap)[0]
	const strikeKeys = Object.keys(expDateMap[dateKey])
	for (const strikeKey of strikeKeys) {
		const optionStat = expDateMap[dateKey][strikeKey][0]
		options.push({
			ticker: data.symbol,
			type: type,
			strike: strike,
			date: date,
			stockPrice: data.underlying.last,
			stockChange: data.underlying.change,
			stockPercentChange: data.underlying.percentChange,
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
	return options
}

export default {
	fetchQuote,
	fetchOptions,
}