import redditFetch from '../services/redditFetch'

const INIT_DATA = 'INIT_DATA'

////////////////////////
// Reducer
////////////////////////

const dataReducer = (state = [], action) => {
	switch (action.type) {
	case INIT_DATA:
		return action.data
	default:
		return state
	}
}

////////////////////////
// Actions
////////////////////////

export const initializeData = (subreddit, pages) => {
	return async dispatch => {
		const data = await redditFetch.fetchSubredditData(subreddit, pages)
		dispatch({
			type: INIT_DATA,
			data
		})
	}
}

export default dataReducer