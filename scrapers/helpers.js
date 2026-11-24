// scrapers/helpers.js
// Shared tools used by every store file. Node + axios + cheerio only.
const axios = require('axios');
const cheerio = require('cheerio');

const TIMEOUT_MS = 8000; // every request gives up after 8 seconds
const MAX_RESULTS = 10;  // max results kept per store

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

// Matches things like "Rs 550", "Rs1,050.00", "₨ 450.00", "PKR 99"
const PRICE_RE = /(?:Rs\.?|PKR|₨)\s*\d[\d,]*(?:\.\d+)?/gi;
const HAS_PRICE_RE = /(?:Rs\.?|PKR|₨)\s*\d/i;

// "Rs 1,050.00" -> 1050. If the text has several prices (old + sale),
// we return the LOWEST one, because that is what the customer pays.
function parsePrice(text) {
  const nums = String(text || '').match(/\d[\d,]*(?:\.\d+)?/g);
  if (!nums) return NaN;
  const values = nums.map((n) => parseFloat(n.replace(/,/g, ''))).filter((n) => n > 0);
  return values.length ? Math.min(...values) : NaN;
}

// "/product/x" + "https://site.pk" -> "https://site.pk/product/x"
function absoluteUrl(href, base) {
  if (!href) return '';
  try {
    return new URL(href, base).href;
  } catch {
    return '';
  }
}

const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();

// Cleans text taken from a whole product link (used by auto-detect mode):
// removes prices and labels, and removes a repeated title
// ("Title Category Title" -> "Title").
function cleanTitle(raw) {
  let t = normalize(
    String(raw || '')
      .replace(PRICE_RE, ' ')
      .replace(/\b(SALE|Choose options|Add to bag|Add to cart|Quickview)\b/gi, ' ')
  );
  for (let len = Math.floor((t.length - 3) / 2); len >= 3; len--) {
    if (t.slice(0, len) === t.slice(-len) && t.charAt(len) === ' ') return t.slice(0, len);
  }
  return t;
}

// Download a page as text. Timeout is enforced twice (axios + AbortSignal).
async function fetchHtml(url, extra = {}) {
  const res = await axios.get(url, {
    timeout: TIMEOUT_MS,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: HEADERS,
    responseType: 'text',
    ...extra,
  });
  return res.data;
}

// Mode 1: use the CSS selectors written for the store.
function fromSelectors($, cfg) {
  const out = [];
  $(cfg.item).each((i, el) => {
    const $el = $(el);
    const $t = $el.find(cfg.title).first();
    const title = normalize($t.text());
    // the link is the title itself, a link inside it, or the first link in the card
    const href =
      ($t.is('a') ? $t.attr('href') : $t.find('a').attr('href')) ||
      $t.closest('a').attr('href') ||
      $el.find('a').first().attr('href');
    const $p = $el.find(cfg.price).first();
    const $sale = $p.find('ins').first(); // WooCommerce sale price
    const price = parsePrice(($sale.length ? $sale : $p).text());
    if (title && !isNaN(price)) out.push({ title, price, link: absoluteUrl(href, cfg.baseUrl) });
  });
  return out;
}

// Mode 2 (backup): no selectors needed. Finds every link whose text
// contains a "Rs ..." price and treats it as a product.
function fromAutoDetect($, cfg) {
  const out = [];
  $('a[href]').each((i, a) => {
    const text = normalize($(a).text());
    if (!HAS_PRICE_RE.test(text)) return;
    const price = parsePrice((text.match(PRICE_RE) || []).join(' '));
    const title = cleanTitle(text);
    if (title.length >= 3 && !isNaN(price)) {
      out.push({ title, price, link: absoluteUrl($(a).attr('href'), cfg.baseUrl) });
    }
  });
  return out;
}

// Keep only results that contain every search word, remove duplicates, limit to 10.
function finalize(items, query, store) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const seen = new Set();
  const results = [];
  for (const it of items) {
    const key = it.link || it.title;
    if (seen.has(key)) continue;
    seen.add(key);
    const lower = it.title.toLowerCase();
    if (!words.every((w) => lower.includes(w))) continue;
    results.push({ store, title: it.title, price: it.price, link: it.link });
  }
  return results.slice(0, MAX_RESULTS);
}

// Pure function (no network): HTML in, products out. Easy to test.
function extractProducts(html, cfg) {
  const $ = cheerio.load(html);
  let items = cfg.item ? fromSelectors($, cfg) : [];
  if (items.length === 0) items = fromAutoDetect($, cfg);
  return items;
}

// Builds a store's search(query) function from a small config object.
function makeStoreScraper(cfg) {
  return async function search(query) {
    const html = await fetchHtml(cfg.searchUrl(encodeURIComponent(query)));
    return finalize(extractProducts(html, cfg), query, cfg.store);
  };
}

module.exports = {
  makeStoreScraper, extractProducts, finalize, fetchHtml,
  parsePrice, absoluteUrl, cleanTitle, TIMEOUT_MS, HEADERS,
};
