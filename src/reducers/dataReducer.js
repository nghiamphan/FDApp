import redditFetch from '../services/redditFetch'
import { SUBREDDITS } from '../utils/constants'

const FETCH_DATA = 'FETCH_DATA'
const FETCH_FLAIRS = 'FETCH_FLAIRS'
const TOGGLE_DISPLAY_POST = 'TOGGLE_DISPLAY_POST'
const TOGGLE_DISPLAY_COMMENTS = 'TOGGLE_DISPLAY_COMMENTS'
const UPDATE_TICKERS_AND_OPTIONS = 'UPDATE_TICKERS_AND_OPTIONS'

////////////////////////
// Reducer
////////////////////////

const initialState = {}

SUBREDDITS.map(subreddit => {
	initialState[subreddit] = {
		threads: [],
		flairs: [],
	}
	return 0
})

const dataReducer = (state = initialState, action) => {
	switch (action.type) {
	case FETCH_DATA: {
		const newState = { ...state }
		newState[action.subreddit].threads = action.threads
		return newState
	}
	case FETCH_FLAIRS: {
		const newState = { ...state }
		newState[action.subreddit].flairs = action.flairs
		return newState
	}
	case TOGGLE_DISPLAY_POST: {
		const newState = { ...state }
		newState[action.subreddit].threads = newState[action.subreddit].threads.map(thread =>
			thread.id === action.id
				? { ...thread, display_post: !thread.display_post }
				: thread
		)
		return newState
	}
	case TOGGLE_DISPLAY_COMMENTS: {
		const newState = { ...state }
		newState[action.subreddit].threads = newState[action.subreddit].threads.map(thread =>
			thread.id === action.id
				? { ...thread, display_comments: !thread.display_comments }
				: thread
		)
		return newState
	}
	case UPDATE_TICKERS_AND_OPTIONS: {
		const newState = { ...state }
		newState[action.subreddit].threads = newState[action.subreddit].threads.map(thread =>
			thread.id === action.id
				? { ...thread, tickers: action.tickers, options: action.options }
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
		const threads = await redditFetch.fetchSubredditData(subreddit, pages, query, flair, sort, time)
		dispatch({
			type: FETCH_DATA,
			subreddit,
			threads: threads.map(thread => ({
				...thread,
				display_post: display_post,
				display_comments: false,
				tickers: null, // an array of tickers that appear in the thread's title, post and comments
				options: null, // an array of option positions that appear in the thread's title, post and comments
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

export const updateTickersAndOptions = (subreddit, id, tickers, options) => ({
	type: UPDATE_TICKERS_AND_OPTIONS,
	subreddit,
	id,
	tickers,
	options,
})

export default dataReducer