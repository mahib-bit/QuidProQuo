import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { authenticatedFetch } from '../api/api';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowLeft, 
  RefreshCw, 
  User as UserIcon, 
  Calendar, 
  RotateCcw,
  Tag
} from 'lucide-react';

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
    return selectedStatus === 'all' || agreement.status === selectedStatus;
  });

  // ========================= Loading State =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-blue-900/20 rounded-2xl shadow-sm text-blue-950 font-serif font-bold text-sm">
          <span className="animate-spin text-blue-900">❖</span>
          <span>Loading your agreements...</span>
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
          onClick={fetchMyAgreements}
          className="px-5 py-2.5 bg-blue-900 text-white font-serif font-bold text-xs rounded-xl mt-4 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ========================= My Agreements UI =========================
  return (
    <div className="min-h-screen bg-slate-50/60 text-blue-950 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ========================= Page Header ========================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-blue-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-blue-900" />
              <h1 className="text-3xl font-serif font-bold text-blue-950">My Agreements</h1>
            </div>
            <p className="text-xs text-blue-700">
              Manage active and past borrowing contracts between you and other members.
            </p>
          </div>

          <Link to="/dashboard" className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* ========================= Filter & Actions Controls ========================= */}
        <div className="bg-white border-2 border-blue-900/15 rounded-2xl p-4 shadow-xs flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <label htmlFor="agreementStatus" className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Filter status:
            </label>

            <select
              id="agreementStatus"
              className="px-3 py-1.5 text-xs border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white font-semibold text-blue-950"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="all">All Agreements</option>
              <option value="borrowed">Borrowed</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-serif font-bold px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-900">
              {filteredAgreements.length} agreement(s)
            </span>

            <button
              onClick={fetchMyAgreements}
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
        {filteredAgreements.length === 0 ? (
          <div className="text-center py-16 bg-white border-4 border-double border-blue-900/20 rounded-3xl p-8 space-y-3">
            <h2 className="text-xl font-serif font-bold text-blue-950">
              {agreements.length === 0
                ? 'No agreements yet'
                : 'No agreements match this status'}
            </h2>

            <p className="text-xs text-blue-700 max-w-sm mx-auto">
              Confirmed requests generate an official agreement visible here.
            </p>

            <div className="pt-2">
              <Link to="/items" className="inline-block px-6 py-2.5 bg-blue-900 text-white font-serif font-bold text-xs rounded-xl shadow-md border border-blue-950">
                Browse Items
              </Link>
            </div>
          </div>
        ) : (
          /* ========================= Agreement Cards ========================= */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAgreements.map((agreement) => {
              const isOwner =
                String(agreement.owner?._id || agreement.owner) ===
                String(mongoUser?._id);

              const isProcessing = processingId === agreement._id;

              return (
                <div
                  key={agreement._id}
                  className="bg-white border-2 border-blue-900/20 hover:border-blue-900 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-blue-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1 capitalize">
                          {agreement.agreementType || 'Lending'}
                        </span>
                        <h2 className="text-base font-serif font-bold text-blue-950">
                          {agreement.item?.name || 'Item unavailable'}
                        </h2>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full shrink-0 border capitalize flex items-center gap-1 ${
                          agreement.status === 'returned'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : agreement.status === 'overdue'
                              ? 'bg-red-50 text-red-900 border-red-300'
                              : 'bg-amber-50 text-amber-900 border-amber-300'
                        }`}
                      >
                        {agreement.status === 'returned' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {agreement.status === 'overdue' && <AlertCircle className="w-3 h-3 text-red-600" />}
                        {agreement.status === 'borrowed' && <Clock className="w-3 h-3 text-amber-600" />}
                        {agreement.status}
                      </span>
                    </div>

                    <p className="text-xs text-blue-900/80 line-clamp-1">
                      {agreement.item?.description || 'No description available.'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-1 sm:space-y-0">
                      <div>
                        <span className="text-blue-500 block text-[10px] uppercase font-bold flex items-center gap-1">
                          <UserIcon className="w-3 h-3" /> Owner
                        </span>
                        <span className="font-semibold text-blue-900 truncate block">
                          {agreement.owner?.name || 'Unknown'} {isOwner && '(You)'}
                        </span>
                      </div>

                      <div>
                        <span className="text-blue-500 block text-[10px] uppercase font-bold flex items-center gap-1">
                          <UserIcon className="w-3 h-3" /> Borrower
                        </span>
                        <span className="font-semibold text-blue-900 truncate block">
                          {agreement.borrower?.name || 'Unknown'} {!isOwner && '(You)'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-blue-950 pt-1">
                      <div className="flex items-center gap-1 text-blue-700/90">
                        <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>Start: <strong>{agreement.startDate ? new Date(agreement.startDate).toLocaleDateString() : 'Not set'}</strong></span>
                      </div>

                      <div className="flex items-center gap-1 text-blue-700/90">
                        <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>Due: <strong>{agreement.endDate ? new Date(agreement.endDate).toLocaleDateString() : 'Not set'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* ========================= Actions ========================= */}
                  <div className="pt-3 border-t border-blue-100 flex items-center justify-between gap-2">
                    {agreement.item?._id && (
                      <Link
                        to={`/items/${agreement.item._id}`}
                        className="py-2 px-3 bg-blue-50 hover:bg-blue-900 text-blue-950 hover:text-white text-xs font-semibold rounded-xl border border-blue-200 transition-all cursor-pointer"
                      >
                        View Item
                      </Link>
                    )}

                    {isOwner && agreement.status === 'borrowed' && (
                      <p className="text-[11px] italic text-blue-700/80">
                        Awaiting return from borrower...
                      </p>
                    )}

                    {!isOwner && agreement.status === 'borrowed' && (
                      <button
                        onClick={() => handleReturnItem(agreement._id)}
                        disabled={isProcessing}
                        className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl border border-blue-950 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isProcessing ? 'Processing...' : 'Mark as Returned'}</span>
                      </button>
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

export default MyAgreements;