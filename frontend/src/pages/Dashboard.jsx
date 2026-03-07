import { useState, useEffect } from 'react';
import { roomsAPI } from '../api/index.js';
import RoomCard from '../components/RoomCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomsAPI.getAll();
        setRooms(res.data.data.rooms);
      } catch {
        setError('Failed to load rooms.');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filtered = rooms.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchPrice =
      priceFilter === 'all' ? true :
      priceFilter === 'under200' ? r.price_per_night < 200 :
      priceFilter === '200to400' ? r.price_per_night >= 200 && r.price_per_night <= 400 :
      r.price_per_night > 400;
    return matchSearch && matchPrice;
  });

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-[#080c18]">

      {/* HERO */}
      <div className="relative h-[580px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800"
          alt="Luxury Hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080c18] via-[#080c18]/75 to-[#080c18]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-transparent to-transparent" />

        {/* Decorative lines */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#c9a96e]/20 to-transparent" style={{right: '20%'}} />

        <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-8">
          <div className="animate-fade-up max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#c9a96e]" />
              <span className="text-[#c9a96e] text-[10px] tracking-[0.3em] uppercase">
                {getGreeting()}, {user?.name}
              </span>
            </div>

            <h1 className="font-['Cormorant_Garamond'] text-6xl lg:text-7xl font-light text-white leading-tight mb-4">
              Discover<br />
              <span className="italic text-[#c9a96e]">Extraordinary</span><br />
              <span className="font-light">Stays</span>
            </h1>

            <p className="text-white/40 text-sm tracking-widest mb-10 max-w-md">
              Curated luxury experiences crafted for the most discerning travellers
            </p>

            {/* Search */}
            <div className="relative max-w-lg">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#c9a96e] text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search our collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full glass border border-white/10 rounded-full py-4 pl-12 pr-12 text-white placeholder-white/25 text-sm outline-none focus:border-[#c9a96e]/40 transition-all duration-300"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#c9a96e] text-xs transition-colors"
                >✕</button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex gap-0 glass border-t border-white/8 rounded-t-2xl overflow-hidden">
              {[
                { icon: '🏨', val: `${rooms.length}`, label: 'Suites Available' },
                { icon: '⭐', val: '5 Star', label: 'Rating' },
                { icon: '🛎', val: '24/7', label: 'Concierge Service' },
                { icon: '✈️', val: 'Free', label: 'Airport Transfer' },
              ].map((s, i) => (
                <div key={i} className={`flex-1 flex items-center gap-3 px-6 py-4 ${i < 3 ? 'border-r border-white/8' : ''}`}>
                  <span className="text-xl">{s.icon}</span>
                  <div>
                    <div className="text-[#c9a96e] font-['Cormorant_Garamond'] text-lg font-semibold">{s.val}</div>
                    <div className="text-white/30 text-[10px] tracking-widest uppercase">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ROOMS SECTION */}
      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* Section Header + Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-[1px] bg-[#c9a96e]" />
              <span className="text-[#c9a96e] text-[10px] tracking-[0.2em] uppercase">Our Collection</span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-4xl font-light text-white">
              {search ? `Results for "${search}"` : 'Featured Suites & Villas'}
            </h2>
          </div>

          {/* Price Filters */}
          <div className="flex gap-2 flex-wrap">
            {[
              { val: 'all', label: 'All' },
              { val: 'under200', label: 'Under $200' },
              { val: '200to400', label: '$200–$400' },
              { val: 'above400', label: '$400+' },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => setPriceFilter(f.val)}
                className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase border transition-all duration-300 ${
                  priceFilter === f.val
                    ? 'gold-gradient border-[#c9a96e] text-[#080c18] font-semibold'
                    : 'border-white/10 text-white/40 hover:border-[#c9a96e]/40 hover:text-[#c9a96e]'
                }`}
              >
                {f.label}
              </button>
            ))}
            {!loading && (
              <span className="px-5 py-2 rounded-full text-xs tracking-widest uppercase border border-white/5 text-white/20">
                {filtered.length} rooms
              </span>
            )}
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/5">
                <div className="h-56 shimmer" />
                <div className="p-6 bg-[#0d1628] space-y-3">
                  <div className="h-4 shimmer rounded w-3/4" />
                  <div className="h-3 shimmer rounded w-1/2" />
                  <div className="h-3 shimmer rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-['Cormorant_Garamond'] text-3xl text-white mb-3">Something went wrong</h3>
            <p className="text-white/30 mb-8 text-sm">{error}</p>
            <button onClick={() => window.location.reload()}
              className="px-8 py-3 gold-gradient text-[#080c18] rounded-full text-sm font-semibold tracking-widest uppercase hover:shadow-[0_8px_30px_rgba(201,169,110,0.4)] transition-all">
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-['Cormorant_Garamond'] text-3xl text-white mb-3">No rooms found</h3>
            <p className="text-white/30 text-sm mb-8">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setPriceFilter('all'); }}
              className="px-8 py-3 gold-gradient text-[#080c18] rounded-full text-sm font-semibold tracking-widest uppercase">
              Clear Filters
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;