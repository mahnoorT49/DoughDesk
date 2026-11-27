import { useEffect, useState } from 'react';
import { api } from '../api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import StatCard from '../components/StatCard';

// Log types are shown as friendlier words
const typeLabel = { use: 'Used', produce: 'Produced' };

export default function Dashboard() {
  const [data, setData] = useState(null);  // null until the server answers
  const [error, setError] = useState('');

  // Runs once when the page opens
  useEffect(() => {
    api('/dashboard')
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!data) return <Loading />;

  return (
    <div>
      <h1 className="page-title">At a glance</h1>

      <div className="stat-grid">
        <StatCard label="Materials" value={data.materialCount} />
        <StatCard label="Products" value={data.productCount} />
        <StatCard label="Low Stock" value={data.lowStock.length} />
        <StatCard label="Out of Stock" value={data.outOfStock.length} />
      </div>

      <div className="two-col">
        <div className="card">
          <h3>Low Stock</h3>
          {data.lowStock.length === 0 ? (
            <p className="empty-state">No materials are running low.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Material</th><th>In Stock</th><th>Alert Below</th></tr></thead>
                <tbody>
                  {data.lowStock.map((m) => (
                    <tr key={m.name}>
                      <td>{m.name}</td>
                      <td>{m.stockQuantity} {m.unit}</td>
                      <td>{m.lowStockLevel} {m.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Out of Stock</h3>
          {data.outOfStock.length === 0 ? (
            <p className="empty-state">Nothing is out of stock.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Material</th></tr></thead>
                <tbody>
                  {data.outOfStock.map((m) => (
                    <tr key={m.name}><td>{m.name}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Recent Activity</h3>
        {data.recentLogs.length === 0 ? (
          <p className="empty-state">No activity yet. Record material use or production to see it here.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Time</th><th>Type</th><th>Item</th><th>Amount</th></tr></thead>
              <tbody>
                {data.recentLogs.map((log, i) => (
                  <tr key={i}>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td><span className="pill">{typeLabel[log.type] || log.type}</span></td>
                    <td>{log.itemName}</td>
                    <td>{log.quantity} {log.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}