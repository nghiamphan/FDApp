const UPDATE_FILTER = 'UPDATE_FILTER'

////////////////////////
// Reducer
////////////////////////

const initialState = {
	ticker: null,
	subreddit: null,
	flair: null,
}

const filterReducer = (state = initialState, action) => {
	switch (action.type) {
	case UPDATE_FILTER:
		return {
			ticker: action.ticker,
			subreddit: action.subreddit,
			flair: action.flair,
		}
	default:
		return state
	}
}

////////////////////////
// Actions
////////////////////////

export const updateFilter = (ticker, subreddit, flair) => ({
	type: UPDATE_FILTER,
	ticker,
	subreddit,
	flair,
})

export default filterReducer