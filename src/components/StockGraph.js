import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { XYPlot, LineSeries, XAxis, YAxis } from 'react-vis'
import '../../node_modules/react-vis/dist/style.css'
import moment from 'moment'

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
	const processResponse = (response, durationKey) => {
		if (response && response !== FAILED) {
			dispatch(saveFetchedStockPriceHistory(ticker, durationKey, response.map((pricePoint, index) => ({
				x: index,
				y: pricePoint.close,
				timeInMillis: pricePoint.datetime,
			}))))
		}
	}

	useEffect(() => {
		if (priceHistory.ticker !== ticker) {
			fetchPriceHistory(ticker, 'day', 1, 'minute', 1)
				.then(response => processResponse(response, '1D'))
		}
	})

	const chooseDuration = async durationKey => {
		const t = DURATIONS[durationKey]
		const response = await fetchPriceHistory(ticker, t.periodType, t.period, t.frequencyType, t.frequency)
		processResponse(response, durationKey)
	}

	const durationSelectStyle = durationKey => {
		return priceHistory.duration === durationKey
			? priceHistory.change > 0
				? {
					color: 'green',
					backgroundColor: '#343a40',
				}
				:  {
					color: 'red',
					backgroundColor: '#343a40',
				}
			: {}
	}

	const xAxisTickerFormatter = x => {
		const date = new Date(priceHistory.prices[x].timeInMillis)
			.toLocaleString('en-US', { timeZone: 'America/New_York' })

		let formatStr
		switch (priceHistory.duration) {
		case '1D':
			formatStr = 'h:mm A'
			break
		case '1W':
		case '1M':
		case '3M':
			formatStr = 'MMM D'
			break
		case '1Y':
			formatStr = 'MMM YY'
			break
		case '20Y':
			formatStr = 'YYYY'
			break
		default:
		}
		return (
			<tspan>{moment(new Date(date)).format(formatStr)}</tspan>
		)
	}

	return (
		<div className="stock-graph-div flex-container">
			<XYPlot className="stock-graph" height={200} width={600}>
				<LineSeries
					data={priceHistory.prices}
					color={priceHistory.change > 0 ? 'green' : 'red'}
					size="3"
				/>
				<XAxis
					tickFormat={xAxisTickerFormatter}
					tickSize={0}
					tickSizeOuter={5}
					tickTotal={5}
					top={170}
				/>
				<YAxis
					left={-10}
					hideLine
					tickSize={0}
				/>
			</XYPlot>

			<div className="stock-graph-select">
				{Object.keys(DURATIONS).map(durationKey =>
					<div
						key={durationKey}
						onClick={() => chooseDuration(durationKey)}
						style={durationSelectStyle(durationKey)}
					>
						{durationKey}
					</div>
				)}
			</div>
		</div>
	)
}

export default StockGraph