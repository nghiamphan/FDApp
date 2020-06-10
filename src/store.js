import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import dataReducer from './reducers/dataReducer'
import filterReducer from './reducers/filterReducer'
import metaReducer from './reducers/metaReducer'

const reducer = combineReducers({
	data: dataReducer,
	filter: filterReducer,
	meta: metaReducer,
})

const store = createStore(
	reducer,
	composeWithDevTools(
		applyMiddleware(thunk)
	)
)

export default store