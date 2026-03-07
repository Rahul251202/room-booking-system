import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomsAPI, bookingsAPI } from "../api/index.js";
import { toast } from "react-toastify";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [booking, setBooking] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await roomsAPI.getById(id);
        setRoom(res.data.data.room);
      } catch {
        toast.error("Room not found");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const nights =
    startDate && endDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const totalPrice = room ? nights * room.price_per_night : 0;

  const handleCheckAvailability = async () => {
    if (!startDate || !endDate) {
      toast.error("Select dates first");
      return;
    }

    setChecking(true);

    try {
      const res = await roomsAPI.checkAvailability(id, startDate, endDate);
      setAvailability(res.data.data);
    } catch {
      toast.error("Failed to check availability");
    } finally {
      setChecking(false);
    }
  };

  const handleBook = async () => {
    setBooking(true);

    try {
      await bookingsAPI.create({
        room_id: parseInt(id),
        start_date: startDate,
        end_date: endDate,
      });

      toast.success("Booking Confirmed!");
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-800">
        Loading room...
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO IMAGE */}
      <div className="relative h-[420px] w-full">
        <img
          src={room.image_url}
          alt={room.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="text-white p-10 max-w-6xl mx-auto w-full">

            <button
              onClick={() => navigate("/dashboard")}
              className="mb-4 text-sm bg-white/20 px-3 py-1 rounded backdrop-blur hover:bg-white/30"
            >
              ← Back
            </button>

            <h1 className="text-4xl font-bold">{room.name}</h1>

            <div className="flex gap-6 mt-3 text-lg">
              <span>👥 {room.capacity} Guests</span>
              <span className="text-yellow-600 font-semibold">
                ${room.price_per_night} / night
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6 py-10">

        {/* ROOM INFO */}
        <div className="md:col-span-2 space-y-8">

          {/* About */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">About this room</h2>
            <p className="text-gray-800 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* AMENITIES */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {(room.amenities || []).map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-900">
                  <span className="text-green-700">✓</span>
                  {a}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BOOKING CARD */}
        <div className="bg-white shadow-xl rounded-xl p-6 h-fit sticky top-24">

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">
            ${room.price_per_night}
            <span className="text-sm text-gray-600"> / night</span>
          </h3>

          {/* DATE INPUTS */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-700">Check-in</label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setAvailability(null);
                }}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Check-out</label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setAvailability(null);
                }}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
          </div>

          {/* PRICE SUMMARY */}
          {nights > 0 && (
            <div className="mt-5 border-t pt-4 text-sm text-gray-800">
              <div className="flex justify-between">
                <span>
                  ${room.price_per_night} × {nights} nights
                </span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between font-semibold mt-2 text-lg">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          )}

          {/* AVAILABILITY MESSAGE */}
          {availability && (
            <div
              className={`mt-4 text-center text-sm p-2 rounded ${
                availability.available
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {availability.available
                ? "Room Available!"
                : "Room not available"}
            </div>
          )}

          {/* BUTTONS */}
          {!availability ? (
            <button
              onClick={handleCheckAvailability}
              disabled={checking}
              className="mt-5 w-full bg-gray-900 text-white py-2 rounded hover:bg-black"
            >
              {checking ? "Checking..." : "Check Availability"}
            </button>
          ) : availability.available ? (
            <button
              onClick={handleBook}
              disabled={booking}
              className="mt-5 w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600"
            >
              {booking ? "Booking..." : "Confirm Booking"}
            </button>
          ) : (
            <button
              onClick={() => setAvailability(null)}
              className="mt-5 w-full bg-gray-300 py-2 rounded"
            >
              Select Different Dates
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default RoomDetail;