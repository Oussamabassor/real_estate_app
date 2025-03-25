import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { reservationApi } from '../services/api';
import {
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const getStatusIcon = (status) => {
  switch (status) {
    case 'confirmed':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    case 'pending':
      return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    case 'cancelled':
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'cancelled':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export default function ReservationList() {
  const { data: reservations, isLoading, isError } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationApi.getAll(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
        <XCircleIcon className="w-12 h-12 mb-2" />
        <p>Failed to load reservations</p>
      </div>
    );
  }

  if (!reservations?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
        <CalendarIcon className="w-12 h-12 mb-2" />
        <p>No reservations found</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {reservations.data.map((reservation, index) => (
          <motion.div
            key={reservation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900">{reservation.property.title}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span>{reservation.property.location}</span>
                </div>
              </div>
              <div className={`px-3 py-1 text-sm font-medium rounded-lg border ${getStatusColor(reservation.status)}`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(reservation.status)}
                  <span className="capitalize">{reservation.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex items-center text-sm">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Check-in</p>
                  <p className="font-medium">{new Date(reservation.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Check-out</p>
                  <p className="font-medium">{new Date(reservation.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm col-span-2 sm:col-span-1">
                <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-medium">${reservation.total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {reservation.status === 'pending' && (
              <div className="mt-4 flex justify-end space-x-2">
                <button className="btn btn-danger">Cancel</button>
                <button className="btn btn-primary">Pay Now</button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}