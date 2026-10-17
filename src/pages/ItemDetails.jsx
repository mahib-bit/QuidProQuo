import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router";
import { authenticatedFetch } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  MapPin, 
  Tag, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  DollarSign
} from "lucide-react";

const ItemDetails = () => {
  // -------------------- Context and State --------------------
  const { id } = useParams();
  const { user, mongoUser } = useContext(AuthContext);

  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [hasRequested, setHasRequested] = useState(false);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [proposedStart, setProposedStart] = useState("");
  const [proposedEnd, setProposedEnd] = useState("");

  // Get today's date formatted as YYYY-MM-DD for input min restrictions
  const today = new Date().toISOString().split("T")[0];

  // -------------------- Fetch Item & Existing Request Details --------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch the item
        const response = await fetch(`http://localhost:3000/items/${id}`);

        if (!response.ok) {
          throw new Error("Could not load item details.");
        }

        const data = await response.json();
        setItem(data);

        // If user is logged in, check if they already requested this item
        if (user) {
          const reqResponse = await authenticatedFetch(user, "/requests/my");
          if (reqResponse.ok) {
            const userRequests = await reqResponse.json();
            
            // Check if any request matches this item ID and is active
            const existingRequest = userRequests.find(
              (req) => (req.item?._id || req.item) === id && req.status === "pending"
            );

            if (existingRequest) {
              setHasRequested(true);
            }
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  // ========================= Request to Borrow =========================
  const handleRequestItem = async () => {
    try {
      setRequestLoading(true);
      setRequestMessage("");
      setRequestError("");

      if (!proposedStart || !proposedEnd) {
        setRequestError("Please select both borrowing dates.");
        return;
      }

      if (new Date(proposedStart) > new Date(proposedEnd)) {
        setRequestError("Start date cannot be after end date.");
        return;
      }

      const response = await authenticatedFetch(user, "/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: item._id,
          proposedStart,
          proposedEnd,
          agreementType: "lending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit borrowing request.");
      }

      setRequestMessage("Borrowing request submitted successfully!");
      setHasRequested(true);
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setRequestLoading(false);
    }
  };

  // -------------------- Loading and Error States --------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-blue-900/20 rounded-2xl shadow-sm text-blue-950 font-serif font-bold text-sm">
          <span className="animate-spin text-blue-900">❖</span>
          <span>Loading item details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 font-sans">
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
        <Link to="/items" className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-blue-900 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto p-6 font-sans text-center">
        <p className="text-blue-950 font-serif font-bold text-lg">Item not found.</p>
        <Link to="/items" className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-blue-900 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </div>
    );
  }

  // Helper check for ownership
  const isOwner =
    item.owner?._id === mongoUser?._id || item.owner === mongoUser?._id;

  // -------------------- Item Details UI --------------------
  return (
    <div className="min-h-screen bg-slate-50/60 text-blue-950 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <Link to="/items" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        <div className="bg-white border-4 border-double border-blue-900 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-blue-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
                {item.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-blue-950">{item.name}</h1>
            </div>

            <span className={`px-3 py-1 text-xs font-semibold rounded-full border self-start sm:self-center capitalize flex items-center gap-1 ${
              item.status === 'available'
                ? 'bg-blue-900 text-white border-blue-950'
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}>
              {item.status === 'available' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-200" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-700" />
              )}
              {item.status}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Description</h3>
              <p className="text-sm text-blue-950 leading-relaxed bg-blue-50/40 p-4 rounded-2xl border border-blue-100/80">
                {item.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-blue-100 rounded-xl space-y-1">
                <span className="text-blue-500 font-semibold block text-[10px] uppercase">Condition</span>
                <span className="font-serif font-bold text-blue-950 text-sm">{item.condition}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-blue-100 rounded-xl space-y-1">
                <span className="text-blue-500 font-semibold block text-[10px] uppercase">Location</span>
                <span className="font-serif font-bold text-blue-950 text-sm flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </span>
              </div>

              {item.purchasePrice != null && (
                <div className="p-3 bg-slate-50 border border-blue-100 rounded-xl space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-blue-500 font-semibold block text-[10px] uppercase">Purchase Price</span>
                  <span className="font-serif font-bold text-blue-950 text-sm">${item.purchasePrice}</span>
                </div>
              )}
            </div>

            {item.notes && (
              <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1 text-xs">
                <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider block">Special Notes</span>
                <p className="text-amber-950">{item.notes}</p>
              </div>
            )}
          </div>

          {/* ========================= Borrowing Request ========================= */}
          {!isOwner && (
            <div className="pt-4 border-t-2 border-blue-100 space-y-4">
              <h3 className="font-serif font-bold text-lg text-blue-950 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-900" />
                <span>Request Borrowing Dates</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="proposedStart" className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    id="proposedStart"
                    type="date"
                    value={proposedStart}
                    onChange={(e) => setProposedStart(e.target.value)}
                    min={today}
                    disabled={hasRequested}
                    className="w-full px-3.5 py-2 text-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950 disabled:bg-slate-100"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="proposedEnd" className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                    Return Date
                  </label>
                  <input
                    id="proposedEnd"
                    type="date"
                    value={proposedEnd}
                    onChange={(e) => setProposedEnd(e.target.value)}
                    min={proposedStart || today}
                    disabled={hasRequested}
                    className="w-full px-3.5 py-2 text-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950 disabled:bg-slate-100"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 space-y-3">
            <button
              onClick={handleRequestItem}
              disabled={
                requestLoading ||
                hasRequested ||
                item.status !== "available" ||
                !user ||
                isOwner
              }
              className="w-full py-3 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white disabled:text-slate-600 font-serif font-bold text-sm rounded-xl shadow-md transition-all border border-blue-950 disabled:border-slate-300 cursor-pointer disabled:cursor-not-allowed"
            >
              {requestLoading
                ? "Submitting Request..."
                : hasRequested
                  ? "Item Requested"
                  : isOwner
                    ? "You Own This Item"
                    : item.status !== "available"
                      ? "Item Unavailable"
                      : "Request to Borrow"}
            </button>

            {requestMessage && (
              <p className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{requestMessage}</span>
              </p>
            )}

            {requestError && (
              <p className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{requestError}</span>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ItemDetails;