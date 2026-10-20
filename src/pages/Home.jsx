import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { 
  Package, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  MapPin, 
  Tag, 
  RefreshCw,
  Users,
  FileCheck2,
  Clock
} from 'lucide-react';
import Footer from '../components/Footer';

const Home = () => {
  const { user } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch public live data from the server
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);

        const [itemsRes, agreementsRes] = await Promise.all([
          fetch('http://localhost:3000/items'),
          fetch('http://localhost:3000/agreements/public').catch(() => null)
        ]);

        const itemsData = itemsRes.ok ? await itemsRes.json() : [];
        const agreementsData = agreementsRes && agreementsRes.ok ? await agreementsRes.json() : [];

        setItems(Array.isArray(itemsData) ? itemsData : []);
        setAgreements(Array.isArray(agreementsData) ? agreementsData : []);
      } catch (error) {
        console.error('Failed to load public home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  // Filter items dynamically based on search query and category
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    'All',
    'Electronics',
    'Tools & Hardware',
    'Home & Furniture',
    'Clothing & Apparel',
    'Toys & Sports',
    'Books & Media',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 text-blue-950 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-4 border-double border-blue-300/40 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-[11px] font-serif uppercase tracking-widest text-blue-200 bg-blue-900/80 px-3 py-1 rounded-full border border-blue-400/30">
            <span>❖</span> Community Sharing Network
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Borrow local gear, share what you own.
          </h1>

          <p className="text-sm sm:text-base text-blue-200 max-w-2xl mx-auto font-light">
            Connect with neighbors to lend and borrow tools, equipment, electronics, and household goods safely and easily.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/items"
              className="px-6 py-3 bg-white text-blue-950 font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-blue-50 transition-all border border-blue-200 flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-blue-900" />
              <span>Browse Catalog</span>
            </Link>

            {user ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-blue-900/80 hover:bg-blue-800 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl border border-blue-300/40 transition-all flex items-center gap-2"
              >
                <span>My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-900/80 hover:bg-blue-800 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl border border-blue-300/40 transition-all flex items-center gap-2"
              >
                <span>Join Community</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Live Network Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-blue-950 block">
                {loading ? '...' : items.length}
              </span>
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Total Items Listed</span>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-blue-950 block">
                {loading ? '...' : items.filter((i) => i.status === 'available').length}
              </span>
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Available Right Now</span>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-5 shadow-xs flex items-center gap-4 col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-blue-950 block">
                {loading ? '...' : agreements.length}
              </span>
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Active Agreements</span>
            </div>
          </div>
        </div>

        {/* Search & Live Catalog Showcase */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-blue-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-900 font-serif">❖</span>
              <h2 className="text-2xl font-serif font-bold text-blue-950">Explore Available Items</h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-blue-900 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950 font-medium"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white border-blue-950 shadow-xs'
                    : 'bg-white text-blue-950 border-blue-900/15 hover:border-blue-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Live Catalog Items Grid */}
          {loading ? (
            <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 font-serif font-bold text-sm">
                <RefreshCw className="w-4 h-4 text-blue-900 animate-spin" />
                <span>Fetching live network data...</span>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white border-4 border-double border-blue-900/20 rounded-3xl p-12 text-center text-blue-950 space-y-2">
              <h3 className="font-serif font-bold text-lg">No items match your criteria</h3>
              <p className="text-xs text-blue-700">Try adjusting your search keywords or switching categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.slice(0, 6).map((item) => (
                <Link
                  key={item._id}
                  to={`/items/${item._id}`}
                  className="group bg-white border-2 border-blue-900/20 hover:border-blue-900 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                        {item.category}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
                        item.status === 'available'
                          ? 'bg-blue-900 text-white border-blue-950'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-blue-950 group-hover:text-blue-700 transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-xs text-blue-900/80 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-2 text-xs bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate font-medium text-blue-900">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate text-blue-900">{item.condition}</span>
                      </div>
                    </div>

                    <div className="border-t border-blue-100 pt-2 flex items-center justify-between text-xs font-serif font-bold text-blue-900 group-hover:underline">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredItems.length > 6 && (
            <div className="text-center pt-4">
              <Link
                to="/items"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-serif font-bold text-xs rounded-xl shadow-md border border-blue-950 transition-all"
              >
                <span>View All {items.length} Items in Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

      </div>
      <Footer></Footer>
    </div>
  );
};

export default Home;