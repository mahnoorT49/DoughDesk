// TEMPORARY copy of Khadija's utils/units.js (named units_temp.js so it never clashes) so costing can be tested alone.
// Khadija's real file replaces this one. Do not commit if hers is already in the repo.
// Units are exactly: g, kg, ml, litre, piece, dozen.

// Each unit belongs to a group and has a factor to the group's base unit.
const UNITS = {
  g:      { group: 'mass',   factor: 1 },
  kg:     { group: 'mass',   factor: 1000 },
  ml:     { group: 'volume', factor: 1 },
  litre:  { group: 'volume', factor: 1000 },
  piece:  { group: 'count',  factor: 1 },
  dozen:  { group: 'count',  factor: 12 },
};

// Returns a number, or null if the units are unknown or in different groups.
function convert(value, fromUnit, toUnit) {
  const from = UNITS[fromUnit];
  const to = UNITS[toUnit];
  if (!from || !to || from.group !== to.group) return null;
  if (typeof value !== 'number' || isNaN(value)) return null;
  return (value * from.factor) / to.factor;
}

module.exports = { convert };
