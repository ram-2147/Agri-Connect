import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    phone: '',
    address: '',
    farmName: '',
    location: '',
    crops: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = { ...form };
      if (form.role === 'farmer') {
        payload.crops = form.crops
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);
      }
      const u = await register(payload);
      if (u.role === 'farmer') navigate('/farmer');
      else navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="panel">
        <h1 className="font-display text-3xl text-leaf-900">Join AgriConnect</h1>
        <p className="mt-1 text-soil-700">Buy fresh produce or sell your harvest</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="label">I am a</label>
            <select className="input" value={form.role} onChange={set('role')}>
              <option value="buyer">Buyer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>
          <div>
            <label className="label">Full name</label>
            <input className="input" required value={form.name} onChange={set('name')} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={set('password')}
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="label">Address</label>
            <input className="input" value={form.address} onChange={set('address')} />
          </div>
          {form.role === 'farmer' && (
            <>
              <div>
                <label className="label">Farm name</label>
                <input className="input" value={form.farmName} onChange={set('farmName')} />
              </div>
              <div>
                <label className="label">Farm location</label>
                <input className="input" value={form.location} onChange={set('location')} />
              </div>
              <div>
                <label className="label">Crops (comma separated)</label>
                <input
                  className="input"
                  placeholder="Tomato, Onion, Wheat"
                  value={form.crops}
                  onChange={set('crops')}
                />
              </div>
              <p className="text-xs text-amber-field">
                Farmer accounts need admin approval before listing products.
              </p>
            </>
          )}
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-sm text-soil-700">
          Already registered? <Link className="font-semibold text-leaf-700" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
