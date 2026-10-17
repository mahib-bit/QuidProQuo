import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { authenticatedFetch } from "../api/api";
import { Link } from "react-router";
import { Package, Edit3, Trash2, Plus, MapPin, Tag, DollarSign, Calendar } from "lucide-react";

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, mongoUser } = useContext(AuthContext);

  //=========================Form State=========================
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Good");
  const [location, setLocation] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [notes, setNotes] = useState("");

  //=========================Edit State=========================
  const [editingItem, setEditingItem] = useState(null);

  //=========================Helper Functions=========================
  const resetForm = () => {
    setName("");
    setCategory("");
    setDescription("");
    setCondition("Good");
    setLocation("");
    setPurchaseDate("");
    setPurchasePrice("");
    setNotes("");
    setEditingItem(null);
  };

  const isOwner = (item) => {
    if (!mongoUser) return false;
    const ownerId = item.owner?._id || item.owner;
    return ownerId === mongoUser._id;
  };

  //=========================Get Items=========================
  useEffect(() => {
    if (!user) return;

    const getItems = async () => {
      try {
        const response = await authenticatedFetch(user, "/items");

        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, [user]);

  //=========================Start Editing Item=========================
  const handleEditItem = (item) => {
    setEditingItem(item);

    setName(item.name || "");
    setCategory(item.category || "");
    setDescription(item.description || "");
    setCondition(item.condition || "Good");
    setLocation(item.location || "");

    setPurchaseDate(item.purchaseDate ? item.purchaseDate.split("T")[0] : "");
    setPurchasePrice(item.purchasePrice || "");
    setNotes(item.notes || "");
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //=========================Create / Update Item=========================
  const handleCreateItem = async (e) => {
    e.preventDefault();

    const endpoint = editingItem ? `/items/${editingItem._id}` : "/items";
    const method = editingItem ? "PUT" : "POST";

    try {
      const response = await authenticatedFetch(user, endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          description,
          condition,
          location,
          purchaseDate: purchaseDate || undefined,
          purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            (editingItem ? "Failed to update item" : "Failed to create item"),
        );
      }
      const savedItem = await response.json();

      if (editingItem) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === savedItem._id ? savedItem : item,
          ),
        );
      } else {
        setItems((prevItems) => [...prevItems, savedItem]);
      }

      resetForm();
    } catch (error) {
      console.error(
        editingItem ? "Failed to update item:" : "Failed to create item:",
        error,
      );
    }
  };

  //=========================Delete Item=========================
  const handleDeleteItem = async (id) => {
    try {
      const response = await authenticatedFetch(user, `/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      if (response.status !== 204) {
        await response.json();
      }

      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-blue-900/20 rounded-2xl shadow-sm text-blue-950 font-serif font-bold text-sm">
          <span className="animate-spin text-blue-900">❖</span>
          <span>Loading Item Catalog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-blue-950 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Form Container */}
        <div className="bg-white border-4 border-double border-blue-900 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-blue-100 pb-4">
            <Package className="w-5 h-5 text-blue-900" />
            <h2 className="text-xl font-serif font-bold text-blue-950">
              {editingItem ? "Edit Item Record" : "Add New Item"}
            </h2>
          </div>

          <form onSubmit={handleCreateItem} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kärcher High Pressure Washer"
                  className="w-full px-3.5 py-2 text-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950"
                  required
                >
                  <option value="" disabled>Select category</option>
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
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Item characteristics and details..."
                rows={3}
                className="w-full px-3.5 py-2 text-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950"
                >
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Uttara, Sector 10"
                  className="w-full px-3.5 py-2 text-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Purchase Price ($)
                </label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  className="w-full px-3.5 py-2 text-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Purchase Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950 cursor-pointer"
                  />
                  <Calendar className="w-4 h-4 text-blue-900 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Storage or usage notes"
                  className="w-full px-3.5 py-2 text-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-serif font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer border border-blue-300/60"
              >
                <Plus className="w-4 h-4" />
                <span>{editingItem ? "Update Item" : "Create Item"}</span>
              </button>

              {editingItem && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-950 font-semibold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Collection Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-blue-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-900 font-serif">❖</span>
              <h2 className="text-xl font-serif font-bold text-blue-950">Available Items</h2>
            </div>
            <span className="text-xs font-bold font-serif px-3 py-1 bg-white border-2 border-blue-900/15 rounded-full text-blue-950">
              Total Items: {items.length}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-8 text-center text-blue-900/80 font-serif">
              No items registered yet. Add one using the form above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => {
                const ownerFlag = isOwner(item);

                return (
                  <Link
                    key={item._id}
                    to={`/items/${item._id}`}
                    className="group bg-white border-2 border-blue-900/20 hover:border-blue-900 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between block relative"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
                            {item.category}
                          </span>
                          <h3 className="text-base font-serif font-bold text-blue-950 group-hover:text-blue-700 transition-colors">
                            {item.name}
                          </h3>
                        </div>

                        {ownerFlag && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-900 text-white px-2 py-0.5 rounded-full border border-blue-950 shrink-0">
                            Mine
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-blue-900/80 line-clamp-2 mb-4">
                        {item.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs text-blue-950 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 mb-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate font-semibold text-blue-900">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{item.condition}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-blue-100 pt-3 flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-blue-900 group-hover:underline">
                        View Details →
                      </span>

                      {ownerFlag && (
                        <div className="flex items-center gap-2 relative z-10">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEditItem(item);
                            }}
                            className="p-1.5 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteItem(item._id);
                            }}
                            className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Items;