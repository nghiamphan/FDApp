import companies from '../utils/tickers.json'
import { fetchTickers } from '../services/tickersFetch'

const UPDATE_TICKERS = 'UPDATE_TICKERS'

////////////////////////
// Reducer
////////////////////////
const tickersReducer = (state = companies, action) => {
	switch (action.type) {
	case UPDATE_TICKERS:
		return action.data ? action.data : state
	default:
		return state
	}
}

export const updateTickers = () => {
	return async dispatch => {
		const fetchedCompanies = await fetchTickers()
		dispatch({
			type: UPDATE_TICKERS,
			data: fetchedCompanies,
		})
	}
}

export default tickersReducer