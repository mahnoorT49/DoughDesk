import { Link } from 'react-router-dom';
import { formatPKR } from '../utils/formatPKR';

const features = [
  { title: 'Track Ingredients & Costs', text: 'Keep every material, its unit and its price in one place.' },
  { title: 'Calculate Recipe Costs', text: 'Build a recipe and see the cost of the whole batch and of each unit.' },
  { title: 'Set Your Profit Margin', text: 'Enter a selling price and see the profit on every unit you sell.' },
  { title: 'Plan Your Inventory', text: 'Spot what is running low or out of stock before it stops a bake.' },
  { title: 'Save Recipes', text: "Store each product's recipe once and reuse it for every batch." },
  { title: 'Access Anywhere', text: 'Works in any browser, on a phone in the kitchen or on a computer.' },
];

const steps = [
  { title: 'Add Your Materials', text: 'Enter what you buy, with its unit, price and how much you have in stock.' },
  { title: 'Build Your Products', text: 'Pick the materials for each recipe, then add labour and other costs.' },
  { title: 'Record As You Bake', text: 'Log what you use and what you make, and your stock updates itself.' },
];

// Sample cost breakdown shown in the Costing section (static, not from the server)
const costLines = [
  { item: 'Flour', used: '1 kg', cost: 150 },
  { item: 'Sugar', used: '0.5 kg', cost: 90 },
  { item: 'Eggs', used: '1 dozen', cost: 400 },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Top bar */}
      <header className="landing-top">
        <div className="logo">DoughDesk</div>
        <nav className="landing-nav">
          <a href="#features" className="btn-secondary btn-small">Features</a>
          <a href="#how" className="btn-secondary btn-small">How it works</a>
          <a href="#costing" className="btn-secondary btn-small">Costing</a>
        </nav>
        <div className="landing-auth">
          <Link to="/login" className="btn-primary">Login</Link>
          <Link to="/register" className="btn-primary">Register</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="hero landing-section">
        <div className="landing-inner hero-inner">
          <div>
            <span className="hero-pill">Inventory and costing for bakeries</span>
            <h1>Know what’s in the pantry, know what every bake costs.</h1>
            <p>
              DoughDesk keeps your materials, products and stock in one place and works
              out the cost of every bake for you.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">Create your account</Link>
              <Link to="/login" className="btn-primary">I already have one</Link>
            </div>
          </div>

          {/* Mini dashboard preview (sample numbers) */}
          <div className="preview">
            <div className="preview-grid">
              <div className="card"><h3>Materials</h3>12</div>
              <div className="card"><h3>Products</h3>4</div>
              <div className="card"><h3>Low Stock</h3>2</div>
            </div>
            <div className="card"><h3>Out of Stock</h3>Butter</div>
            <div className="card">
              <h3>Low Stock</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Material</th><th>In Stock</th><th>Alert Below</th></tr></thead>
                  <tbody><tr><td>Sugar</td><td>3 kg</td><td>5 kg</td></tr></tbody>
                </table>
              </div>
            </div>
            <div className="card"><h3>Cost per unit</h3>{formatPKR(167.5)}</div>
            <p className="preview-caption">Sample data</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="landing-section">
        <div className="landing-inner">
          <h2 className="section-title">Features</h2>
          <p className="section-sub">Everything a baker’s back office needs</p>
          <div className="feature-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="how landing-section">
        <div className="landing-inner">
          <h2>How it Works</h2>
          <p className="section-sub" style={{ textAlign: 'left' }}>
            From flour sack to finished cake in three steps
          </p>
          <div className="step-grid">
            {steps.map((s, i) => (
              <div className="step-card" key={s.title}>
                <div className="step-number">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Costing example */}
      <section id="costing" className="landing-section">
        <div className="landing-inner costing-grid">
          <div>
            <h2>Costing</h2>
            <p className="section-sub" style={{ textAlign: 'left' }}>
              Finally see what each bake really costs
            </p>
            <p>
              Add the materials, labour and other costs once. DoughDesk shows the total
              cost of a batch and the cost of a single unit, so you can price with confidence.
            </p>
          </div>

          <div>
            <div className="card">
              <h3>Chocolate Cake</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Item</th><th>Used</th><th>Cost</th></tr></thead>
                  <tbody>
                    {costLines.map((l) => (
                      <tr key={l.item}><td>{l.item}</td><td>{l.used}</td><td>{formatPKR(l.cost)}</td></tr>
                    ))}
                    <tr className="total-row"><td colSpan="2">Material Cost</td><td>{formatPKR(640)}</td></tr>
                    <tr><td colSpan="2">Labour</td><td>{formatPKR(500)}</td></tr>
                    <tr><td colSpan="2">Other Costs</td><td>{formatPKR(200)}</td></tr>
                    <tr className="total-row"><td colSpan="2">Total Cost</td><td>{formatPKR(1340)}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card per-unit">
              <span>Total Cost per Unit (batch of 8)</span>
              <span>{formatPKR(167.5)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="logo">DoughDesk</div>
        <Link to="/help">Help</Link>
        <span>Team kimio · CS-344 Web Engineering</span>
      </footer>
    </div>
  );
}