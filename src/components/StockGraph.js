import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VictoryCandlestick, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory'
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
				open: pricePoint.open,
				close: pricePoint.close,
				high: pricePoint.high,
				low: pricePoint.close,
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

	const tooltipFormatter = datum => {
		const date = new Date(datum.timeInMillis)
			.toLocaleString('en-US', { timeZone: 'America/New_York' })

		let formatStr
		switch (priceHistory.duration) {
		case '1D':
		case '1W':
			formatStr = 'MMM D, h:mm A'
			break
		case '1M':
		case '3M':
		case '1Y':
		case '20Y':
			formatStr = 'MMM D, YYYY'
			break
		default:
		}

		return [
			moment(new Date(date)).format(formatStr),
			`Open: ${datum.open} - Close: ${datum.close}`,
			`Low: ${datum.low} - High: ${datum.high}`
		]
	}

	const xAxisTickFormatter = x => {
		if (!priceHistory.prices[x])
			return x

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
		return moment(new Date(date)).format(formatStr)
	}

	return (
		<div className="stock-graph-div flex-container">
			<div>
				<VictoryChart
					domainPadding={{ y: [20, 60] }}
					padding={{ top: 0, bottom: 30, left: 50, right: 20 }}
					height={250}
					width={1000}
				>
					<VictoryCandlestick
						labels={({ datum }) => tooltipFormatter(datum)}
						labelComponent={<VictoryTooltip
							center={{ x: 900, y: 20 }}
							flyoutHeight={50}
							flyoutWidth={180}
							pointerLength={0}
							flyoutStyle={{ fill: 'transparent', stroke:'white' }}
						/>}
						data={priceHistory.prices}
						style= {{
							data: {
								stroke: ({ datum }) => datum.close >= datum.open ? 'green' : 'red',
								strokeWidth: 1,
								fill: ({ datum }) => datum.close >= datum.open ? 'green' : 'red',
							},
							labels: { fontSize: 13, fill: 'white' }
						}}
					/>
					<VictoryAxis
						tickFormat={(x) => xAxisTickFormatter(x)}
						style={{
							axis: { stroke: 'white' },
							ticks: { stroke: 'white', size: 5 },
							tickLabels: { fontSize: 14, padding: 5, fill: 'white' },
						}}
					/>
					<VictoryAxis dependentAxis
						style={{
							axis: { stroke: null },
							tickLabels: { fontSize: 14, padding: 20, fill: 'white' },
						}}
					/>
				</VictoryChart>
			</div>

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