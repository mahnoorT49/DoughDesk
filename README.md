# Dough Desk

run the scrapers module if needed using the following commands
npm install axios cheerio
node --test scrapers/scrapers.test.js     # offline tests, no internet needed
node scrapers/cli.js flour                # all stores
node scrapers/cli.js butter --store=TyFoods
node scrapers/cli.js sugar --json         # exact output your API will return




Added costing function
- calculateProductCost(product, materials) in utils/costing.js
- handles unit conversion, missing materials, incompatible units and zero production quantity
- add units_temp.js as a temporary convert() until Khadija's units.js is merged 
