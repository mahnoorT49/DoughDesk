// 1250 becomes "PKR 1,250.00"; null becomes "Not available"
export function formatPKR(value) {
  if (value === null || value === undefined) return 'Not available';
  return 'PKR ' + Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}