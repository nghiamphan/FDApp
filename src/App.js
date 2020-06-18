import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateTickers } from './reducers/tickersReducer'
import { fetchFlairs } from './reducers/dataReducer'
import Navigation from './components/Navigation'
import SearchForm from './components/SearchForm'
import DisplayResult from './components/DisplayResult'
import { WSB, REDDIT_TAB } from './utils/constants'

const App = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchFlairs(WSB))
		dispatch(updateTickers())
	}, [dispatch])

	const curTab = useSelector(state => state.meta.navigation_tab)

	return (
		<div className="App">
			<Navigation/>
			{curTab === REDDIT_TAB &&
			<SearchForm/>
			}
			<DisplayResult/>
		</div>
	)
}

export default App
