// scrapers/bakehouse.js
const axios = require('axios');
const { finalize, TIMEOUT_MS, HEADERS } = require('./helpers');

async function search(query) {
  const all = [];
  let page = 1;
  while (page <= 10) {
    const url = `https://bakehouse.pk/products.json?limit=250&page=${page}`;
    const res = await axios.get(url, {
      timeout: TIMEOUT_MS,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: HEADERS,
    });
    const products = res.data.products || [];
    if (products.length === 0) break;
    for (const p of products) {
      const variant = p.variants && p.variants[0];
      if (!variant) continue;
      const price = parseFloat(variant.price);
      if (isNaN(price)) continue;
      all.push({
        title: String(p.title || '').trim(),
        price,
        link: `https://bakehouse.pk/products/${p.handle}`,
      });
    }
    page++;
  }
  return finalize(all, query, 'Bake House');
}

module.exports = search;