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

export default {
	fetchQuote,
}