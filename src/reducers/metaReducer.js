import { FETCH_DATA } from './dataReducer'
import { REDDIT_TAB } from '../utils/constants'

const SET_FETCHING_REDDIT_IN_PROGRESS = 'SET_FETCHING_REDDIT_IN_PROGRESS'
const SET_FETCHING_STOCK_IN_PROGRESS = 'SET_FETCHING_STOCK_IN_PROGRESS'
const SET_NAVIGATION_TAB = 'SET_NAVIGATION_TAB'
const TURN_OFF_REDDIT_SEARCH_RECOMMENDATION = 'TURN_OFF_REDDIT_SEARCH_RECOMMENDATION'
const TURN_OFF_STOCK_SEARCH_RECOMMENDATION = 'TURN_OFF_STOCK_SEARCH_RECOMMENDATION'
const SAVE_FETCHED_STOCK_DATA = 'SAVE_FETCHED_STOCK_DATA'
const SAVE_FETCHED_STOCK_PRICE_HISTORY = 'SAVE_FETCHED_STOCK_PRICE_HISTORY'

////////////////////////
// Reducer
////////////////////////
const initialState = {
	fetching_reddit_in_progress: false,
	fetching_stock_in_progress: false,
	navigation_tab: REDDIT_TAB,
	show_reddit_search_recommendation: true,
	show_stock_search_recommendation: true,
	fetched_stock_data: null, // stock's data fetched in Quote Search Form
	fetched_stock_price_history: { ticker: null, duration: null, prices: [], change: null },
}

const metaReducer = (state = initialState, action) => {
	switch (action.type) {
	case SET_FETCHING_REDDIT_IN_PROGRESS:
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
	case SET_FETCHING_STOCK_IN_PROGRESS:
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
	case SAVE_FETCHED_STOCK_DATA:
		return {
			...state,
			fetched_stock_data: action.fetchedData,
		}
	case SAVE_FETCHED_STOCK_PRICE_HISTORY:
		return {
			...state,
			fetched_stock_price_history: {
				ticker: action.ticker,
				duration: action.duration,
				prices: action.prices,
				change: action.prices[action.prices.length-1].y - action.prices[0].y
			}
		}
	default:
		return state
	}
}

////////////////////////
// Actions
////////////////////////
export const setFetchingRedditInProgress = () => ({
	type: SET_FETCHING_REDDIT_IN_PROGRESS,
})

export const setFetchingStockInProgress = isFetching => ({
	type: SET_FETCHING_STOCK_IN_PROGRESS,
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

export const saveFetchedStockData = fetchedData => ({
	type: SAVE_FETCHED_STOCK_DATA,
	fetchedData,
})

export const saveFetchedStockPriceHistory = (ticker, duration, prices) => ({
	type: SAVE_FETCHED_STOCK_PRICE_HISTORY,
	ticker,
	duration,
	prices,
})

export default metaReducer