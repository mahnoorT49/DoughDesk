// TEMPORARY style test page. We delete this later.
export default function App() {
  return (
    <div className="main-content" style={{ marginLeft: 0 }}>
      <h1>DoughDesk style test</h1>

      <button className="btn-primary">Primary</button>{' '}
      <button className="btn-secondary">Secondary</button>

      <div className="alert alert-success" style={{ marginTop: 16 }}>Saved!</div>
      <div className="alert alert-error">Something went wrong</div>
      <div className="warning-box">A warning line</div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-number">12</div>Materials</div>
        <div className="stat-card"><div className="stat-number">4</div>Products</div>
      </div>

      <div className="card">
        <h2>Materials</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Unit</th><th>Price</th><th></th></tr></thead>
            <tbody>
              <tr><td>Flour</td><td><span className="pill">kg</span></td><td>PKR 150.00</td>
                <td><button className="btn-secondary btn-small">Edit</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="form-group">
          <label>Name <span className="required">*</span></label>
          <input type="text" />
          <div className="error-text">Name is required</div>
        </div>
      </div>
    </div>
  );
}