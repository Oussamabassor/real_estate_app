import React, { useState, useEffect } from "react";
import { reservationApi } from "../services/api";
import { motion } from "framer-motion";
import AdminModal from "./AdminModal";
import {
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch reservations from API
  const fetchReservations = async () => {
    try {
      setLoading(true);

      // Try to fetch real reservations from API
      try {
        const response = await reservationApi.getAllReservations();

        if (response && response.data && response.data.data) {
          setReservations(response.data.data);
        } else {
          // Fallback to mock data if API doesn't return expected format
          setReservations([
            {
              id: 1,
              property_id: 1,
              property_name: "Luxury Apartment",
              user_id: 2,
              user_name: "Jane Smith",
              check_in_date: "2023-05-15",
              check_out_date: "2023-05-20",
              status: "confirmed",
              total_price: 2500,
            },
            {
              id: 2,
              property_id: 3,
              property_name: "Cozy Studio",
              user_id: 3,
              user_name: "Mike Johnson",
              check_in_date: "2023-06-10",
              check_out_date: "2023-06-15",
              status: "pending",
              total_price: 1200,
            },
            {
              id: 3,
              property_id: 2,
              property_name: "Beachside Villa",
              user_id: 4,
              user_name: "Susan Lee",
              check_in_date: "2023-07-05",
              check_out_date: "2023-07-12",
              status: "rejected",
              total_price: 4500,
            },
          ]);
        }
      } catch (apiError) {
        console.error("API error, using mock data:", apiError);
        // Fallback to mock data
        setReservations([
          {
            id: 1,
            property_id: 1,
            property_name: "Luxury Apartment",
            user_id: 2,
            user_name: "Jane Smith",
            check_in_date: "2023-05-15",
            check_out_date: "2023-05-20",
            status: "confirmed",
            total_price: 2500,
          },
          {
            id: 2,
            property_id: 3,
            property_name: "Cozy Studio",
            user_id: 3,
            user_name: "Mike Johnson",
            check_in_date: "2023-06-10",
            check_out_date: "2023-06-15",
            status: "pending",
            total_price: 1200,
          },
          {
            id: 3,
            property_id: 2,
            property_name: "Beachside Villa",
            user_id: 4,
            user_name: "Susan Lee",
            check_in_date: "2023-07-05",
            check_out_date: "2023-07-12",
            status: "rejected",
            total_price: 4500,
          },
        ]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to load reservations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter reservations based on status and search term
  const filteredReservations = reservations
    .filter((res) =>
      statusFilter === "all" ? true : res.status === statusFilter
    )
    .filter((res) => {
      if (!searchTerm) return true;

      const searchTermLower = searchTerm.toLowerCase();
      return (
        (res.property_name || res.propertyName || "")
          .toLowerCase()
          .includes(searchTermLower) ||
        (res.user_name || res.userName || "")
          .toLowerCase()
          .includes(searchTermLower) ||
        res.id.toString().includes(searchTermLower)
      );
    });

  // Open view modal
  const openViewModal = (reservation) => {
    setCurrentReservation(reservation);
    setIsViewModalOpen(true);
  };

  // Close view modal
  const closeViewModal = () => {
    setIsViewModalOpen(false);
  };

  // Handle reservation approval
  const handleApprove = async (id) => {
    try {
      await reservationApi.approveReservation(id);

      // Update reservation status in the list
      setReservations(
        reservations.map((res) =>
          res.id === id ? { ...res, status: "confirmed" } : res
        )
      );

      setSuccessMessage("Reservation approved successfully!");

      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error approving reservation:", err);
      setError("Failed to approve reservation. Please try again.");
    }
  };

  // Handle reservation rejection
  const handleReject = async (id) => {
    try {
      await reservationApi.rejectReservation(id);

      // Update reservation status in the list
      setReservations(
        reservations.map((res) =>
          res.id === id ? { ...res, status: "rejected" } : res
        )
      );

      setSuccessMessage("Reservation rejected successfully!");

      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error rejecting reservation:", err);
      setError("Failed to reject reservation. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Success toast notification
  const SuccessToast = () => {
    if (!successMessage) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 flex items-center bg-green-50 border-l-4 border-green-500 py-2 px-3 shadow-md rounded-md z-50"
      >
        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
        <p className="text-green-800">{successMessage}</p>
      </motion.div>
    );
  };

  // Error toast notification
  const ErrorToast = () => {
    if (!error) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 flex items-center bg-red-50 border-l-4 border-red-500 py-2 px-3 shadow-md rounded-md z-50"
      >
        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-800">{error}</p>
      </motion.div>
    );
  };

  // Get status badge classes
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Render status icon
  const StatusIcon = ({ status }) => {
    switch (status) {
      case "confirmed":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "pending":
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case "rejected":
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <SuccessToast />
      <ErrorToast />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">
          Reservations Management
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {/* Search and filter bar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by guest name, property or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                statusFilter === "all"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                statusFilter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}
            >
              <ClockIcon className="w-4 h-4 inline-block mr-1" />
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("confirmed")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                statusFilter === "confirmed"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              <CheckCircleIcon className="w-4 h-4 inline-block mr-1" />
              Confirmed
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                statusFilter === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              <XCircleIcon className="w-4 h-4 inline-block mr-1" />
              Rejected
            </button>
          </div>
        </div>

        {/* Reservations table with container to ensure horizontal scrolling works properly */}
        <div className="w-full overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Property
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Guest
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Dates
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {searchTerm || statusFilter !== "all" ? (
                        <p>No reservations found matching your criteria.</p>
                      ) : (
                        <p>No reservations available.</p>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((reservation) => (
                    <motion.tr
                      key={reservation.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{reservation.id}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 max-w-[200px] truncate">
                        {reservation.property_name || reservation.propertyName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {reservation.user_name || reservation.userName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {formatDate(
                          reservation.check_in_date || reservation.startDate
                        )}
                        <span className="mx-1">-</span>
                        {formatDate(
                          reservation.check_out_date || reservation.endDate
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        $
                        {Number(
                          reservation.total_price || reservation.totalPrice
                        ).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${getStatusBadgeClasses(reservation.status)}`}
                        >
                          <StatusIcon status={reservation.status} />
                          <span className="ml-1 hidden sm:inline">
                            {reservation.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <button
                          onClick={() => openViewModal(reservation)}
                          className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </button>

                        {reservation.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(reservation.id)}
                              className="text-green-600 hover:text-green-900 mr-3 inline-flex items-center"
                            >
                              <CheckIcon className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(reservation.id)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center"
                            >
                              <XMarkIcon className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">Reject</span>
                            </button>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reservation statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Reservations
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {reservations.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-yellow-500">
            {reservations.filter((r) => r.status === "pending").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Confirmed</h3>
          <p className="text-2xl font-bold text-green-500">
            {reservations.filter((r) => r.status === "confirmed").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Revenue (Confirmed)
          </h3>
          <p className="text-2xl font-bold text-primary-600">
            $
            {reservations
              .filter((r) => r.status === "confirmed")
              .reduce(
                (sum, r) => sum + Number(r.total_price || r.totalPrice),
                0
              )
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Reservation View Modal */}
      <AdminModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        title="Reservation Details"
        size="md"
        footer={
          currentReservation?.status === "pending" && (
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  handleReject(currentReservation.id);
                  closeViewModal();
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  handleApprove(currentReservation.id);
                  closeViewModal();
                }}
                className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Approve
              </button>
            </div>
          )
        }
      >
        {currentReservation && (
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
              <div
                className={`p-3 rounded-full ${
                  currentReservation.status === "confirmed"
                    ? "bg-green-100"
                    : currentReservation.status === "pending"
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                <StatusIcon status={currentReservation.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Reservation ID
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  #{currentReservation.id}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${getStatusBadgeClasses(currentReservation.status)}`}
                  >
                    {currentReservation.status}
                  </span>
                </p>
              </div>

              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Property</h3>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {currentReservation.property_name ||
                    currentReservation.propertyName}
                </p>
              </div>

              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Guest</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {currentReservation.user_name || currentReservation.userName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Check-in Date
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(
                    currentReservation.check_in_date ||
                      currentReservation.startDate
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Check-out Date
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(
                    currentReservation.check_out_date ||
                      currentReservation.endDate
                  )}
                </p>
              </div>

              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  $
                  {Number(
                    currentReservation.total_price ||
                      currentReservation.totalPrice
                  ).toLocaleString()}
                </p>
              </div>

              {currentReservation.notes && (
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentReservation.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
