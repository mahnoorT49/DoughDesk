# Dough Desk

run the scrapers module if needed using the following commands

npm install axios cheerio

node --test scrapers/scrapers.test.js     # offline tests, no internet needed

node scrapers/cli.js flour                # all stores

node scrapers/cli.js butter --store=TyFoods

node scrapers/cli.js sugar --json         # exact output your API will return
