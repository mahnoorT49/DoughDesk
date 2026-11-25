// Pure costing function: data in, numbers out. No database, no Express.
// Used by routes/costing.js (Mahnoor) and the products list (Khadija).
const { convert } = require('./units_temp');

// Round money to 2 decimal places.
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// A number from a possibly missing/invalid value (defaults to 0).
const num = (v) => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

// A recipe line's material may be an id or a populated object ({ _id, ... }).
const materialId = (m) => String(m && m._id ? m._id : m);

function calculateProductCost(product, materials) {
  const lines = [];
  const warnings = [];
  let materialCost = 0;

  const recipe = (product && product.recipe) || [];
  const allMaterials = materials || [];

  for (const item of recipe) {
    const material = allMaterials.find((m) => String(m._id) === materialId(item.material));

    // Material was deleted (or belongs to someone else): skip with a warning.
    if (!material) {
      warnings.push('A material in this recipe no longer exists, so it was left out of the cost');
      continue;
    }

    // Cost per unit of material = price / purchaseQuantity
    const purchaseQuantity = num(material.purchaseQuantity);
    if (purchaseQuantity <= 0) {
      warnings.push(`${material.name}: purchase quantity is missing, so it was left out of the cost`);
      continue;
    }
    const costPerMaterialUnit = num(material.price) / purchaseQuantity;

    // Convert the recipe quantity into the material's own unit.
    const converted = convert(num(item.quantityUsed), item.unit, material.unit);
    if (converted === null) {
      warnings.push(
        `${material.name}: ${item.unit} cannot be converted to ${material.unit}, so it was left out of the cost`
      );
      continue;
    }

    const lineCost = converted * costPerMaterialUnit;
    materialCost += lineCost;
    lines.push({
      materialName: material.name,
      quantityUsed: num(item.quantityUsed),
      unit: item.unit,
      cost: round2(lineCost),
    });
  }

  const labourCost = num(product && product.labourCost);
  const otherCosts = num(product && product.otherCosts);
  const sellingPrice = num(product && product.sellingPrice);
  const productionQuantity = num(product && product.productionQuantity);

  const totalCost = materialCost + labourCost + otherCosts;

  // Never divide by zero.
  const costPerUnit = productionQuantity > 0 ? totalCost / productionQuantity : null;

  // Profit only when there is a selling price and a cost per unit.
  const profitPerUnit =
    sellingPrice > 0 && costPerUnit !== null ? sellingPrice - costPerUnit : null;

  return {
    lines,
    warnings,
    materialCost: round2(materialCost),
    labourCost: round2(labourCost),
    otherCosts: round2(otherCosts),
    totalCost: round2(totalCost),
    costPerUnit: costPerUnit === null ? null : round2(costPerUnit),
    sellingPrice: round2(sellingPrice),
    profitPerUnit: profitPerUnit === null ? null : round2(profitPerUnit),
  };
}

module.exports = { calculateProductCost };
