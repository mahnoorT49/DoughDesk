import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Alert from '../components/Alert';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false); // true while waiting for the server

  async function handleSubmit(e) {
    e.preventDefault();            // stop the browser reloading the page
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);       // e.g. "Wrong email or password" from the server
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout tagline="Welcome back to the kitchen office." title="Log in">
      <Alert type="error">{error}</Alert>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <input id="email" name="email" type="email" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password <span className="required">*</span></label>
          <input id="password" name="password" type="password" required
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn-primary btn-full" disabled={busy}>
          {busy ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="auth-switch">
        New to DoughDesk? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}