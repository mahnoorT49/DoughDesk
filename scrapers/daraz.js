// Daraz Pakistan. Daraz builds its pages with JavaScript, so cheerio cannot
// read the normal page. Its search page also has a JSON version (ajax=true)
// which axios can read. Daraz may block some servers: then this store simply
// fails and the other stores still work.
const axios = require('axios');
const { finalize, absoluteUrl, parsePrice, TIMEOUT_MS, HEADERS } = require('./helpers');

async function search(query) {
  const res = await axios.get('https://www.daraz.pk/catalog/', {
    params: { ajax: 'true', q: query },
    timeout: TIMEOUT_MS,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { ...HEADERS, Accept: 'application/json' },
  });
  // if Daraz sends a captcha page instead of JSON, this throws -> store marked failed
  const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
  const list = (data && data.mods && data.mods.listItems) || [];
  const items = list.map((it) => ({
    title: String(it.name || '').trim(),
    price: parsePrice(it.price),
    link: absoluteUrl(it.itemUrl || it.productUrl, 'https://www.daraz.pk'),
  })).filter((it) => it.title && !isNaN(it.price));
  return finalize(items, query, 'Daraz');
}

module.exports = search;
