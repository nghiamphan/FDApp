import staticCompanies from '../utils/tickers.json'
import { fetchTickers } from '../services/tickersFetch'

const UPDATE_TICKERS = 'UPDATE_TICKERS'
const KEY = 'fdapp_companies'
const ONE_DAY = 86400000

////////////////////////
// Reducer
////////////////////////
const tickersReducer = (state = staticCompanies, action) => {
	switch (action.type) {
	case UPDATE_TICKERS:
		return action.companies ? action.companies : state
	default:
		return state
	}
}

export const updateTickers = () => {
	return async dispatch => {
		const local = JSON.parse(window.localStorage.getItem(KEY))
		const companies = (local && local.expiry >= new Date().getTime())
			? local.companies
			: await fetchTickers()

		window.localStorage.setItem(KEY, JSON.stringify({
			companies: companies,
			expiry: new Date().getTime() + ONE_DAY,
		}))

		dispatch({
			type: UPDATE_TICKERS,
			companies,
		})
	}
}

export default tickersReducer