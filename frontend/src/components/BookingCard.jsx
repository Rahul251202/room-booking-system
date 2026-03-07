import { useState } from 'react';
import { bookingsAPI } from '../api/index.js';
import { toast } from 'react-toastify';

const BookingCard = ({ booking, onCancelled }) => {
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel?')) return;
    setCancelling(true);
    try {
      await bookingsAPI.cancel(booking.id);
      toast.success('Booking cancelled!');
      onCancelled(booking.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });

  const isFuture = new Date(booking.start_date) > new Date();

  return (
    <div className={`booking-card ${booking.status}`}>
      <div className="booking-card-image">
        <img
          src={booking.image_url}
          alt={booking.room_name}
          onError={(e) => {
            e.target.src = `https://placehold.co/300x200/1a1a2e/e8d5b7?text=${encodeURIComponent(booking.room_name)}`;
          }}
        />
      </div>
      <div className="booking-card-content">
        <div className="booking-card-header">
          <h3>{booking.room_name}</h3>
          <span className={`status-badge ${booking.status}`}>
            {booking.status}
          </span>
        </div>
        <div className="booking-dates">
          <div className="date-block">
            <span className="date-label">Check-in</span>
            <span className="date-value">{formatDate(booking.start_date)}</span>
          </div>
          <div className="date-arrow">→</div>
          <div className="date-block">
            <span className="date-label">Check-out</span>
            <span className="date-value">{formatDate(booking.end_date)}</span>
          </div>
        </div>
        <div className="booking-meta">
          <span className="booking-nights">{booking.nights} nights</span>
          <span className="booking-total">
            ${parseFloat(booking.total_price).toFixed(2)}
          </span>
        </div>
        {booking.status === 'confirmed' && isFuture && (
          <button
            className="btn btn-danger btn-sm"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;