// TyFoods (OpenCart). Search URL is /search?search=word
const { makeStoreScraper } = require('./helpers');

module.exports = makeStoreScraper({
  store: 'TyFoods',
  baseUrl: 'https://tyfoods.pk',
  searchUrl: (q) => `https://tyfoods.pk/search?tag=${q}`,
  item: '.product-thumb, .product-layout',
  title: '.caption h4 a, h4 a, .name a',
  price: '.price',
});
