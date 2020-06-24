import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { XYPlot, LineSeries, XAxis, YAxis } from 'react-vis'
import '../../node_modules/react-vis/dist/style.css'

import { fetchPriceHistory } from '../services/stockService'
import { saveFetchedStockPriceHistory } from '../reducers/metaReducer'
import { FAILED } from '../utils/constants'

const DURATIONS = {
	'1D': { periodType: 'day', period: 1, frequencyType: 'minute', frequency: 1 },
	'1W': { periodType: 'day', period: 5, frequencyType: 'minute', frequency: 5 },
	'1M': { periodType: 'month', period: 1, frequencyType: 'daily', frequency: 1 },
	'3M': { periodType: 'month', period: 3, frequencyType: 'daily', frequency: 1 },
	'1Y': { periodType: 'year', period: 1, frequencyType: 'daily', frequency: 1 },
	'20Y': { periodType: 'year', period: 20, frequencyType: 'weekly', frequency: 1 },
}

const StockGraph = ({ ticker }) => {
	const dispatch = useDispatch()
	const priceHistory = useSelector(state => state.meta.fetched_stock_price_history)

	// Helper
	const processResponse = response => {
		if (response && response !== FAILED) {
			dispatch(saveFetchedStockPriceHistory('day', response.map(pricePoint => ({
				x: pricePoint.datetime,
				y: pricePoint.close,
			}))))
		}
	}

	useEffect(() => {
		if (!priceHistory.duration) {
			fetchPriceHistory(ticker, 'day', 1, 'minute', 1)
				.then(response => processResponse(response))
		}
	})

	const chooseDuration = async duration => {
		const t = DURATIONS[duration]
		const response = await fetchPriceHistory(ticker, t.periodType, t.period, t.frequencyType, t.frequency)
		processResponse(response)
	}

	return (
		<div className="stock-graph-div">
			<XYPlot height={200} width={600}>
				<LineSeries data={priceHistory.prices}  color="green" size="3"/>
				<XAxis/>
				<YAxis/>
			</XYPlot>

			<div className="stock-graph-select flex-container">
				<div onClick={() => chooseDuration('1D')}>1D</div>
				<div onClick={() => chooseDuration('1W')}>1W</div>
				<div onClick={() => chooseDuration('1M')}>1M</div>
				<div onClick={() => chooseDuration('3M')}>3M</div>
				<div onClick={() => chooseDuration('1Y')}>1Y</div>
				<div onClick={() => chooseDuration('20Y')}>20Y</div>
			</div>
		</div>
	)
}

export default StockGraph