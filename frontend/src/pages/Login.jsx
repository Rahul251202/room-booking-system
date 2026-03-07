import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      const { user, token } = res.data.data;
      login(user, token);
      toast.success(`Welcome , ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT — Luxury Visual */}
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1400"
          alt="Taj Hotel"
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[8000ms]"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080c18] via-[#080c18]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c18]/80 via-transparent to-transparent" />

        {/* Logo */}
        <div className="absolute top-10 left-10">
          <div className="flex items-center gap-3">
            <span className="text-[#c9a96e] text-3xl">◈</span>
            <span className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#e8d5b7] tracking-widest">
              STAYLUX
            </span>
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <div className="mb-6">
            <div className="w-12 h-[1px] bg-[#c9a96e] mb-4" />
            <h2 className="font-['Cormorant_Garamond'] text-5xl font-light text-white leading-tight mb-3">
              Where Luxury<br />
              <span className="italic text-[#c9a96e]">Meets Comfort</span>
            </h2>
            <p className="text-white/50 text-sm tracking-widest uppercase">
              An experience beyond imagination
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-0 mt-8">
            {[
              { num: '127', label: 'Suites' },
              { num: '98%', label: 'Satisfaction' },
              { num: '50K+', label: 'Guests' },
            ].map((s, i) => (
              <div key={i} className="flex items-center">
                <div className="text-center px-6">
                  <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#c9a96e]">
                    {s.num}
                  </div>
                  <div className="text-white/40 text-xs tracking-widest uppercase mt-1">
                    {s.label}
                  </div>
                </div>
                {i < 2 && <div className="w-[1px] h-10 bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div
        className="flex items-center justify-center px-8 py-16 bg-[#080c18]"
        style={{ backgroundImage: 'radial-gradient(ellipse at 80% 20%, rgba(201,169,110,0.05) 0%, transparent 60%)' }}
      >
        <div className="w-full max-w-md animate-fade-up">

          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <span className="text-[#c9a96e] text-2xl">◈</span>
            <span className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#e8d5b7] tracking-widest">STAYLUX</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <span className="inline-block border border-[#c9a96e]/30 text-[#c9a96e] text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
              Member Access
            </span>
            <h1 className="font-['Cormorant_Garamond'] text-5xl font-light text-white mb-3">
              Welcome<br /><span className="italic text-[#c9a96e]">Back</span>
            </h1>
            <p className="text-white/40 text-sm">Sign in to continue your luxury journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email" name="email"
                  placeholder="your@email.com"
                  value={form.email} onChange={handleChange}
                  className={`w-full bg-white/[0.04] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-5 py-4 text-white placeholder-white/20 text-sm outline-none focus:border-[#c9a96e]/50 focus:bg-white/[0.06] transition-all duration-300`}
                />
              </div>
              {errors.email && <p className="text-red-400/80 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
                Password
              </label>
              <input
                type="password" name="password"
                placeholder="••••••••••"
                value={form.password} onChange={handleChange}
                className={`w-full bg-white/[0.04] border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-5 py-4 text-white placeholder-white/20 text-sm outline-none focus:border-[#c9a96e]/50 focus:bg-white/[0.06] transition-all duration-300`}
              />
              {errors.password && <p className="text-red-400/80 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full mt-2 py-4 rounded-lg font-semibold text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50 gold-gradient text-[#080c18] hover:shadow-[0_8px_30px_rgba(201,169,110,0.4)] hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-[#080c18]/30 border-t-[#080c18] rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-white/8" />
            <span className="text-white/25 text-xs tracking-widest">NEW TO STAYLUX?</span>
            <div className="flex-1 h-[1px] bg-white/8" />
          </div>

          <Link
            to="/register"
            className="block w-full py-4 text-center rounded-lg border border-white/10 text-white/60 text-sm tracking-widest uppercase hover:border-[#c9a96e]/40 hover:text-[#c9a96e] transition-all duration-300"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;