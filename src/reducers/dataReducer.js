import redditFetch from '../services/redditFetch'
import { subreddits } from '../utils/constants'

const FETCH_DATA = 'FETCH_DATA'
const FETCH_FLAIRS = 'FETCH_FLAIRS'
const TOGGLE_DISPLAY_POST = 'TOGGLE_DISPLAY_POST'

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
	case TOGGLE_DISPLAY_POST: {
		const newState = { ...state }
		newState[action.subreddit].data = newState[action.subreddit].data.map(thread =>
			thread.id === action.id
				? { ...thread, display_post: !thread.display_post }
				: thread
		)
		return newState
	}
	default:
		return state
	}
}

////////////////////////
// Actions
////////////////////////

export const fetchData = (subreddit, pages, flair, display_post) => {
	return async dispatch => {
		const data = await redditFetch.fetchSubredditData(subreddit, pages, flair)
		dispatch({
			type: FETCH_DATA,
			subreddit,
			data: data.map(thread => ({
				...thread,
				display_post: display_post,
				display_comments: false,
			})),
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

export const toggleDisplayPost = (subreddit, id) => ({
	type: TOGGLE_DISPLAY_POST,
	subreddit,
	id,
})

export default dataReducer