import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateTickers } from './reducers/tickersReducer'
import { fetchFlairs } from './reducers/dataReducer'
import SearchForm from './components/SearchForm'
import DisplayResult from './components/DisplayResult'
import { WSB } from './utils/constants'

const App = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchFlairs(WSB))
		dispatch(updateTickers())
	}, [dispatch])

	return (
		<div className="App">
			<SearchForm/>
			<DisplayResult/>
		</div>
	)
}

export default App
