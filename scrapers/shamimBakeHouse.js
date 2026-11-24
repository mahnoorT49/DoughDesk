// Shamim Bake House (WordPress + WooCommerce). Standard Woo search URL.
const { makeStoreScraper } = require('./helpers');

module.exports = makeStoreScraper({
  store: 'Shamim Bake House',
  baseUrl: 'https://www.shamimbakehouse.com',
  searchUrl: (q) => `https://www.shamimbakehouse.com/?s=${q}&post_type=product`,
  item: 'li.product, .product',
  title: '.woocommerce-loop-product__title, h2 a, h3 a',
  price: '.price',
});
