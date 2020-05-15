import redditFetch from '../services/redditFetch'

const INIT_DATA = 'INIT_DATA'

////////////////////////
// Reducer
////////////////////////

const dataReducer = (state = [], action) => {
	switch (action.type) {
	case INIT_DATA: {
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

export const initializeData = (subreddit, pages, flair) => {
	return async dispatch => {
		const { data, flairs } = await redditFetch.fetchSubredditData(subreddit, pages, flair)
		dispatch({
			type: INIT_DATA,
			subreddit,
			data,
			flairs,
		})
	}
}

export default dataReducer