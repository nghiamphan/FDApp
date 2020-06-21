import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { turnOffRedditSearchRecommendation, turnOffStockSearchRecommendation } from '../reducers/metaReducer'
import { REDDIT_TAB, STOCK_TAB } from '../utils/constants'

const SearchRecommendation = () => {
	const dispatch = useDispatch()
	const showRedditSearchRecommendation = useSelector(state => state.meta.show_reddit_search_recommendation)
	const showStockSearchRecommendation = useSelector(state => state.meta.show_stock_search_recommendation)
	const curTab = useSelector(state => state.meta.navigation_tab)

	let content
	let onClose
	if (showRedditSearchRecommendation && curTab === REDDIT_TAB) {
		content =
		<>
			Search Recommendation:
			<ul>
				<div>Subreddit: <i>WallStreetBets</i></div>
				<div>Flair: <i>DD</i></div>
				<div>Sort: <i>New</i></div>
				<div>Time: <i>Past week</i></div>
			</ul>
			for the latest &ldquo;due dilligence&rdquo; from &ldquo;option experts&rdquo; of WSB.
		</>

		onClose = () => dispatch(turnOffRedditSearchRecommendation())
	} else if (showStockSearchRecommendation && curTab === STOCK_TAB) {
		content =
		<>
			If only ticker is specified, only stock&apos;s data will be fetched. Otherwise, option(s) will also be fetched.
			<p>Example search: Ticker: SPY - Type: All - Strike: 300 - From & To: next Monday.</p>
		</>

		onClose = () => dispatch(turnOffStockSearchRecommendation())
	}

	if (content) {
		return (
			<div className="search-recommendation flex-container">
				<div className="search-recommendation-text">
					{content}
				</div>
				<div
					className="search-recommendation-close"
					onClick={onClose}
				>
					<FontAwesomeIcon icon={faTimes}/>
				</div>
			</div>
		)
	} else {
		return null
	}
}

export default SearchRecommendation