import { Link } from 'react-router-dom';

// Brown panel on the left, form on the right. Used by Login and Register.
export default function AuthLayout({ tagline, title, children }) {
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="logo">DoughDesk</div>
        <h1 className="auth-tagline">{tagline}</h1>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <Link to="/" className="btn-secondary btn-small">Back to Home</Link>
          <h1 className="page-title" style={{ marginTop: 20 }}>{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}