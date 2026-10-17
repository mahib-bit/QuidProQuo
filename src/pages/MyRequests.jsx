import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";

import { AuthContext } from "../context/AuthContext";
import { authenticatedFetch } from "../api/api";

const MyRequests = () => {
  // ========================= Context & State =========================
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // ========================= Fetch My Requests =========================
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await authenticatedFetch(user, "/requests/my");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load your requests.");
        }

        setRequests(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyRequests();
    }
  }, [user]);

  // ========================= Filter Requests =========================
  const filteredRequests = requests.filter((request) => {
    if (selectedStatus === "all") {
      return true;
    }

    return request.status === selectedStatus;
  });

  // ========================= Loading State =========================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="ml-3">Loading your requests...</p>
      </div>
    );
  }

  // ========================= Error State =========================
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-error">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ========================= My Requests UI =========================
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ========================= Page Header ========================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Requests</h1>

        <p className="mt-2 text-base-content/70">
          Track the status of your borrowing requests.
        </p>
      </div>

      {/* ========================= Status Filter ========================= */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <label htmlFor="statusFilter" className="font-semibold">
          Filter by status:
        </label>

        <select
          id="statusFilter"
          className="select select-bordered"
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        <span className="text-sm text-base-content/70">
          {filteredRequests.length} request(s)
        </span>
      </div>

      {/* ========================= Empty State ========================= */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-16 border border-base-300 rounded-xl">
          <h2 className="text-xl font-semibold">
            {requests.length === 0
              ? "You have no requests yet."
              : "No requests match this status."}
          </h2>

          <p className="mt-2 text-base-content/70">
            Explore available items and request something you need.
          </p>

          <Link to="/items" className="btn btn-primary mt-5">
            Browse Items
          </Link>
        </div>
      ) : (
        /* ========================= Requests List ========================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="card bg-base-100 border border-base-300 shadow-md"
            >
              <div className="card-body">
                {/* ========================= Item Information ========================= */}
                <h2 className="card-title">
                  {request.item?.name || "Item unavailable"}
                </h2>

                <p className="text-base-content/70">
                  {request.item?.description || "No description available."}
                </p>

                <div className="divider my-1"></div>

                {/* ========================= Request Information ========================= */}
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      request.status === "accepted"
                        ? "badge-success"
                        : request.status === "rejected"
                          ? "badge-error"
                          : "badge-warning"
                    }`}
                  >
                    {request.status}
                  </span>
                </p>

                <p>
                  <strong>Owner:</strong> {request.owner?.name || "Unknown"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {request.item?.location || "Not provided"}
                </p>

                {request.createdAt && (
                  <p>
                    <strong>Requested on:</strong>{" "}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                )}

                {/* ========================= Item Details Button ========================= */}
                {request.item?._id && (
                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/items/${request.item._id}`}
                      className="btn btn-outline btn-primary"
                    >
                      View Item
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
