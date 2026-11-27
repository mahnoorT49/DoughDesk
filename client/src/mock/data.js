// Sample data in the same shapes as the real API
export const user = { _id: 'u1', name: 'Irina', email: 'irina@example.com' };

export const materials = [
  { _id: 'm1', name: 'Flour', unit: 'kg', price: 150, purchaseQuantity: 1, stockQuantity: 12, lowStockLevel: 5 },
  { _id: 'm2', name: 'Sugar', unit: 'kg', price: 180, purchaseQuantity: 1, stockQuantity: 3, lowStockLevel: 5 },
  { _id: 'm3', name: 'Butter', unit: 'kg', price: 1200, purchaseQuantity: 1, stockQuantity: 0, lowStockLevel: 2 },
  { _id: 'm4', name: 'Eggs', unit: 'dozen', price: 400, purchaseQuantity: 1, stockQuantity: 6, lowStockLevel: 2 },
];

// Recipes keep only the material id here; mock/index.js expands it for the detail page
export const products = [
  {
    _id: 'p1', name: 'Vanilla Cake', stockQuantity: 4, productionQuantity: 8,
    labourCost: 500, otherCosts: 200, sellingPrice: 900, costPerUnit: 420,
    recipe: [
      { material: 'm1', quantityUsed: 1, unit: 'kg' },
      { material: 'm2', quantityUsed: 0.5, unit: 'kg' },
      { material: 'm4', quantityUsed: 1, unit: 'dozen' },
    ],
  },
  {
    // productionQuantity 0 means the cost per unit cannot be worked out
    _id: 'p2', name: 'Butter Cookies', stockQuantity: 0, productionQuantity: 0,
    labourCost: 300, otherCosts: 100, sellingPrice: 600, costPerUnit: null,
    recipe: [{ material: 'm3', quantityUsed: 0.5, unit: 'kg' }],
  },
];

export const logs = [
  { type: 'use', itemName: 'Flour', quantity: 2, unit: 'kg', note: 'Cake batch', createdAt: '2026-11-26T09:30:00.000Z' },
  { type: 'produce', itemName: 'Vanilla Cake', quantity: 8, unit: 'piece', note: '', createdAt: '2026-11-25T15:10:00.000Z' },
];