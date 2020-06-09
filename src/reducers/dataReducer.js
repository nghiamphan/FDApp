import redditFetch from '../services/redditFetch'
import { subreddits } from '../utils/constants'

const FETCH_DATA = 'FETCH_DATA'
const FETCH_FLAIRS = 'FETCH_FLAIRS'
const TOGGLE_DISPLAY_POST = 'TOGGLE_DISPLAY_POST'
const TOGGLE_DISPLAY_COMMENTS = 'TOGGLE_DISPLAY_COMMENTS'
const PROCESS_TICKERS = 'PROCESS_TICKERS'

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
	case TOGGLE_DISPLAY_COMMENTS: {
		const newState = { ...state }
		newState[action.subreddit].data = newState[action.subreddit].data.map(thread =>
			thread.id === action.id
				? { ...thread, display_comments: !thread.display_comments }
				: thread
		)
		return newState
	}
	case PROCESS_TICKERS: {
		const newState = { ...state }
		newState[action.subreddit].data = newState[action.subreddit].data.map(thread =>
			thread.id === action.id
				? { ...thread, tickers: action.tickers }
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

export const fetchData = (subreddit, pages, query, flair, sort, time, display_post) => {
	return async dispatch => {
		const data = await redditFetch.fetchSubredditData(subreddit, pages, query, flair, sort, time)
		dispatch({
			type: FETCH_DATA,
			subreddit,
			data: data.map(thread => ({
				...thread,
				display_post: display_post,
				display_comments: false,
				tickers: null, // tickers that appear in the content
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

/**
 * @param subreddit
 * @param id the id of a thread whose post content is to be toggled on or off
 */
export const toggleDisplayPost = (subreddit, id) => ({
	type: TOGGLE_DISPLAY_POST,
	subreddit,
	id,
})

/**
 * @param subreddit
 * @param id the id of a thread whose comments are to be toggled on or off
 */

export const toggleDisplayComments = (subreddit, id) => ({
	type: TOGGLE_DISPLAY_COMMENTS,
	subreddit,
	id,
})

export const processTickers = (subreddit, id, tickers) => ({
	type: PROCESS_TICKERS,
	subreddit,
	id,
	tickers,
})

export default dataReducer