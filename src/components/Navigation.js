import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNavigationTab } from '../reducers/metaReducer'
import { REDDIT_TAB, STOCK_TAB, ABOUT_TAB } from '../utils/constants'

const Navigation = () => {
	const dispatch = useDispatch()
	const curTab = useSelector(state => state.meta.navigation_tab)

	const backgroundColorStyle = tab => {
		if (tab === curTab) {
			return {
				backgroundColor: 'rgb(25, 25, 25)'
			}
		}
	}

	const onClickNav = tab => {
		if (tab === curTab)
			dispatch(setNavigationTab(null))
		else
			dispatch(setNavigationTab(tab))
	}

	return (
		<div className="navigation flex-container">
			<div className="navigation-item" style={backgroundColorStyle(REDDIT_TAB)} onClick={() => onClickNav(REDDIT_TAB)}>
				Search Reddit
			</div>
			<div className="navigation-item" style={backgroundColorStyle(STOCK_TAB)} onClick={() => onClickNav(STOCK_TAB)}>
				Search Stock
			</div>
			<div className="navigation-item" style={backgroundColorStyle(ABOUT_TAB)} onClick={() => onClickNav(ABOUT_TAB)}>
				About
			</div>
		</div>
	)
}

export default Navigation