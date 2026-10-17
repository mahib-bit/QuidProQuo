
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';

import { AuthContext } from '../context/AuthContext';
import { authenticatedFetch } from '../api/api';

const MyAgreements = () => {

    // ========================= Context & State =========================
    const { user, mongoUser } = useContext(AuthContext);

    const [agreements, setAgreements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [processingId, setProcessingId] = useState(null);
    const [actionError, setActionError] = useState('');

    // ========================= Fetch My Agreements =========================
    const fetchMyAgreements = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const response = await authenticatedFetch(
                user,
                '/agreements/my'
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to load agreements.'
                );
            }

            setAgreements(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchMyAgreements();
        } else {
            setLoading(false);
        }
    }, [user, fetchMyAgreements]);

    // ========================= Return Item =========================
    const handleReturnItem = async (agreementId) => {
        try {
            setProcessingId(agreementId);
            setActionError('');

            const response = await authenticatedFetch(
                user,
                `/agreements/${agreementId}/return`,
                {
                    method: 'PATCH',
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to return the item.'
                );
            }

            // Refresh the list after returning the item
            await fetchMyAgreements();
        } catch (error) {
            setActionError(error.message);
        } finally {
            setProcessingId(null);
        }
    };

    // ========================= Filter Agreements =========================
    const filteredAgreements = agreements.filter((agreement) => {
        return selectedStatus === 'all' ||
            agreement.status === selectedStatus;
    });

    // ========================= Loading State =========================
    if (loading) {
        return (
            <div className="p-8 text-center">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-3">Loading your agreements...</p>
            </div>
        );
    }

    // ========================= Error State =========================
    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <p className="text-error">{error}</p>

                <button
                    onClick={fetchMyAgreements}
                    className="btn btn-primary mt-4"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // ========================= My Agreements UI =========================
    return (
        <div className="max-w-6xl mx-auto p-6">

            {/* ========================= Page Header ========================= */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    My Agreements
                </h1>

                <p className="mt-2 text-base-content/70">
                    Manage your borrowing and lending agreements.
                </p>
            </div>

            {/* ========================= Filters ========================= */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <label htmlFor="agreementStatus" className="font-semibold">
                    Filter by status:
                </label>

                <select
                    id="agreementStatus"
                    className="select select-bordered"
                    value={selectedStatus}
                    onChange={(event) =>
                        setSelectedStatus(event.target.value)
                    }
                >
                    <option value="all">All Agreements</option>
                    <option value="borrowed">Borrowed</option>
                    <option value="overdue">Overdue</option>
                    <option value="returned">Returned</option>
                </select>

                <span className="text-sm text-base-content/70">
                    {filteredAgreements.length} agreement(s)
                </span>

                <button
                    onClick={fetchMyAgreements}
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
            {filteredAgreements.length === 0 ? (
                <div className="border border-base-300 rounded-xl p-12 text-center">
                    <h2 className="text-xl font-semibold">
                        {agreements.length === 0
                            ? 'No agreements yet'
                            : 'No agreements match this status'}
                    </h2>

                    <p className="mt-2 text-base-content/70">
                        Accepted borrowing requests will appear here.
                    </p>

                    <Link to="/items" className="btn btn-primary mt-5">
                        Browse Items
                    </Link>
                </div>
            ) : (

                /* ========================= Agreement Cards ========================= */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {filteredAgreements.map((agreement) => {

                        const isOwner =
                            String(agreement.owner?._id || agreement.owner) ===
                            String(mongoUser?._id);

                        const isProcessing =
                            processingId === agreement._id;

                        return (
                            <div
                                key={agreement._id}
                                className="card bg-base-100 border border-base-300 shadow-md"
                            >
                                <div className="card-body">

                                    {/* ========================= Item Information ========================= */}
                                    <h2 className="card-title">
                                        {agreement.item?.name || 'Item unavailable'}
                                    </h2>

                                    <p className="text-base-content/70">
                                        {agreement.item?.description ||
                                            'No description available.'}
                                    </p>

                                    {/* ========================= Agreement Information ========================= */}
                                    <div className="divider my-1"></div>

                                    <p>
                                        <strong>Agreement type:</strong>{' '}
                                        {agreement.agreementType}
                                    </p>

                                    <p>
                                        <strong>Owner:</strong>{' '}
                                        {agreement.owner?.name || 'Unknown'}
                                    </p>

                                    <p>
                                        <strong>Borrower:</strong>{' '}
                                        {agreement.borrower?.name || 'Unknown'}
                                    </p>

                                    <p>
                                        <strong>Start date:</strong>{' '}
                                        {agreement.startDate
                                            ? new Date(agreement.startDate)
                                                .toLocaleDateString()
                                            : 'Not specified'}
                                    </p>

                                    <p>
                                        <strong>Due date:</strong>{' '}
                                        {agreement.endDate
                                            ? new Date(agreement.endDate)
                                                .toLocaleDateString()
                                            : 'Not specified'}
                                    </p>

                                    <p>
                                        <strong>Status:</strong>{' '}
                                        <span
                                            className={`badge ${
                                                agreement.status === 'returned'
                                                    ? 'badge-success'
                                                    : agreement.status === 'overdue'
                                                        ? 'badge-error'
                                                        : 'badge-warning'
                                            }`}
                                        >
                                            {agreement.status}
                                        </span>
                                    </p>

                                    {/* ========================= Actions ========================= */}
                                    <div className="card-actions justify-between mt-4">

                                        {agreement.item?._id && (
                                            <Link
                                                to={`/items/${agreement.item._id}`}
                                                className="btn btn-outline"
                                            >
                                                View Item
                                            </Link>
                                        )}

                                        {isOwner &&
                                            agreement.status === 'borrowed' && (
                                                <p className="text-sm text-base-content/70">
                                                    Waiting for the borrower to return the item.
                                                </p>
                                            )}

                                        {!isOwner &&
                                            agreement.status === 'borrowed' && (
                                                <button
                                                    onClick={() =>
                                                        handleReturnItem(agreement._id)
                                                    }
                                                    disabled={isProcessing}
                                                    className="btn btn-primary"
                                                >
                                                    {isProcessing
                                                        ? 'Processing...'
                                                        : 'Mark as Returned'}
                                                </button>
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

export default MyAgreements;
