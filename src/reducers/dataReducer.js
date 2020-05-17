import redditFetch from '../services/redditFetch'
import { subreddits } from '../utils/constants'

const FETCH_DATA = 'FETCH_DATA'
const FETCH_FLAIRS = 'FETCH_FLAIRS'

////////////////////////
// Reducer
////////////////////////

const initialState = {}

subreddits.map(subreddit => {
	initialState[subreddit] = {
		data: [],
		flairs: [],
	}
	return 0
})

const dataReducer = (state = initialState, action) => {
	switch (action.type) {
	case FETCH_DATA: {
		const newState = { ...state }
		newState[action.subreddit].data = action.data
		return newState
	}
	case FETCH_FLAIRS: {
		const newState = { ...state }
		newState[action.subreddit].flairs = action.flairs
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
		const data = await redditFetch.fetchSubredditData(subreddit, pages, flair)
		dispatch({
			type: FETCH_DATA,
			subreddit,
			data,
		})
	}
}

export const fetchFlairs = (subreddit) => {
	return async dispatch => {
		const flairs = await redditFetch.fetchFlairs(subreddit)
		dispatch({
			type: FETCH_FLAIRS,
			subreddit,
			flairs,
		})
	}
}

export default dataReducer