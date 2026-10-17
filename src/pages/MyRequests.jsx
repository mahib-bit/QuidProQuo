import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { authenticatedFetch } from "../api/api";
import { Send, MapPin, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft } from "lucide-react";

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
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-blue-900/20 rounded-2xl shadow-sm text-blue-950 font-serif font-bold text-sm">
          <span className="animate-spin text-blue-900">❖</span>
          <span>Loading your requests...</span>
        </div>
      </div>
    );
  }

  // ========================= Error State =========================
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 font-sans">
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-blue-900 text-white font-serif font-bold text-xs rounded-xl mt-4 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ========================= My Requests UI =========================
  return (
    <div className="min-h-screen bg-slate-50/60 text-blue-950 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ========================= Page Header ========================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-blue-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-5 h-5 text-blue-900" />
              <h1 className="text-3xl font-serif font-bold text-blue-950">My Sent Requests</h1>
            </div>
            <p className="text-xs text-blue-700">
              Track the status of borrowing requests you submitted to neighbors.
            </p>
          </div>

          <Link to="/dashboard" className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* ========================= Status Filter ========================= */}
        <div className="bg-white border-2 border-blue-900/15 rounded-2xl p-4 shadow-xs flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <label htmlFor="statusFilter" className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Filter status:
            </label>

            <select
              id="statusFilter"
              className="px-3 py-1.5 text-xs border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white font-semibold text-blue-950"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <span className="text-xs font-serif font-bold px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-900">
            {filteredRequests.length} request(s)
          </span>
        </div>

        {/* ========================= Empty State ========================= */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-white border-4 border-double border-blue-900/20 rounded-3xl p-8 space-y-3">
            <h2 className="text-xl font-serif font-bold text-blue-950">
              {requests.length === 0
                ? "You have no requests yet."
                : "No requests match this status."}
            </h2>

            <p className="text-xs text-blue-700 max-w-sm mx-auto">
              Explore available catalog items and send borrowing requests to neighbors nearby.
            </p>

            <div className="pt-2">
              <Link to="/items" className="inline-block px-6 py-2.5 bg-blue-900 text-white font-serif font-bold text-xs rounded-xl shadow-md border border-blue-950">
                Browse Items
              </Link>
            </div>
          </div>
        ) : (
          /* ========================= Requests List ========================= */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white border-2 border-blue-900/20 hover:border-blue-900 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-blue-100 pb-3">
                    <div>
                      <h2 className="text-base font-serif font-bold text-blue-950">
                        {request.item?.name || "Item unavailable"}
                      </h2>
                      <p className="text-xs text-blue-900/80 line-clamp-1">
                        {request.item?.description || "No description available."}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full shrink-0 border capitalize flex items-center gap-1 ${
                        request.status === "accepted"
                          ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                          : request.status === "rejected"
                            ? "bg-red-50 text-red-900 border-red-300"
                            : "bg-amber-50 text-amber-900 border-amber-300"
                      }`}
                    >
                      {request.status === "accepted" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {request.status === "rejected" && <XCircle className="w-3 h-3 text-red-600" />}
                      {request.status === "pending" && <Clock className="w-3 h-3 text-amber-600" />}
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-1 sm:space-y-0">
                    <div>
                      <span className="text-blue-500 block text-[10px] uppercase font-bold">Owner</span>
                      <span className="font-semibold text-blue-900">{request.owner?.name || "Neighbor"}</span>
                    </div>

                    <div>
                      <span className="text-blue-500 block text-[10px] uppercase font-bold">Location</span>
                      <span className="font-semibold text-blue-900 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                        {request.item?.location || "Not provided"}
                      </span>
                    </div>
                  </div>

                  {request.createdAt && (
                    <p className="text-[11px] text-blue-700/80 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      Requested on: <strong className="text-blue-950">{new Date(request.createdAt).toLocaleDateString()}</strong>
                    </p>
                  )}
                </div>

                {request.item?._id && (
                  <div className="pt-2">
                    <Link
                      to={`/items/${request.item._id}`}
                      className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-900 text-blue-950 hover:text-white text-xs font-semibold rounded-xl border border-blue-200 hover:border-blue-900 transition-all text-center block"
                    >
                      View Item Details
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyRequests;