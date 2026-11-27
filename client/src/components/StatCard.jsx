export default function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-number">{value}</div>
      <div>{label}</div>
    </div>
  );
}