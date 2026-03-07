import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(8,12,24,0.92)', backdropFilter: 'blur(24px)' }}>
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <span className="text-[#c9a96e] text-2xl">◈</span>
          <span className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#e8d5b7] tracking-[0.15em]">
            STAYLUX
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard"
                className={`px-4 py-2 rounded-lg text-xs tracking-widest uppercase transition-all no-underline ${
                  isActive('/dashboard')
                    ? 'text-[#c9a96e]'
                    : 'text-white/35 hover:text-white/70'
                }`}>
                Rooms
              </Link>
              <Link to="/my-bookings"
                className={`px-4 py-2 rounded-lg text-xs tracking-widest uppercase transition-all no-underline ${
                  isActive('/my-bookings')
                    ? 'text-[#c9a96e]'
                    : 'text-white/35 hover:text-white/70'
                }`}>
                My Bookings
              </Link>

              {/* User */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/8">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/[0.03]">
                  <div className="w-6 h-6 rounded-full gold-gradient flex items-center justify-center text-[#080c18] text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-white/50 text-xs">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg border border-white/8 text-white/30 text-xs tracking-widest uppercase hover:border-[#c9a96e]/30 hover:text-[#c9a96e] transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"
                className="px-5 py-2 rounded-lg border border-white/10 text-white/40 text-xs tracking-widest uppercase hover:border-white/20 hover:text-white/70 transition-all no-underline">
                Sign In
              </Link>
              <Link to="/register"
                className="px-5 py-2 rounded-full gold-gradient text-[#080c18] text-xs font-semibold tracking-widest uppercase hover:shadow-[0_4px_20px_rgba(201,169,110,0.35)] transition-all no-underline">
                Join Us
              </Link>

              </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;