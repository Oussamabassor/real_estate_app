import React, { useState, useEffect } from "react";
import { userApi } from "../services/api";
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Try to fetch real users from API
      try {
        const response = await userApi.getAllUsers();
        if (response && response.data && response.data.data) {
          setUsers(response.data.data);
        } else {
          // Fallback to mock data if API doesn't return expected format
          setUsers([
            {
              id: 1,
              name: "Admin User",
              email: "admin@example.com",
              role: "admin",
              created_at: "2023-01-01",
            },
            {
              id: 2,
              name: "Regular User",
              email: "user@example.com",
              role: "user",
              created_at: "2023-01-02",
            },
          ]);
        }
      } catch (apiError) {
        console.error("API error, using mock data:", apiError);
        // Fallback to mock data
        setUsers([
          {
            id: 1,
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            created_at: "2023-01-01",
          },
          {
            id: 2,
            name: "Regular User",
            email: "user@example.com",
            role: "user",
            created_at: "2023-01-02",
          },
        ]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!isValidEmail(formData.email))
      errors.email = "Please enter a valid email";

    // Password is required only for new users
    if (modalMode === "create" && !formData.password.trim())
      errors.password = "Password is required";
    if (modalMode === "create" && formData.password.trim().length < 6)
      errors.password = "Password must be at least 6 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Email validation helper
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Open modal for creating new user
  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing user
  const openEditModal = (user) => {
    setModalMode("edit");
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't include password when editing
      role: user.role,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSuccessMessage("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      if (modalMode === "create") {
        // Create new user
        await userApi.createUser(formData);
        setSuccessMessage("User created successfully!");
      } else {
        // Update existing user
        const dataToUpdate = {
          name: formData.name,
          role: formData.role,
        };
        // Only include password if it was changed
        if (formData.password.trim()) {
          dataToUpdate.password = formData.password;
        }
        await userApi.updateUser(currentUser.id, dataToUpdate);
        setSuccessMessage("User updated successfully!");
      }

      // Refresh user list
      fetchUsers();

      // Close modal after a short delay
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      console.error("Error saving user:", err);
      setFormErrors({
        submit:
          err.response?.data?.message ||
          "Failed to save user. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await userApi.deleteUser(userId);
      // Remove user from the list
      setUsers(users.filter((user) => user.id !== userId));
      setSuccessMessage("User deleted successfully!");

      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      await userApi.updateUserRole(userId, newRole);
      // Update user in the list
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Users Management</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Add New User
        </button>
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 inline-flex items-center"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalMode === "create" ? "Create New User" : "Edit User"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {successMessage && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                <p>{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={modalMode === "edit"} // Can't change email when editing
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {modalMode === "create"
                    ? "Password"
                    : "New Password (leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 ${
                    formErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formErrors.submit && (
                <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                  <p>{formErrors.submit}</p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : modalMode === "create" ? (
                    "Create User"
                  ) : (
                    "Update User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
