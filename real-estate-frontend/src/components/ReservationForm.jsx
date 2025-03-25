import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import { reservationApi } from '../services/api';
import toast from 'react-hot-toast';

export default function ReservationForm({ propertyId, price }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days * price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to make a reservation');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    setIsSubmitting(true);
    try {
      await reservationApi.create({
        propertyId,
        startDate,
        endDate,
      });
      toast.success('Reservation submitted successfully!');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Make a Reservation</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="pl-10 input-field"
              required
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="pl-10 input-field"
              required
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {startDate && endDate && (
          <div className="py-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total ({calculateTotal() / price} nights)</span>
              <span className="font-semibold text-gray-900">${calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !startDate || !endDate}
          className="w-full btn btn-primary"
        >
          {isSubmitting ? 'Submitting...' : 'Reserve Now'}
        </button>
      </form>
    </motion.div>
  );
}

ReservationForm.propTypes = {
  propertyId: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
};