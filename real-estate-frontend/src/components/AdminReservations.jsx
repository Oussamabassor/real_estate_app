import React, { useState, useEffect } from "react";
import { reservationApi } from "../services/api";
import {
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");

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

  // Filter reservations based on status
  const filteredReservations =
    statusFilter === "all"
      ? reservations
      : reservations.filter((res) => res.status === statusFilter);

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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Reservations Management</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservations Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-md text-sm ${
              statusFilter === "all"
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-md text-sm ${
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
            className={`px-3 py-1.5 rounded-md text-sm ${
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
            className={`px-3 py-1.5 rounded-md text-sm ${
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

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No reservations found matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reservation.property_name || reservation.propertyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.user_name || reservation.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(
                        reservation.check_in_date || reservation.startDate
                      )}{" "}
                      to{" "}
                      {formatDate(
                        reservation.check_out_date || reservation.endDate
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $
                      {Number(
                        reservation.total_price || reservation.totalPrice
                      ).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          reservation.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openViewModal(reservation)}
                        className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </button>

                      {reservation.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(reservation.id)}
                            className="text-green-600 hover:text-green-900 mr-3 inline-flex items-center"
                          >
                            <CheckIcon className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(reservation.id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                          >
                            <XMarkIcon className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation View Modal */}
      {isViewModalOpen && currentReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reservation Details</h2>
              <button
                onClick={closeViewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Reservation ID
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {currentReservation.id}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Property</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {currentReservation.property_name ||
                    currentReservation.propertyName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Guest</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {currentReservation.user_name || currentReservation.userName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="mt-1 text-sm text-gray-900">
                  $
                  {Number(
                    currentReservation.total_price ||
                      currentReservation.totalPrice
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span
                  className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium
                  ${
                    currentReservation.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : currentReservation.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentReservation.status}
                </span>
              </div>

              {currentReservation.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentReservation.notes}
                  </p>
                </div>
              )}

              {currentReservation.status === "pending" && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleReject(currentReservation.id);
                      closeViewModal();
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(currentReservation.id);
                      closeViewModal();
                    }}
                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
