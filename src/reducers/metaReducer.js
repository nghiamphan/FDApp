import { FETCH_DATA } from './dataReducer'
import { REDDIT_TAB } from '../utils/constants'

const FETCHING_REDDIT_IN_PROGRESS = 'FETCHING_REDDIT_IN_PROGRESS'
const FETCHING_STOCK_IN_PROGRESS = 'FETCHING_STOCK_IN_PROGRESS'
const SET_NAVIGATION_TAB = 'SET_NAVIGATION_TAB'
const TURN_OFF_REDDIT_SEARCH_RECOMMENDATION = 'TURN_OFF_REDDIT_SEARCH_RECOMMENDATION'
const TURN_OFF_STOCK_SEARCH_RECOMMENDATION = 'TURN_OFF_STOCK_SEARCH_RECOMMENDATION'

////////////////////////
// Reducer
////////////////////////
const initialState = {
	fetching_reddit_in_progress: false,
	fetching_stock_in_progress: false,
	navigation_tab: REDDIT_TAB,
	show_reddit_search_recommendation: true,
	show_stock_search_recommendation: true,
}

const metaReducer = (state = initialState, action) => {
	switch (action.type) {
	case FETCHING_REDDIT_IN_PROGRESS:
		return {
			...state,
			fetching_reddit_in_progress: true,
		}
	case FETCH_DATA:
		return {
			...state,
			navigation_tab: null,
			fetching_reddit_in_progress: false
		}
	case FETCHING_STOCK_IN_PROGRESS:
		return {
			...state,
			fetching_stock_in_progress: action.isFetching
		}
	case SET_NAVIGATION_TAB:
		return {
			...state,
			navigation_tab: action.navigation_tab
		}
	case TURN_OFF_REDDIT_SEARCH_RECOMMENDATION:
		return {
			...state,
			show_reddit_search_recommendation: false,
		}
	case TURN_OFF_STOCK_SEARCH_RECOMMENDATION:
		return {
			...state,
			show_stock_search_recommendation: false,
		}
	default:
		return state
	}
}

////////////////////////
// Actions
////////////////////////
export const setFetchingRedditInProgress = () => ({
	type: FETCHING_REDDIT_IN_PROGRESS,
})

export const setFetchingStockInProgress = isFetching => ({
	type: FETCHING_STOCK_IN_PROGRESS,
	isFetching,
})

export const setNavigationTab = navigation_tab => ({
	type: SET_NAVIGATION_TAB,
	navigation_tab,
})

export const turnOffRedditSearchRecommendation = () => ({
	type: TURN_OFF_REDDIT_SEARCH_RECOMMENDATION,
})

export const turnOffStockSearchRecommendation = () => ({
	type: TURN_OFF_STOCK_SEARCH_RECOMMENDATION,
})

export default metaReducer