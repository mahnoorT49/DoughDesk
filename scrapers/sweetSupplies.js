// Sweet Supplies (sweetsupplies.pk). No selectors: uses auto-detect mode.
// If the search does not filter, open the site, search "flour", and copy
// the real search URL pattern into searchUrl below.
const { makeStoreScraper } = require('./helpers');

module.exports = makeStoreScraper({
  store: 'Sweet Supplies',
  baseUrl: 'https://sweetsupplies.pk',
  searchUrl: (q) => `https://sweetsupplies.pk/shop?search=${q}`,
});
