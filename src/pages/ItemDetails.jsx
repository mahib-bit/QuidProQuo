import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { authenticatedFetch } from "../api/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ItemDetails = () => {
  // -------------------- Context and State --------------------
  const { id } = useParams();
  const { user, mongoUser } = useContext(AuthContext);

  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [proposedStart, setProposedStart] = useState("");
  const [proposedEnd, setProposedEnd] = useState("");

  // -------------------- Fetch Item Details --------------------
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://localhost:3000/items/${id}`);

        if (!response.ok) {
          throw new Error("Could not load item details.");
        }

        const data = await response.json();
        setItem(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

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
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setRequestLoading(false);
    }
  };

  // -------------------- Loading and Error States --------------------
  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!item) {
    return <p>Item not found.</p>;
  }

  // -------------------- Item Details UI --------------------
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/items" className="text-blue-500">
        ← Back to Items
      </Link>

      <div className="mt-6 border rounded-xl p-6 space-y-3">
        <h1 className="text-3xl font-bold">{item.name}</h1>

        <p>
          <strong>Category:</strong> {item.category}
        </p>

        <p>
          <strong>Description:</strong> {item.description}
        </p>

        <p>
          <strong>Condition:</strong> {item.condition}
        </p>

        <p>
          <strong>Location:</strong> {item.location}
        </p>

        <p>
          <strong>Status:</strong> {item.status}
        </p>

        {item.purchasePrice != null && (
          <p>
            <strong>Purchase Price:</strong> {item.purchasePrice}
          </p>
        )}

        {item.notes && (
          <p>
            <strong>Notes:</strong> {item.notes}
          </p>
        )}

        {/* ========================= Borrowing Request ========================= */}

        <div>
          <label htmlFor="proposedStart">Borrowing start date</label>
          <input
            id="proposedStart"
            type="date"
            value={proposedStart}
            onChange={(e) => setProposedStart(e.target.value)}
            required
          />

          <label htmlFor="proposedEnd">Return date</label>
          <input
            id="proposedEnd"
            type="date"
            value={proposedEnd}
            onChange={(e) => setProposedEnd(e.target.value)}
            min={proposedStart || undefined}
            required
          />
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleRequestItem}
            disabled={
              requestLoading ||
              item.status !== "available" ||
              !user ||
              item.owner?._id === mongoUser?._id ||
              item.owner === mongoUser?._id
            }
            className="btn btn-primary"
          >
            {requestLoading
              ? "Submitting Request..."
              : item.status !== "available"
                ? "Item Unavailable"
                : "Request to Borrow"}
          </button>

          {requestMessage && <p className="text-green-600">{requestMessage}</p>}

          {requestError && <p className="text-red-600">{requestError}</p>}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
