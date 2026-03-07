import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  // Use room image if available, otherwise fallback to Unsplash
  const roomImage = room.image_url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop";

  const handleReserve = () => {
    if (!room?.id) {
      console.error("Room ID is missing!");
      return;
    }
    // Navigate to room detail page (matches your App.jsx route)
    navigate(`/rooms/${room.id}`);
    window.scrollTo(0, 0); // optional: scroll to top
  };

  return (
    <div className="bg-[#1a1a2e] rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300">
      
      <div className="relative h-52">
        <img
          src={roomImage}
          alt={room.name || "Room"}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-[#c9a96e]/80 text-[#080c18] text-xs font-bold px-2 py-1 rounded">
          ${parseFloat(room.price_per_night || 0).toFixed(0)} / night
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-white text-lg font-semibold">{room.name || "Unnamed Room"}</h3>
        <p className="text-white/60 text-sm">Capacity: {room.capacity || 0} guests</p>
        <p className="text-white/60 text-sm">{room.description?.slice(0, 60) || "No description available"}...</p>
        <button
          onClick={handleReserve}
          className="w-full bg-[#c9a96e] hover:bg-[#b59657] text-[#080c18] font-bold py-2 rounded-lg transition-all duration-300"
        >
          Reserve
        </button>
      </div>

    </div>
  );
};

export default RoomCard;