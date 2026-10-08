import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authenticatedFetch } from '../api/api';

const Items = () => {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    //=========================Form State=========================
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [condition, setCondition] = useState('Good');
    const [location, setLocation] = useState('');
    const [estimatedValue, setEstimatedValue] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [notes, setNotes] = useState('');

    //=========================Edit State=========================
    const [editingItem, setEditingItem] = useState(null);

    //=========================Helper Functions=========================
    const resetForm = () => {
        setName('');
        setCategory('');
        setDescription('');
        setCondition('Good');
        setLocation('');
        setPurchaseDate('');
        setPurchasePrice('');
        setNotes('');
        setEditingItem(null);
    };

    //=========================Get Items=========================
    useEffect(() => {
        if (!user) return;

        const getItems = async () => {
            try {
                const response = await authenticatedFetch(user, '/items');

                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                }
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
            } finally {
                setLoading(false);
            }
        };

        getItems();
    }, [user]);

    //=========================Start Editing Item=========================
    const handleEditItem = (item) => {
        setEditingItem(item);

        setName(item.name || '');
        setCategory(item.category || '');
        setDescription(item.description || '');
        setCondition(item.condition || 'Good');
        setLocation(item.location || '');

        setPurchaseDate(item.purchaseDate ? item.purchaseDate.split('T')[0] : '');
        setPurchasePrice(item.purchasePrice || '');
        setNotes(item.notes || '');
    };

    //=========================Create / Update Item=========================
    const handleCreateItem = async (e) => {
        e.preventDefault();

        const endpoint = editingItem ? `/items/${editingItem._id}` : '/items';
        const method = editingItem ? 'PUT' : 'POST';

        try {
            const response = await authenticatedFetch(user, endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    category,
                    description,
                    condition,
                    location,
                    purchaseDate: purchaseDate || undefined,
                    purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
                    notes
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || (editingItem ? 'Failed to update item' : 'Failed to create item'));
            }
            const savedItem = await response.json();

            //=========================Update Items State==========================
            if (editingItem) {
                setItems((prevItems) =>
                    prevItems.map((item) => (item._id === savedItem._id ? savedItem : item))
                );
            } else {
                setItems((prevItems) => [...prevItems, savedItem]);
            }

            resetForm();
        } catch (error) {
            console.error(
                editingItem ? 'Failed to update item:' : 'Failed to create item:',
                error
            );
        }
    };

    //=========================Delete Item=========================
    const handleDeleteItem = async (id) => {
        try {
            const response = await authenticatedFetch(user, `/items/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            if (response.status !== 204) {
                await response.json();
            }

            setItems((prevItems) => prevItems.filter((item) => item._id !== id));
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

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

    //=========================Loading=========================
    if (loading) {
        return <p>Loading items...</p>;
    }

    //=========================Items Page=========================
    return (
        <div className="flex flex-col items-center justify-center">
            <h1>Items</h1>

            {/* Add / Edit Item */}
            <h2>{editingItem ? 'Edit Item' : 'Add Item'}</h2>
            <form className='border' onSubmit={handleCreateItem}>
                {/* Name */}
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Item name"
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label>Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing & Apparel">Clothing & Apparel</option>
                        <option value="Home & Furniture">Home & Furniture</option>
                        <option value="Health & Beauty">Health & Beauty</option>
                        <option value="Tools & Hardware">Tools & Hardware</option>
                        <option value="Groceries & Food">Groceries & Food</option>
                        <option value="Office & Stationery">Office & Stationery</option>
                        <option value="Automotive">Automotive</option>
                        <option value="Toys & Sports">Toys & Sports</option>
                        <option value="Books & Media">Books & Media</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your item"
                        required
                    />
                </div>

                {/* Condition */}
                <div>
                    <label>Condition</label>
                    <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                    >
                        <option value="New">New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                    </select>
                </div>

                {/* Location */}
                <div>
                    <label>Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                        required
                    />
                </div>

                {/* Purchase Date */}
                <div>
                    <label>Purchase Date</label>
                    <input
                        type="date"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                    />
                </div>

                {/* Purchase Price */}
                <div>
                    <label>Purchase Price</label>
                    <input
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                        placeholder="Purchase price"
                        min="0"
                    />
                </div>

                {/* Notes */}
                <div>
                    <label>Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional notes"
                    />
                </div>

                {/* Submit */}
                <button className='btn' type="submit">
                    {editingItem ? 'Update Item' : 'Add Item'}
                </button>

                {/* Cancel Edit */}
                {editingItem && (
                    <button className='btn' type="button" onClick={resetForm}>
                        Cancel
                    </button>
                )}
            </form>

            {/* Items */}
            <h2>Available Items</h2>
            <p>Total items: {items.length}</p>

            {items.map((item) => (
                <div className='border' key={item._id}>
                    <h3>{item.name}</h3>
                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Condition:</strong> {item.condition}</p>
                    <p><strong>Location:</strong> {item.location}</p>
                    {item.estimatedValue && (
                        <p><strong>Estimated Value:</strong> ৳{item.estimatedValue}</p>
                    )}
                    <p><strong>Status:</strong> {item.status}</p>
                    <p>{item.description}</p>

                    <button className='btn' onClick={() => handleEditItem(item)}>Edit</button>
                    <button className='btn' onClick={() => handleDeleteItem(item._id)}>Delete</button>
                    <button className='btn' onClick={() => handleRequestItem(item._id)}>Request</button>
                    <hr />
                </div>
            ))}
        </div>
    );
};

export default Items;