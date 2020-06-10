const UPDATE_FILTER = 'UPDATE_FILTER'

////////////////////////
// Reducer
////////////////////////

/**
 * subreddits: an array of subreddits whose data to be displayed
 */
const initialState = {
	subreddits: [],
}

const filterReducer = (state = initialState, action) => {
	switch (action.type) {
	case UPDATE_FILTER:
		return {
			subreddits: action.subreddits,
			show_notext_threads: action.show_notext_threads,
		}
	default:
		return state
	}
}

////////////////////////
// Actions
////////////////////////

export const updateFilter = (subreddits, show_notext_threads) => ({
	type: UPDATE_FILTER,
	subreddits,
	show_notext_threads,
})

export default filterReducer