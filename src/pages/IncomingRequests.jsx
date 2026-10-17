import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { authenticatedFetch } from '../api/api';
import { Inbox, CheckCircle2, XCircle, Clock, AlertCircle, ArrowLeft, RefreshCw, Mail, User as UserIcon } from 'lucide-react';

const IncomingRequests = () => {
  // ========================= Context & State =========================
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [processingId, setProcessingId] = useState(null);
  const [actionError, setActionError] = useState('');

  // ========================= Fetch Incoming Requests =========================
  const fetchIncomingRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await authenticatedFetch(
        user,
        '/requests/incoming'
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load incoming requests.'
        );
      }

      setRequests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchIncomingRequests();
    } else {
      setLoading(false);
    }
  }, [user, fetchIncomingRequests]);

  // ========================= Accept / Reject Request =========================
  const handleRequestAction = async (requestId, action) => {
    try {
      setProcessingId(requestId);
      setActionError('');

      const response = await authenticatedFetch(
        user,
        `/requests/${requestId}/${action}`,
        {
          method: 'PATCH',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to ${action} request.`
        );
      }

      // Refresh the list after the action succeeds
      await fetchIncomingRequests();

    } catch (error) {
      setActionError(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  // ========================= Filter Requests =========================
  const filteredRequests = requests.filter((request) => {
    return selectedStatus === 'all' || request.status === selectedStatus;
  });

  // ========================= Loading State =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-blue-900/20 rounded-2xl shadow-sm text-blue-950 font-serif font-bold text-sm">
          <span className="animate-spin text-blue-900">❖</span>
          <span>Loading incoming requests...</span>
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
          onClick={fetchIncomingRequests}
          className="px-5 py-2.5 bg-blue-900 text-white font-serif font-bold text-xs rounded-xl mt-4 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ========================= Incoming Requests UI =========================
  return (
    <div className="min-h-screen bg-slate-50/60 text-blue-950 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ========================= Page Header ========================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-blue-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Inbox className="w-5 h-5 text-blue-900" />
              <h1 className="text-3xl font-serif font-bold text-blue-950">Incoming Requests</h1>
            </div>
            <p className="text-xs text-blue-700">
              Manage requests from neighbors who want to borrow your items.
            </p>
          </div>

          <Link to="/dashboard" className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* ========================= Filter & Action Controls ========================= */}
        <div className="bg-white border-2 border-blue-900/15 rounded-2xl p-4 shadow-xs flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <label htmlFor="requestStatus" className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Filter Status:
            </label>

            <select
              id="requestStatus"
              className="px-3 py-1.5 text-xs border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white font-semibold text-blue-950"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="all">All Requests</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-serif font-bold px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-900">
              {filteredRequests.length} request(s)
            </span>

            <button
              onClick={fetchIncomingRequests}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-950 text-xs font-semibold rounded-xl border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-800" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ========================= Action Error Notification ========================= */}
        {actionError && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* ========================= Empty State ========================= */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-white border-4 border-double border-blue-900/20 rounded-3xl p-8 space-y-2">
            <h2 className="text-xl font-serif font-bold text-blue-950">
              {requests.length === 0
                ? 'No incoming requests yet'
                : 'No requests with this status'}
            </h2>

            <p className="text-xs text-blue-700 max-w-sm mx-auto">
              Requests submitted by neighbors for your items will appear here.
            </p>
          </div>
        ) : (
          /* ========================= Requests List ========================= */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRequests.map((request) => {
              const isProcessing = processingId === request._id;

              return (
                <div
                  key={request._id}
                  className="bg-white border-2 border-blue-900/20 hover:border-blue-900 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-blue-100 pb-3">
                      <div>
                        <h2 className="text-base font-serif font-bold text-blue-950">
                          {request.item?.name || 'Item unavailable'}
                        </h2>
                        <p className="text-xs text-blue-900/80 line-clamp-1">
                          {request.item?.description || 'No description available.'}
                        </p>
                      </div>

                      <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-blue-50 text-blue-900 border border-blue-200 capitalize">
                        {request.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-1 sm:space-y-0">
                      <div>
                        <span className="text-blue-500 block text-[10px] uppercase font-bold flex items-center gap-1">
                          <UserIcon className="w-3 h-3" /> Borrower
                        </span>
                        <span className="font-semibold text-blue-900 truncate block">
                          {request.requester?.name || 'Unknown'}
                        </span>
                      </div>

                      <div>
                        <span className="text-blue-500 block text-[10px] uppercase font-bold flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email
                        </span>
                        <span className="font-semibold text-blue-900 truncate block">
                          {request.requester?.email || 'Not available'}
                        </span>
                      </div>
                    </div>

                    {request.createdAt && (
                      <p className="text-[11px] text-blue-700/80">
                        Requested on: <strong className="text-blue-950">{new Date(request.createdAt).toLocaleDateString()}</strong>
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-blue-100 flex items-center justify-between gap-2">
                    {request.item?._id && (
                      <Link
                        to={`/items/${request.item._id}`}
                        className="py-2 px-3 bg-blue-50 hover:bg-blue-900 text-blue-950 hover:text-white text-xs font-semibold rounded-xl border border-blue-200 transition-all cursor-pointer"
                      >
                        View Item
                      </Link>
                    )}

                    {request.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRequestAction(request._id, 'reject')}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white text-xs font-semibold rounded-xl border border-red-200 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isProcessing ? 'Processing...' : 'Reject'}
                        </button>

                        <button
                          onClick={() => handleRequestAction(request._id, 'accept')}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl border border-blue-950 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isProcessing ? 'Processing...' : 'Accept'}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default IncomingRequests;