// Offline tests (no internet needed): node --test scrapers/
const test = require('node:test');
const assert = require('node:assert');
const { parsePrice, cleanTitle, extractProducts, finalize } = require('./helpers');

test('parsePrice', () => {
  assert.strictEqual(parsePrice('Rs 1,050.00'), 1050);
  assert.strictEqual(parsePrice('₨ 2,250.00. ₨ 2,150.00'), 2150); // lowest = sale price
  assert.strictEqual(parsePrice('Rs898 Rs800'), 800);
  assert.ok(isNaN(parsePrice('no price')));
});

test('cleanTitle removes category + repeated title', () => {
  const raw = 'Premium Pink PVC Box SALE Packaging Supplies Premium Pink PVC Box Rs 550 Rs 530';
  assert.strictEqual(cleanTitle(raw), 'Premium Pink PVC Box');
});

test('auto-detect mode (Sweet Supplies style)', () => {
  const html = '<a href="/product/flour-1kg">Flour 1kg Baking Ingredients Flour 1kg Rs 180</a><a href="/shop">Shop</a>';
  const r = finalize(extractProducts(html, { baseUrl: 'https://sweetsupplies.pk' }), 'flour', 'S');
  assert.deepStrictEqual(r, [{ store: 'S', title: 'Flour 1kg', price: 180, link: 'https://sweetsupplies.pk/product/flour-1kg' }]);
});

test('selector mode (WooCommerce style, sale price)', () => {
  const html = `<ul><li class="product"><h2 class="woocommerce-loop-product__title"><a href="/product/butter">Butter 500g</a></h2>
  <span class="price"><del>₨ 500.00</del><ins>₨ 450.00</ins></span></li></ul>`;
  const cfg = { baseUrl: 'https://x.com', item: 'li.product', title: '.woocommerce-loop-product__title', price: '.price' };
  const r = finalize(extractProducts(html, cfg), 'butter', 'X');
  assert.strictEqual(r[0].price, 450);
  assert.strictEqual(r[0].link, 'https://x.com/product/butter');
});

test('results not matching the search word are removed', () => {
  const r = finalize([{ title: 'Sugar', price: 1, link: 'a' }], 'flour', 'X');
  assert.strictEqual(r.length, 0);
});

test('selector mode (Magento / Naheed style)', () => {
  const html = `<ol><li class="item product product-item"><strong class="product name product-item-name">
  <a class="product-item-link" href="https://www.naheed.pk/p/flour-5kg.html">National Flour 5kg</a></strong>
  <div class="price-box"><span class="old-price"><span class="price">Rs. 1,200</span></span><span class="special-price"><span class="price">Rs. 1,099</span></span></div></li></ol>`;
  const cfg = { baseUrl: 'https://www.naheed.pk', item: 'li.product-item', title: '.product-item-link', price: '.price-box' };
  const r = finalize(extractProducts(html, cfg), 'flour', 'Naheed');
  assert.strictEqual(r.length, 1);
  assert.strictEqual(r[0].price, 1099);
  assert.strictEqual(r[0].link, 'https://www.naheed.pk/p/flour-5kg.html');
});
