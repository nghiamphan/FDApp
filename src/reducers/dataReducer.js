import redditFetch from '../services/redditFetch'
import { SUBREDDITS, WSB } from '../utils/constants'

export const FETCH_DATA = 'FETCH_DATA'
const FETCH_FLAIRS = 'FETCH_FLAIRS'
const TOGGLE_DISPLAY_POST = 'TOGGLE_DISPLAY_POST'
const TOGGLE_DISPLAY_COMMENTS = 'TOGGLE_DISPLAY_COMMENTS'
const TOGGLE_DISPLAY_CHILD_COMMENTS = 'TOGGLE_DISPLAY_CHILD_COMMENTS'
const UPDATE_TICKERS_AND_OPTIONS = 'UPDATE_TICKERS_AND_OPTIONS'

const KEY = 'fdapp_wsbflairs'
const ONE_DAY = 86400000

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
	case TOGGLE_DISPLAY_CHILD_COMMENTS: {
		const newState = { ...state }
		const comments = newState[action.subreddit].threads.filter(thread => thread.id === action.threadId)[0].comments

		/**
		 * Each comment has three following properties:
		 * @var displayed_by_parent_comment (@default true)
		 * @var display_self (@default true)
		 * @var display_child_comments (@default true)
		 *
		 * If @var display_self = false, the comment is hidden.
		 * If @var display_self = true and @var display_child_comments = false, the comment is collapsed: its header is shown, but its content and its child comments are hidden.
		 * If @var display_self = true and @var display_child_comments = true, the comment and its child comments are shown.
		 *
		 * A comment's @var displayed_by_parent_comment is equal to its parent comment's @var display_child_comments.
		 */
		let i = 0
		while (i < comments.length) {
			if (comments[i].id !== action.parentCommentId) {
				i++
				continue
			} else {
				const parentCommentLevel = comments[i].comment_level
				const setDisplay = !comments[i].display_child_comments
				comments[i].display_child_comments = setDisplay

				i++
				while (i < comments.length && comments[i].comment_level > parentCommentLevel) {
					if (comments[i].comment_level === parentCommentLevel + 1)
						comments[i].displayed_by_parent_comment = setDisplay

					/**
					 * If a comment @var X is expanded, all of @var X's child and grandchild comments is displayed as they were the last time @var X is expanded (hidden, collapsed or shown).
					 * The @var display_self of each grandchild comment is preserved in its parent comment's @var displayed_by_parent_comment.
					 */
					if (setDisplay)
						comments[i].display_self = comments[i].displayed_by_parent_comment
					else
						comments[i].display_self = setDisplay
					i++
				}

				break
			}
		}

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
		dispatch ({
			type: FETCH_DATA,
			subreddit,
			threads: [],
		})
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

/**
 * Call the service to fetch the flairs of a @param subreddit and returns the data. Only used for WSB.
 * @param subreddit
 */
export const fetchFlairs = (subreddit) => {
	return async dispatch => {
		const local = JSON.parse(window.localStorage.getItem(KEY))
		const flairs = (subreddit === WSB && local && local.expiry >= new Date().getTime())
			? local.wsbflairs
			: await redditFetch.fetchFlairs(subreddit)

		window.localStorage.setItem(KEY, JSON.stringify({
			wsbflairs: flairs,
			expiry: new Date().getTime() + ONE_DAY,
		}))

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

/**
 * @param subreddit
 * @param threadId
 * @param parentCommentId
 */
export const toggleDisplayChildComments = (subreddit, threadId, parentCommentId) => ({
	type: TOGGLE_DISPLAY_CHILD_COMMENTS,
	subreddit,
	threadId,
	parentCommentId,
})

/**
 * Update the properties @param tickers and @param options of a thread given its @param subreddit and @param id
 * @param subreddit
 * @param id
 * @param tickers
 * @param options
 */
export const updateTickersAndOptions = (subreddit, id, tickers, options) => ({
	type: UPDATE_TICKERS_AND_OPTIONS,
	subreddit,
	id,
	tickers,
	options,
})

export default dataReducer