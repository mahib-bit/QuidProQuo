import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authenticatedFetch } from '../api/api';

//=========================Items Component=========================
const Items = () => {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [condition, setCondition] = useState('Good');
    const [estimatedValue, setEstimatedValue] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [notes, setNotes] = useState('');

    //=========================Get Items=========================
    useEffect(() => {
        // Only fetch if a valid user object exists
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

    //=========================Create Item=========================

    const handleCreateItem = async (e) => {
        e.preventDefault();
        try {
            const response = await authenticatedFetch(user, '/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    category: category,
                    description: description,
                    condition: condition,
                    estimatedValue: Number(estimatedValue),
                    purchaseDate: purchaseDate || undefined,
                    purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
                    notes: notes,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create item');
            }

            const newItem = await response.json();

            // UI instantly updated with the new item
            setItems((currentItems) => [
                ...currentItems,newItem
            ]);

            // Reset form fields
            setName('');
            setCategory('');
            setDescription('');
            setCondition('Good');
            setEstimatedValue('');
            setPurchaseDate('');
            setPurchasePrice('');
            setNotes('');

        } catch (error) {
            console.error('Failed to create item:', error);
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

            {/*=========================Add Item=========================*/}
            <h2>Add Item</h2>
            <form onSubmit={handleCreateItem}>
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
                <div>
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category"
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your item"
                        required
                    />
                </div>
                <div>
                    <label>Condition</label>
                    <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                        <option value="New">New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                    </select>
                </div>
                <div>
                    <label>Estimated Value</label>
                    <input
                        type="number"
                        value={estimatedValue}
                        onChange={(e) => setEstimatedValue(e.target.value)}
                        placeholder="Estimated value"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label>Purchase Date</label>
                    <input
                        type="date"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                    />
                </div>
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
                <div>
                    <label>Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional notes"
                    />
                </div>
                <button type="submit">Add Item</button>
            </form>

            {/*=========================Items=========================*/}
            <h2>Available Items</h2>
            <p>Total items: {items.length}</p>
            {items.map((item) => (
                <div key={item._id || item.id}>
                    <h3>{item.name}</h3>
                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Condition:</strong> {item.condition}</p>
                    <p><strong>Estimated Value:</strong> ৳{item.estimatedValue}</p>
                    <p><strong>Status:</strong> {item.status}</p>
                    <p>{item.description}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
};

export default Items;
