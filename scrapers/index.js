// scrapers/index.js - runs all stores at the same time.
// One slow or broken store never stops the others (Promise.allSettled).
const stores = [
  { name: 'Sweet Supplies', search: require('./sweetSupplies') },
  { name: 'Shamim Bake House', search: require('./shamimBakeHouse') },
  { name: 'TyFoods', search: require('./tyFoods') },
  { name: 'Bake House', search: require('./bakehouse') },
  { name: 'Daraz', search: require('./daraz') },
];

async function searchAll(query) {
  const settled = await Promise.allSettled(stores.map((s) => s.search(query)));
  const results = [];
  const failedStores = [];
  const errors = {}; // reason per failed store (useful while debugging)
  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') results.push(...r.value); // 0 results is NOT a failure
    else {
      failedStores.push(stores[i].name);
      errors[stores[i].name] = r.reason && r.reason.message;
    }
  });
  results.sort((a, b) => a.price - b.price); // cheapest first
  return { results, failedStores, errors };
}

module.exports = searchAll;
module.exports.stores = stores;
