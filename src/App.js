import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateTickers } from './reducers/tickersReducer'
import { fetchFlairs } from './reducers/dataReducer'
import Navigation from './components/Navigation'
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
			<Navigation/>
			<SearchForm/>
			<DisplayResult/>
		</div>
	)
}

export default App
