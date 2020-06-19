import { FETCH_DATA } from './dataReducer'
import { REDDIT_TAB } from '../utils/constants'

const SEARCHING_IN_PROGRESS = 'SEARCHING_IN_PROGRESS'
const SET_NAVIGATION_TAB = 'SET_NAVIGATION_TAB'
const TURN_OFF_SEARCH_RECOMMENDATION = 'TURN_OFF_SEARCH_RECOMMENDATION'

////////////////////////
// Reducer
////////////////////////
const initialState = {
	searching_in_progress: false,
	navigation_tab: REDDIT_TAB,
	show_search_recommendation: true,
}

const metaReducer = (state = initialState, action) => {
	switch (action.type) {
	case SEARCHING_IN_PROGRESS:
		return {
			...state,
			searching_in_progress: true,
		}
	case FETCH_DATA:
		return {
			...state,
			navigation_tab: null,
			searching_in_progress: false
		}
	case SET_NAVIGATION_TAB:
		return {
			...state,
			navigation_tab: action.navigation_tab
		}
	case TURN_OFF_SEARCH_RECOMMENDATION:
		return {
			...state,
			show_search_recommendation: false,
		}
	default:
		return state
	}
}

////////////////////////
// Actions
////////////////////////
export const setSearchingInProgress = () => ({
	type: SEARCHING_IN_PROGRESS,
})

export const setNavigationTab = navigation_tab => ({
	type: SET_NAVIGATION_TAB,
	navigation_tab,
})

export const turnOffSearchRecommendation = () => ({
	type: TURN_OFF_SEARCH_RECOMMENDATION,
})

export default metaReducer