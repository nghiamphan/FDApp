import axios from 'axios'

const url = 'https://cloud.iexapis.com/stable/ref-data/symbols'
// eslint-disable-next-line no-undef
const apiKey = process.env.REACT_APP_IEX_API_KEY

// Filter tickers of types: common stock (cs), ETF (et), ADR (ad), REIT (re), and warrant (wt)
const types = ['cs', 'et', 'ad', 're', 'wt']

/**
 * Fetch tickers from iex api.
 */
export const fetchTickers = async () => {
	try {
		const response = await axios.get(url, {
			params: { token: apiKey }
		})
		return filterTickers(response.data)
	} catch (error) {
		console.log(error)
		return null
	}
}

//////////////////
// Helpers
//////////////////
const filterTickers = data => {
	return data
		.filter(company => types.includes(company.type))
		.map(company => ({ symbol: company.symbol, name: company.name }))
}