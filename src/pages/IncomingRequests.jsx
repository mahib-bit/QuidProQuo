
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';

import { AuthContext } from '../context/AuthContext';
import { authenticatedFetch } from '../api/api';

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
        return selectedStatus === 'all' ||
            request.status === selectedStatus;
    });

    // ========================= Loading State =========================
    if (loading) {
        return (
            <div className="p-8 text-center">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-3">Loading incoming requests...</p>
            </div>
        );
    }

    // ========================= Error State =========================
    if (error) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <p className="text-error">{error}</p>

                <button
                    onClick={fetchIncomingRequests}
                    className="btn btn-primary mt-4"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // ========================= Incoming Requests UI =========================
    return (
        <div className="max-w-6xl mx-auto p-6">

            {/* ========================= Page Header ========================= */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Incoming Requests
                </h1>

                <p className="mt-2 text-base-content/70">
                    Manage requests from people who want to borrow your items.
                </p>
            </div>

            {/* ========================= Status Filter ========================= */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <label htmlFor="requestStatus" className="font-semibold">
                    Filter:
                </label>

                <select
                    id="requestStatus"
                    className="select select-bordered"
                    value={selectedStatus}
                    onChange={(event) =>
                        setSelectedStatus(event.target.value)
                    }
                >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="all">All Requests</option>
                </select>

                <span className="text-sm text-base-content/70">
                    {filteredRequests.length} request(s)
                </span>

                <button
                    onClick={fetchIncomingRequests}
                    className="btn btn-outline btn-sm"
                >
                    Refresh
                </button>
            </div>

            {/* ========================= Action Error ========================= */}
            {actionError && (
                <div role="alert" className="alert alert-error mb-6">
                    <span>{actionError}</span>
                </div>
            )}

            {/* ========================= Empty State ========================= */}
            {filteredRequests.length === 0 ? (
                <div className="border border-base-300 rounded-xl p-12 text-center">
                    <h2 className="text-xl font-semibold">
                        {requests.length === 0
                            ? 'No incoming requests yet'
                            : 'No requests with this status'}
                    </h2>

                    <p className="mt-2 text-base-content/70">
                        Requests for your items will appear here.
                    </p>
                </div>
            ) : (

                /* ========================= Requests List ========================= */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {filteredRequests.map((request) => {

                        const isProcessing =
                            processingId === request._id;

                        return (
                            <div
                                key={request._id}
                                className="card bg-base-100 border border-base-300 shadow-md"
                            >
                                <div className="card-body">

                                    {/* ========================= Item Information ========================= */}
                                    <h2 className="card-title">
                                        {request.item?.name || 'Item unavailable'}
                                    </h2>

                                    <p className="text-base-content/70">
                                        {request.item?.description ||
                                            'No description available.'}
                                    </p>

                                    {/* ========================= Requester Information ========================= */}
                                    <div className="divider my-1"></div>

                                    <p>
                                        <strong>Requested by:</strong>{' '}
                                        {request.requester?.name || 'Unknown'}
                                    </p>

                                    <p>
                                        <strong>Email:</strong>{' '}
                                        {request.requester?.email || 'Not available'}
                                    </p>

                                    <p>
                                        <strong>Status:</strong>{' '}
                                        <span className="badge badge-outline">
                                            {request.status}
                                        </span>
                                    </p>

                                    {request.createdAt && (
                                        <p>
                                            <strong>Requested on:</strong>{' '}
                                            {new Date(
                                                request.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    )}

                                    {/* ========================= Actions ========================= */}
                                    <div className="card-actions justify-between mt-4">

                                        {request.item?._id && (
                                            <Link
                                                to={`/items/${request.item._id}`}
                                                className="btn btn-outline"
                                            >
                                                View Item
                                            </Link>
                                        )}

                                        {request.status === 'pending' && (
                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleRequestAction(
                                                            request._id,
                                                            'reject'
                                                        )
                                                    }
                                                    disabled={isProcessing}
                                                    className="btn btn-error btn-outline"
                                                >
                                                    {isProcessing
                                                        ? 'Processing...'
                                                        : 'Reject'}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleRequestAction(
                                                            request._id,
                                                            'accept'
                                                        )
                                                    }
                                                    disabled={isProcessing}
                                                    className="btn btn-success"
                                                >
                                                    {isProcessing
                                                        ? 'Processing...'
                                                        : 'Accept'}
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                </div>
                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
};

export default IncomingRequests;
