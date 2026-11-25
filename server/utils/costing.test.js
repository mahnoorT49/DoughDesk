// Plain Node test: run with  node utils/costing.test.js
const assert = require('assert');
const { calculateProductCost } = require('./costing');

let passed = 0;
function test(name, fn) {
  try { fn(); console.log('PASS', name); passed++; }
  catch (e) { console.log('FAIL', name, '->', e.message); process.exitCode = 1; }
}

// Materials as plain objects (like .lean() returns)
const materials = [
  { _id: 'm1', name: 'Flour', unit: 'kg', price: 150, purchaseQuantity: 1 },
  { _id: 'm2', name: 'Sugar', unit: 'kg', price: 200, purchaseQuantity: 1 },
  { _id: 'm3', name: 'Cream', unit: 'kg', price: 500, purchaseQuantity: 1 },
  { _id: 'm4', name: 'Milk',  unit: 'litre', price: 220, purchaseQuantity: 1 },
  { _id: 'm5', name: 'Eggs',  unit: 'dozen', price: 360, purchaseQuantity: 1 },
];

const baseProduct = {
  name: 'Cookies',
  labourCost: 100,
  otherCosts: 50,
  productionQuantity: 10,
  sellingPrice: 40,
  recipe: [
    { material: 'm1', quantityUsed: 500, unit: 'g' },
    { material: 'm2', quantityUsed: 250, unit: 'g' },
  ],
};

test('worked example: 275 total, 27.5 per unit', () => {
  const r = calculateProductCost(baseProduct, materials);
  console.log(r);
  assert.strictEqual(r.lines[0].cost, 75);
  assert.strictEqual(r.lines[1].cost, 50);
  assert.strictEqual(r.materialCost, 125);
  assert.strictEqual(r.totalCost, 275);
  assert.strictEqual(r.costPerUnit, 27.5);
  assert.strictEqual(r.profitPerUnit, 12.5);
  assert.deepStrictEqual(r.warnings, []);
});

test('grams against a kg-priced material converts correctly', () => {
  const p = { ...baseProduct, labourCost: 0, otherCosts: 0,
    recipe: [{ material: 'm1', quantityUsed: 1000, unit: 'g' }] };
  assert.strictEqual(calculateProductCost(p, materials).materialCost, 150);
});

test('ml and litre convert; piece/dozen convert', () => {
  const p = { ...baseProduct, labourCost: 0, otherCosts: 0,
    recipe: [
      { material: 'm4', quantityUsed: 500, unit: 'ml' },     // 0.5 L * 220 = 110
      { material: 'm5', quantityUsed: 6, unit: 'piece' },    // 0.5 dozen * 360 = 180
    ] };
  const r = calculateProductCost(p, materials);
  assert.strictEqual(r.materialCost, 290);
});

test('ml against kg: line skipped, warning added, no crash', () => {
  const p = { ...baseProduct,
    recipe: [...baseProduct.recipe, { material: 'm3', quantityUsed: 200, unit: 'ml' }] };
  const r = calculateProductCost(p, materials);
  assert.strictEqual(r.lines.length, 2);
  assert.strictEqual(r.totalCost, 275);
  assert.strictEqual(r.warnings.length, 1);
  assert.ok(r.warnings[0].includes('Cream') && r.warnings[0].includes('ml') && r.warnings[0].includes('kg'));
  console.log('  warning:', r.warnings[0]);
});

test('missing material: skipped with a warning', () => {
  const p = { ...baseProduct,
    recipe: [...baseProduct.recipe, { material: 'gone', quantityUsed: 1, unit: 'kg' }] };
  const r = calculateProductCost(p, materials);
  assert.strictEqual(r.lines.length, 2);
  assert.strictEqual(r.totalCost, 275);
  assert.strictEqual(r.warnings.length, 1);
});

test('empty recipe: material cost 0', () => {
  const r = calculateProductCost({ ...baseProduct, recipe: [] }, materials);
  assert.strictEqual(r.materialCost, 0);
  assert.strictEqual(r.totalCost, 150);
  assert.strictEqual(r.costPerUnit, 15);
});

test('productionQuantity 0: costPerUnit and profitPerUnit are null', () => {
  const r = calculateProductCost({ ...baseProduct, productionQuantity: 0 }, materials);
  assert.strictEqual(r.costPerUnit, null);
  assert.strictEqual(r.profitPerUnit, null);
  assert.strictEqual(r.totalCost, 275);
});

test('productionQuantity missing: costPerUnit null', () => {
  const p = { ...baseProduct }; delete p.productionQuantity;
  assert.strictEqual(calculateProductCost(p, materials).costPerUnit, null);
});

test('no selling price: profitPerUnit null', () => {
  const r = calculateProductCost({ ...baseProduct, sellingPrice: 0 }, materials);
  assert.strictEqual(r.profitPerUnit, null);
});

test('populated material object in recipe still works', () => {
  const p = { ...baseProduct,
    recipe: [{ material: { _id: 'm1', name: 'Flour', unit: 'kg' }, quantityUsed: 500, unit: 'g' }] };
  assert.strictEqual(calculateProductCost(p, materials).materialCost, 75);
});

test('changing a material price changes the cost', () => {
  const changed = materials.map((m) => (m._id === 'm1' ? { ...m, price: 300 } : m));
  assert.strictEqual(calculateProductCost(baseProduct, changed).materialCost, 200);
});

test('rounds money to 2 decimals', () => {
  const p = { ...baseProduct, labourCost: 0, otherCosts: 0, productionQuantity: 3,
    recipe: [{ material: 'm1', quantityUsed: 100, unit: 'g' }] }; // 15 / 3 = 5 ; use 7 units below
  const r = calculateProductCost({ ...p, productionQuantity: 7 }, materials);
  assert.strictEqual(r.costPerUnit, 2.14);
});

test('nothing crashes with null/undefined input', () => {
  const r = calculateProductCost({}, undefined);
  assert.strictEqual(r.totalCost, 0);
  assert.strictEqual(r.costPerUnit, null);
});

console.log(`\n${passed} tests passed`);
