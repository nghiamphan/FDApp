import redditFetch from '../services/redditFetch'

const FETCH_DATA = 'FETCH_DATA'

////////////////////////
// Reducer
////////////////////////

const dataReducer = (state = {}, action) => {
	switch (action.type) {
	case FETCH_DATA: {
		const newState = { ...state }
		newState[action.subreddit] = {
			data: action.data,
			flairs: action.flairs
		}
		return newState
	}
	default:
		return state
	}
}

////////////////////////
// Actions
////////////////////////

export const fetchData = (subreddit, pages, flair) => {
	return async dispatch => {
		const { data, flairs } = await redditFetch.fetchSubredditData(subreddit, pages, flair)
		dispatch({
			type: FETCH_DATA,
			subreddit,
			data,
			flairs,
		})
	}
}

export default dataReducer