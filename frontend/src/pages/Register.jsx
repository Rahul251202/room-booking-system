import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/index.js';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password required';
    if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password
      });

      // Success message
      toast.success("Account created successfully. Please sign in.");

      // Navigate to login page
      navigate('/login');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const inputClass = (field) =>
    `w-full bg-white/[0.04] border ${errors[field] ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-5 py-4 text-white placeholder-white/20 text-sm outline-none focus:border-[#c9a96e]/50 focus:bg-white/[0.06] transition-all duration-300`;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT — Form */}
      <div
        className="flex items-center justify-center px-8 py-16 bg-[#080c18]"
        style={{ backgroundImage: 'radial-gradient(ellipse at 20% 80%, rgba(201,169,110,0.05) 0%, transparent 60%)' }}
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
              Join The Elite
            </span>
            <h1 className="font-['Cormorant_Garamond'] text-5xl font-light text-white mb-3">
              Begin Your<br />
              <span className="italic text-[#c9a96e]">Journey</span>
            </h1>
            <p className="text-white/40 text-sm">Create your account and experience luxury</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass('name')}
                />
                {errors.name && <p className="text-red-400/80 text-xs mt-1.5">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass('email')}
                />
                {errors.email && <p className="text-red-400/80 text-xs mt-1.5">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min 6 chars"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass('password')}
                />
                {errors.password && <p className="text-red-400/80 text-xs mt-1.5">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Confirm</label>
                <input
                  type="password"
                  name="confirm"
                  placeholder="Repeat"
                  value={form.confirm}
                  onChange={handleChange}
                  className={inputClass('confirm')}
                />
                {errors.confirm && <p className="text-red-400/80 text-xs mt-1.5">{errors.confirm}</p>}
              </div>
            </div>

            {/* Perks */}
            <div className="flex gap-4 flex-wrap py-2">
              {['Free Cancellation', 'Best Price', '24/7 Concierge'].map((p) => (
                <span key={p} className="flex items-center gap-1.5 text-[#4caf82] text-xs">
                  <span className="text-[#4caf82]">✓</span> {p}
                </span>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg font-semibold text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50 gold-gradient text-[#080c18] hover:shadow-[0_8px_30px_rgba(201,169,110,0.4)] hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-[#080c18]/30 border-t-[#080c18] rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          {/* Switch */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-white/8" />
            <span className="text-white/25 text-xs tracking-widest">HAVE AN ACCOUNT?</span>
            <div className="flex-1 h-[1px] bg-white/8" />
          </div>

          <Link
            to="/login"
            className="block w-full py-4 text-center rounded-lg border border-white/10 text-white/60 text-sm tracking-widest uppercase hover:border-[#c9a96e]/40 hover:text-[#c9a96e] transition-all duration-300"
          >
            Sign In Instead
          </Link>
        </div>
      </div>

      {/* RIGHT — Visual */}
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1400"
          alt="Luxury Suite"
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[8000ms]"
        />

        <div className="absolute inset-0 bg-gradient-to-l from-[#080c18] via-[#080c18]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c18]/80 via-transparent to-transparent" />
      </div>
    </div>
  );
};

export default Register;