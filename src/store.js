import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import dataReducer from './reducers/dataReducer'

const reducer = combineReducers({
	data: dataReducer
})

const store = createStore(
	reducer,
	composeWithDevTools(
		applyMiddleware(thunk)
	)
)

export default store