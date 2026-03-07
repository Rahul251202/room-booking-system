import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingsAPI } from "../api/index.js";
import BookingCard from "../components/BookingCard.jsx";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingsAPI.getMyBookings();
        setBookings(res.data.data.bookings);
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelled = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
    );
  };

  const filtered = bookings.filter((b) =>
    filter === "all" ? true : b.status === filter
  );

  return (
    <div className="min-h-screen bg-[#080c18] text-white">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#080c18] to-[#0f162e] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-['Cormorant_Garamond'] text-[#e8d5b7]">
            My Bookings
          </h1>
          <p className="text-white/50 mt-2">
            Manage all your reservations
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* FILTER TABS */}
        {!loading && !error && bookings.length > 0 && (
          <div className="flex gap-3 mb-8 flex-wrap">
            {["all", "confirmed", "cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm tracking-wide transition 
                ${
                  filter === f
                    ? "bg-[#c9a96e] text-black"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {" ("}
                {f === "all"
                  ? bookings.length
                  : bookings.filter((b) => b.status === f).length}
                {")"}
              </button>
            ))}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#c9a96e]/30 border-t-[#c9a96e] rounded-full animate-spin"></div>
            <p className="text-white/50 mt-4">Loading your bookings...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
            <div className="text-3xl mb-2">⚠</div>
            <h3 className="text-lg font-semibold">Unable to load bookings</h3>
            <p className="text-white/50">{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-white/50 mb-6">
              You haven't made any reservations yet.
            </p>

            <Link
              to="/dashboard"
              className="px-6 py-3 bg-[#c9a96e] text-black rounded-lg font-semibold hover:opacity-90"
            >
              Browse Rooms
            </Link>
          </div>
        )}

        {/* BOOKINGS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancelled={handleCancelled}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;