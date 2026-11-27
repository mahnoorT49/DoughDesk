import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Alert from '../components/Alert';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [mismatch, setMismatch] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Confirm Password is checked here only; it is never sent to the server
    if (password !== confirm) {
      setMismatch(true);
      return;
    }
    setMismatch(false);

    setBusy(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);       // e.g. "Email already registered"
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout tagline="Welcome to the kitchen office." title="Registration">
      <Alert type="error">{error}</Alert>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Username <span className="required">*</span></label>
          <input id="name" name="name" type="text" required
            value={name} onChange={(e) => setName(e.target.value)} />
        </div>
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
        <div className="form-group">
          <label htmlFor="confirm">Confirm Password <span className="required">*</span></label>
          <input id="confirm" name="confirm" type="password" required
            value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {mismatch && <div className="error-text">Passwords do not match</div>}
        </div>
        <button className="btn-primary btn-full" disabled={busy}>
          {busy ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in to your account</Link>
      </p>
    </AuthLayout>
  );
}