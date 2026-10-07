import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'farmer') navigate('/farmer');
    else navigate('/shop');
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const u = await login(form.email, form.password);
      if (u.role === 'admin') navigate('/admin');
      else if (u.role === 'farmer') navigate('/farmer');
      else navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="panel">
        <h1 className="font-display text-3xl text-leaf-900">Welcome back</h1>
        <p className="mt-1 text-soil-700">Sign in to AgriConnect</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-soil-700">
          New here? <Link className="font-semibold text-leaf-700" to="/register">Create account</Link>
        </p>
        <div className="mt-4 rounded-lg bg-leaf-100/60 p-3 text-xs text-soil-800">
          Demo: buyer@agriconnect.com / Buyer@123
        </div>
      </div>
    </div>
  );
}
