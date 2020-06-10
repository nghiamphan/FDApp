import { FETCH_DATA } from './dataReducer'
const SEARCHING_IN_PROGRESS = 'SEARCHING_IN_PROGRESS'

////////////////////////
// Reducer
////////////////////////
const initialState = {
	searching_in_progress: false,
}

const metaReducer = (state = initialState, action) => {
	switch (action.type) {
	case SEARCHING_IN_PROGRESS:
		return {
			searching_in_progress: true,
		}
	case FETCH_DATA:
		return {
			searching_in_progress: false
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

export default metaReducer