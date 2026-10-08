
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { authenticatedFetch } from '../api/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ItemDetails = () => {
    // -------------------- Context and State --------------------
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // -------------------- Fetch Item Details --------------------
    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(
                    `http://localhost:3000/items/${id}`
                );

                if (!response.ok) {
                    throw new Error('Could not load item details.');
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


    //=========================Request Item=========================
    const handleRequestItem = async (itemId) => {
        try {
            const response = await authenticatedFetch(user, '/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item: itemId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create request');
            }

            const request = await response.json();
            console.log('Request created:', request);
        } catch (error) {
            console.error('Failed to create request:', error);
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
                <h1 className="text-3xl font-bold">
                    {item.name}
                </h1>

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
                <button className='btn' onClick={() => handleRequestItem(item._id)}>
                    Request
                </button>
            </div>
        </div>
    );
};

export default ItemDetails;