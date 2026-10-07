import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authenticatedFetch } from '../api/api';
import {
    Plus,
    Search,
    Sparkles,
    Layers,
    Calendar,
    DollarSign,
    Handshake,
    ShieldCheck,
    Info,
    Loader2,
    Package,
    CheckCircle2,
    Clock,
    X,
    Filter,
    ArrowUpRight
} from 'lucide-react';

//=========================Items Component=========================
const Items = () => {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Filter & Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

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
                    name,
                    category,
                    description,
                    condition,
                    estimatedValue: Number(estimatedValue),
                    purchaseDate: purchaseDate || undefined,
                    purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
                    notes,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create item');
            }

            const newItem = await response.json();

            // UI instantly updated with the new item
            setItems((currentItems) => [...currentItems, newItem]);

            // Reset form fields
            setName('');
            setCategory('');
            setDescription('');
            setCondition('Good');
            setEstimatedValue('');
            setPurchaseDate('');
            setPurchasePrice('');
            setNotes('');
            setIsFormOpen(false);

        } catch (error) {
            console.error('Failed to create item:', error);
        }
    };

    // Derived Categories & Filtered Items
    const categories = ['All', ...new Set(items.map(item => item.category).filter(Boolean))];
    
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    //=========================Loading=========================
    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-blue-50/30 text-blue-950 gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-blue-900" />
                <p className="font-serif text-base font-semibold tracking-wide text-blue-900">Gathering porcelain collection...</p>
            </div>
        );
    }

    //=========================Items Page=========================
    return (
        <div className="min-h-screen bg-slate-50/60 text-blue-950 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Hero / Header Banner - Deep Cobalt Gradient */}
                <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden border-4 border-double border-blue-300/40">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-sky-300/10 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/80 border border-blue-300/50 text-blue-100 text-xs font-serif font-medium tracking-widest uppercase">
                            <span>❖</span> Item Vault <span>❖</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
                            Borrow what you need.<br />Lend what you don't.
                        </h1>
                        <p className="text-sm text-blue-100/90 leading-relaxed max-w-xl">
                            Explore available items shared by neighbors or list your personal items in our cobalt porcelain catalog.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => setIsFormOpen(!isFormOpen)}
                                className="px-5 py-2.5 bg-blue-50 hover:bg-white text-blue-950 text-sm font-semibold rounded-xl shadow-md border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 flex items-center gap-2"
                            >
                                {isFormOpen ? <X className="w-4 h-4 text-blue-900" /> : <Plus className="w-4 h-4 text-blue-900" />}
                                {isFormOpen ? 'Close Form' : 'Lend an Item'}
                            </button>
                            <div className="flex items-center gap-2 text-xs text-blue-200 font-medium">
                                <ShieldCheck className="w-4 h-4 text-blue-300" />
                                <span>Verified Peer Exchange</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*=========================Add Item Form (Gzhel Porcelain Card)=========================*/}
                {isFormOpen && (
                    <div className="bg-white border-4 border-double border-blue-900 rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 space-y-6">
                        <div className="flex items-center justify-between border-b-2 border-blue-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-serif text-lg">
                                    ❖
                                </div>
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-blue-950">List an Item for Lending</h2>
                                    <p className="text-xs text-blue-700">Provide details to register your item in the collection.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsFormOpen(false)}
                                className="p-1.5 text-blue-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateItem} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-950">
                                        Item Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Cordless Lawn Mower"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-blue-50/40 border border-blue-200 rounded-xl text-sm text-blue-950 placeholder-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-950">
                                        Category *
                                    </label>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="e.g. Garden, Tools, Electronics"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-blue-50/40 border border-blue-200 rounded-xl text-sm text-blue-950 placeholder-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Condition */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-950">
                                        Condition
                                    </label>
                                    <select
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-blue-50/40 border border-blue-200 rounded-xl text-sm text-blue-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                                    >
                                        <option value="New">New</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                </div>

                                {/* Estimated Value */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-950">
                                        Estimated Value (৳) *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-2.5 text-blue-400 text-sm font-bold">৳</span>
                                        <input
                                            type="number"
                                            value={estimatedValue}
                                            onChange={(e) => setEstimatedValue(e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            required
                                            className="w-full pl-8 pr-3.5 py-2.5 bg-blue-50/40 border border-blue-200 rounded-xl text-sm text-blue-950 placeholder-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Purchase Date */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-950">
                                        Purchase Date
                                    </label>
                                    <input
                                        type="date"
                                        value={purchaseDate}
                                        onChange={(e) => setPurchaseDate(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-blue-50/40 border border-blue-200 rounded-xl text-sm text-blue-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Purchase Price */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-950">
                                        Purchase Price (৳)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-2.5 text-blue-400 text-sm font-bold">৳</span>
                                        <input
                                            type="number"
                                            value={purchasePrice}
                                            onChange={(e) => setPurchasePrice(e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            className="w-full pl-8 pr-3.5 py-2.5 bg-blue-50/40 border border-blue-200 rounded-xl text-sm text-blue-950 placeholder-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description & Notes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-950">
                                        Description *
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Provide key details, accessories included, or usage instructions..."
                                        required
                                        rows={3}
                                        className="w-full p-3.5 bg-blue-50/40 border border-blue-200 rounded-xl text-sm text-blue-950 placeholder-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-950">
                                        Lending Notes / Rules
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="e.g. Please return clean; max borrow period 5 days..."
                                        rows={3}
                                        className="w-full p-3.5 bg-blue-50/40 border border-blue-200 rounded-xl text-sm text-blue-950 placeholder-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2 border-t border-blue-100">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-5 py-2.5 text-blue-700 hover:bg-blue-50 rounded-xl text-sm font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-md border border-blue-300 flex items-center gap-2 transition-all duration-200"
                                >
                                    <Plus className="w-4 h-4" />
                                    Publish Item
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/*=========================Filter & Search Toolbar=========================*/}
                <div className="bg-white border-2 border-blue-900/30 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3.5 top-3 text-blue-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search collection..."
                            className="w-full pl-9 pr-4 py-2 bg-blue-50/30 border border-blue-200 rounded-xl text-sm text-blue-950 placeholder-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Category Filter Pills (Varying Gzhel Blue Shades) */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                        <Filter className="w-3.5 h-3.5 text-blue-500 shrink-0 mr-1 hidden lg:block" />
                        {categories.map((cat, idx) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                                        isSelected
                                            ? 'bg-blue-900 text-white border-blue-950 shadow-sm'
                                            : 'bg-blue-50/60 text-blue-900 border-blue-200 hover:bg-blue-100/80 hover:text-blue-950'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/*=========================Items Collection Grid=========================*/}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <p className="text-xs font-serif font-bold text-blue-900 uppercase tracking-wider">
                            ✦ Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} in catalog
                        </p>
                    </div>

                    {filteredItems.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-blue-200 p-8 space-y-3">
                            <Package className="w-10 h-10 text-blue-300 mx-auto" />
                            <h3 className="text-blue-950 font-serif font-bold text-lg">No matching items found</h3>
                            <p className="text-blue-700 text-xs max-w-sm mx-auto">
                                Try adjusting your search term or category filter, or list a new item for the community.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map((item, index) => {
                                // Subtle alternating Gzhel ceramic border accents for visual variation
                                const borderTone = index % 3 === 0 
                                    ? 'hover:border-blue-900 border-blue-900/20' 
                                    : index % 3 === 1 
                                    ? 'hover:border-indigo-900 border-indigo-900/20' 
                                    : 'hover:border-sky-800 border-sky-800/20';

                                return (
                                    <div
                                        key={item._id || item.id}
                                        className={`bg-white border-2 ${borderTone} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group`}
                                    >
                                        <div className="space-y-3">
                                            {/* Card Header & Status */}
                                            <div className="flex items-start justify-between gap-3 border-b-2 border-blue-100/80 pb-3">
                                                <div>
                                                    <span className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 inline-block mb-1">
                                                        {item.category}
                                                    </span>
                                                    <h3 className="text-lg font-serif font-bold text-blue-950 group-hover:text-blue-700 transition-colors">
                                                        {item.name}
                                                    </h3>
                                                </div>

                                                {/* Status Badge in Gzhel Palette */}
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 flex items-center gap-1 border ${
                                                    item.status === 'On Loan' || item.status === 'Borrowed'
                                                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                                                        : 'bg-blue-900 text-white border-blue-950'
                                                }`}>
                                                    {item.status === 'On Loan' ? (
                                                        <Clock className="w-3 h-3 text-amber-700" />
                                                    ) : (
                                                        <CheckCircle2 className="w-3 h-3 text-sky-200" />
                                                    )}
                                                    {item.status || 'Available'}
                                                </span>
                                            </div>

                                            {/* Specification Row with Light Cobalt Fill */}
                                            <div className="grid grid-cols-2 gap-2 text-xs text-blue-950 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                                                <div>
                                                    <span className="text-blue-500 block text-[10px] uppercase font-bold">Condition</span>
                                                    <span className="font-semibold text-blue-900">{item.condition}</span>
                                                </div>
                                                <div>
                                                    <span className="text-blue-500 block text-[10px] uppercase font-bold">Est. Value</span>
                                                    <span className="font-semibold text-blue-900">৳{item.estimatedValue}</span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-xs text-blue-900/80 leading-relaxed line-clamp-3">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Card Footer / Action Button */}
                                        <div className="pt-3 border-t border-blue-100 space-y-3">
                                            {item.notes && (
                                                <div className="flex items-start gap-1.5 text-[11px] text-blue-800 bg-blue-50/70 p-2 rounded-lg border border-blue-100/80">
                                                    <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                                    <span className="line-clamp-2 italic">{item.notes}</span>
                                                </div>
                                            )}

                                            <button className="w-full py-2 px-3 bg-blue-50/80 hover:bg-blue-900 text-blue-950 hover:text-white text-xs font-semibold rounded-xl border border-blue-300 hover:border-blue-900 transition-all duration-200 flex items-center justify-center gap-1.5 group/btn shadow-xs">
                                                <span>Request to Borrow</span>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 group-hover/btn:text-white transition-colors" />
                                            </button>
                                        </div>
                                    </div>
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