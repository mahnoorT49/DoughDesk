const { calculateProductCost } = require('./utils/costing');

const materials = [
  { _id: 'a', name: 'Butter', unit: 'kg', price: 1200, purchaseQuantity: 1 },
];

const product = {
  labourCost: 50,
  otherCosts: 20,
  productionQuantity: 12,
  sellingPrice: 80,
  recipe: [{ material: 'a', quantityUsed: 250, unit: 'g' }],
};

console.log(calculateProductCost(product, materials));