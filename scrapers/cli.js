// Usage:  node scrapers/cli.js flour          (all stores)
//         node scrapers/cli.js flour --json   (raw JSON)
//         node scrapers/cli.js flour --store=TyFoods
const searchAll = require('./index');

async function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  const onlyStore = (args.find((a) => a.startsWith('--store=')) || '').split('=')[1];
  const query = args.filter((a) => !a.startsWith('--')).join(' ').trim();
  if (!query) {
    console.log('Please type something to search for. Example: node scrapers/cli.js flour');
    process.exit(1);
  }
  const start = Date.now();
  let out;
  if (onlyStore) {
    const s = searchAll.stores.find((x) => x.name.toLowerCase() === onlyStore.toLowerCase());
    if (!s) return console.log('Unknown store. Options: ' + searchAll.stores.map((x) => x.name).join(', '));
    try { out = { results: await s.search(query), failedStores: [], errors: {} }; }
    catch (e) { out = { results: [], failedStores: [s.name], errors: { [s.name]: e.message } }; }
  } else {
    out = await searchAll(query);
  }
  out.seconds = (Date.now() - start) / 1000;
  if (asJson) return console.log(JSON.stringify({ query, ...out }, null, 2));
  console.log(`\nSearch: "${query}"  (${out.seconds}s)`);
  console.table(out.results.map((r) => ({ store: r.store, title: r.title.slice(0, 50), price: r.price })));
  if (out.results.length === 0) console.log('No results.');
  if (out.failedStores.length) console.log('Failed stores:', out.failedStores.join(', '), out.errors);
}
main();
