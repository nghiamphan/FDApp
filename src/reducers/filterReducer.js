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
		}
	default:
		return state
	}
}

////////////////////////
// Actions
////////////////////////

export const updateFilter = (subreddits) => ({
	type: UPDATE_FILTER,
	subreddits,
})

export default filterReducer