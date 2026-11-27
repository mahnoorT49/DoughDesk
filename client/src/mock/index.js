import * as data from './data';

// In-memory copies so add/edit/delete work while testing
let materials = data.materials.map((m) => ({ ...m }));
let products = data.products.map((p) => ({ ...p }));

// Returns the first product whose recipe uses this material (or undefined)
function productUsing(materialId) {
  return products.find((p) => p.recipe.some((r) => r.material === materialId));
}

// The products list only needs a few fields
function listRow(p) {
  return {
    _id: p._id, name: p.name, stockQuantity: p.stockQuantity,
    productionQuantity: p.productionQuantity, sellingPrice: p.sellingPrice, costPerUnit: p.costPerUnit,
  };
}

// The detail page needs material name and unit, not just the id
function detail(p) {
  return {
    ...p,
    recipe: p.recipe.map((r) => {
      const m = materials.find((x) => x._id === r.material);
      return { ...r, material: { _id: r.material, name: m ? m.name : 'Unknown', unit: m ? m.unit : '' } };
    }),
  };
}

// Pretends to be the server. path example: '/materials/m1'
export function mockApi(path, method, body) {
  const parts = path.split('?')[0].split('/').filter(Boolean);
  const area = parts[0];
  const id = parts[1];

  if (area === 'auth') {
    if (id === 'me') return data.user;
    if (id === 'password') return { message: 'Password changed' };
    // Error case for testing: log in with password "wrong"
    if (id === 'login' && body && body.password === 'wrong') throw new Error('Wrong email or password');
    return { token: 'mock-token', user: data.user }; // login and register
  }

  if (area === 'materials') {
    if (method === 'GET') return id ? materials.find((m) => m._id === id) : [...materials];
    if (method === 'POST') {
      const m = { ...body, _id: 'm' + Date.now() };
      materials.push(m);
      return m;
    }
    if (method === 'PUT') {
      materials = materials.map((m) => (m._id === id ? { ...m, ...body } : m));
      return materials.find((m) => m._id === id);
    }
    if (method === 'DELETE') {
      const p = productUsing(id);
      if (p) throw new Error('Cannot delete: this material is used in the recipe of ' + p.name);
      materials = materials.filter((m) => m._id !== id);
      return { message: 'Material deleted' };
    }
  }

  if (area === 'products') {
    if (method === 'GET') return id ? detail(products.find((p) => p._id === id)) : products.map(listRow);
    if (method === 'POST') {
      const p = { ...body, _id: 'p' + Date.now(), costPerUnit: null };
      products.push(p);
      return p;
    }
    if (method === 'PUT') {
      products = products.map((p) => (p._id === id ? { ...p, ...body } : p));
      return products.find((p) => p._id === id);
    }
    if (method === 'DELETE') {
      products = products.filter((p) => p._id !== id);
      return { message: 'Product deleted' };
    }
  }

  if (area === 'dashboard') {
    return {
      materialCount: materials.length,
      productCount: products.length,
      lowStock: materials
        .filter((m) => m.stockQuantity > 0 && m.stockQuantity <= m.lowStockLevel)
        .map((m) => ({ name: m.name, unit: m.unit, stockQuantity: m.stockQuantity, lowStockLevel: m.lowStockLevel })),
      outOfStock: materials.filter((m) => m.stockQuantity === 0).map((m) => ({ name: m.name, unit: m.unit })),
      recentLogs: data.logs,
    };
  }

  // Inventory, costing, prices and settings get their mock data when we build those pages
  throw new Error('No mock data for ' + method + ' ' + path + ' yet');
}