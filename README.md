The app is deployed on AWS. Link: http://fd-reddit-app.s3-website-us-west-2.amazonaws.com/.

### Motivation
Allows user to browse Reddit and reference stock's and option's quotes all in one tab.

### Quick Guide
- Search Reddit tab: Allows user to fetch posts from selected subreddits (/r/WallStreetBets, /r/Investing...) and scans for stock tickers and option positions mentioned in each post and its comment. With just one click, user can have a quick glance at the stock quote or option quote without having to open another tab.
- Search Stock tab: Allows user to look up a stock's quote and its option chains.

### Notes
- I use TD Ameritrade API for option data. The IV for an option provided by the API is calculated by the lastest option price and stock price, but because option price is not updated outside trading hours while stock price is, IVs might seem out of place when looking at options outside trading hours.
- I also use TD Ameritrade API for chart prices. Unfortunately, the API doesn't offer chart prices of the current trading day, so the graph for one day period is actually from the previous trading day.
