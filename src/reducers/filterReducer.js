const UPDATE_FILTER = 'UPDATE_FILTER'

////////////////////////
// Reducer
////////////////////////

const initialState = {
	ticker: null,
	subreddits: [],
	flair: null,
}

const filterReducer = (state = initialState, action) => {
	switch (action.type) {
	case UPDATE_FILTER:
		return {
			ticker: action.ticker,
			subreddits: action.subreddits,
			flair: action.flair,
		}
	default:
		return state
	}
}

////////////////////////
// Actions
////////////////////////

export const updateFilter = (ticker, subreddits, flair) => ({
	type: UPDATE_FILTER,
	ticker,
	subreddits,
	flair,
})

export default filterReducer