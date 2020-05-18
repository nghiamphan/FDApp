export const identifyTicker = (tickers, thread) => {
	let newContentHtml = thread.content_html
	for (let i = 0; i < tickers.length; i++) {
		const ticker = tickers[i]
		newContentHtml = newContentHtml.replace(` ${ticker}`, ` &lt;strong&gt;${ticker}&lt;/strong&gt;`)
	}
	return newContentHtml
}