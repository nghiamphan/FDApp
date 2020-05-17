import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFlairs } from './reducers/dataReducer'
import SearchForm from './components/SearchForm'
import DisplayResult from './components/DisplayResult'

const App = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchFlairs('wallstreetbets'))
	}, [dispatch])

	return (
		<div className="App">
			<SearchForm/>
			<DisplayResult/>
		</div>
	)
}

export default App
