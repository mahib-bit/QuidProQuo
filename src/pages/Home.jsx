import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { 
  Package, 
  ArrowRight, 
  Search, 
  MapPin, 
  Tag, 
  RefreshCw,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Assets
import HeroSharingImg from '../assets/hero-sharing.png';
import StepListImg from '../assets/how-it-works-list.png';
import StepRequestImg from '../assets/how-it-works-request.png';
import StepSwapImg from '../assets/how-it-works-swap.png';

import CatToolsImg from '../assets/cat-tools.png';
import CatElectronicsImg from '../assets/cat-electronics.png';
import CatOutdoorImg from '../assets/cat-outdoor.png';
import CatPartyImg from '../assets/cat-party.png';

const Home = () => {
  const { user } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeStep, setActiveStep] = useState(0);

  // Swipe / Drag Tracking Refs
  const startX = useRef(0);
  const isDragging = useRef(false);

  const steps = [
    {
      stepNumber: '01',
      title: 'List What You Own',
      subtitle: 'Share your idle gear with your local community',
      description: 'Upload high-quality photos, write item specifications, and set borrowing availability for your power tools, camping gear, electronics, or party supplies.',
      image: StepListImg,
      badge: 'Step 1 of 3'
    },
    {
      stepNumber: '02',
      title: 'Request & Connect',
      subtitle: 'Find what you need nearby without high buying costs',
      description: 'Select start and return dates for items you need, submit requests to nearby owners, and communicate directly through system notifications.',
      image: StepRequestImg,
      badge: 'Step 2 of 3'
    },
    {
      stepNumber: '03',
      title: 'Meet, Exchange & Return',
      subtitle: 'Safe peer-to-peer exchanges with verified tracking',
      description: 'Meet up safely in your neighborhood to exchange items with automated agreement generation tracking your return schedule.',
      image: StepSwapImg,
      badge: 'Step 3 of 3'
    }
  ];

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const itemsRes = await fetch('http://localhost:3000/items');
        const itemsData = itemsRes.ok ? await itemsRes.json() : [];
        setItems(Array.isArray(itemsData) ? itemsData : []);
      } catch (error) {
        console.error('Failed to load public home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  // Next / Prev Step Handlers
  const handleNextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

  // Touch & Mouse Gesture Handlers
  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX || e.touches?.[0]?.clientX || 0;
  };

  const handlePointerEnd = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const endX = e.clientX || e.changedTouches?.[0]?.clientX || 0;
    const diffX = startX.current - endX;

    if (diffX > 40) {
      handleNextStep(); // Swipe Left -> Next
    } else if (diffX < -40) {
      handlePrevStep(); // Swipe Right -> Prev
    }
  };

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
    <div className="min-h-screen bg-slate-50/60 text-blue-950 font-sans py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* 1. HERO SECTION WITH BLUE GRADIENT BACKDROP */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-4 border-double border-blue-300/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-[11px] font-serif uppercase tracking-widest text-blue-200 bg-blue-900/80 px-3.5 py-1 rounded-full border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Peer-to-Peer Community Network</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
              Borrow local gear, share what you own.
            </h1>

            <p className="text-sm sm:text-base text-blue-200 max-w-xl font-light leading-relaxed mx-auto lg:mx-0">
              QuidProQuo connects verified neighbors to lend and borrow tools, equipment, electronics, and household items safely with full agreement tracking.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/items"
                className="px-7 py-3.5 bg-white text-blue-950 font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-blue-50 transition-all border border-blue-200 flex items-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4 text-blue-900" />
                <span>Explore Catalog</span>
              </Link>

              {user ? (
                <Link
                  to="/dashboard"
                  className="px-7 py-3.5 bg-blue-900/90 hover:bg-blue-800 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl border border-blue-300/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Go To Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="px-7 py-3.5 bg-blue-900/90 hover:bg-blue-800 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl border border-blue-300/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Join QuidProQuo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <img 
              src={HeroSharingImg} 
              alt="Community Item Sharing" 
              className="w-full h-auto max-h-[400px] object-contain drop-shadow-lg"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* 2. DYNAMIC SWIPEABLE "HOW IT WORKS" SECTION */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50/80 border border-blue-200 rounded-full text-blue-900 text-xs font-serif uppercase tracking-widest">
              <span>❖</span> Interactive Workflow <span>❖</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-blue-950">How QuidProQuo Works</h2>
            <p className="text-xs text-blue-700">Swipe card horizontally or tap indicators below to navigate steps.</p>
          </div>

          {/* Interactive Card Container with Lighter BG & Touch Swipe Logic */}
          <div className="relative group">
            {/* Left Nav Button */}
            <button
              onClick={handlePrevStep}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-blue-900 hover:text-white border border-blue-200 shadow-md flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous Step"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Nav Button */}
            <button
              onClick={handleNextStep}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-blue-900 hover:text-white border border-blue-200 shadow-md flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next Step"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div 
              onTouchStart={handlePointerDown}
              onTouchEnd={handlePointerEnd}
              onMouseDown={handlePointerDown}
              onMouseUp={handlePointerEnd}
              className="bg-gradient-to-br from-blue-50/60 via-slate-50/90 to-blue-50/40 border-2 border-blue-900/15 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[420px] select-none cursor-grab active:cursor-grabbing transition-all"
            >
              {/* Description Column */}
              <div className="md:col-span-7 space-y-5 text-center md:text-left">
                <span className="px-3.5 py-1.5 bg-blue-100/70 text-blue-900 font-serif font-bold text-xs uppercase rounded-full border border-blue-300 inline-block">
                  {steps[activeStep].badge}
                </span>

                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-blue-950 leading-tight">
                  {steps[activeStep].title}
                </h3>

                <p className="text-base font-semibold text-blue-900">
                  {steps[activeStep].subtitle}
                </p>

                <p className="text-xs sm:text-sm text-blue-900/80 leading-relaxed max-w-xl">
                  {steps[activeStep].description}
                </p>
              </div>

              {/* Illustration Column */}
              <div className="md:col-span-5 flex items-center justify-center">
                <img 
                  src={steps[activeStep].image} 
                  alt={steps[activeStep].title} 
                  className="w-full max-w-md h-auto max-h-[360px] object-contain drop-shadow-md transition-all duration-300 pointer-events-none"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>

          {/* Indicator Dots Below Card */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  activeStep === idx
                    ? 'w-8 h-3 bg-blue-900'
                    : 'w-3 h-3 bg-blue-200 hover:bg-blue-400'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 3. ENLARGED FEATURED CATEGORIES SHOWCASE WITH LIGHTER SHADES */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-blue-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-blue-900 font-serif text-xl">❖</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-blue-950">Featured Categories</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1 */}
            <div 
              onClick={() => setSelectedCategory('Tools & Hardware')}
              className="group bg-slate-50/70 border-2 border-blue-900/15 hover:border-blue-900 hover:bg-blue-50/80 rounded-3xl p-8 cursor-pointer transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-6"
            >
              <div className="w-28 h-28 mx-auto flex items-center justify-center">
                <img 
                  src={CatToolsImg} 
                  alt="Tools & Hardware" 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="font-serif font-bold text-xl text-blue-950 group-hover:text-blue-900 transition-colors">
                  Tools & Hardware
                </h3>
                <p className="text-xs text-blue-700 font-medium">Drills, Saws, Ladders, Toolkits</p>
              </div>
            </div>

            {/* Category 2 */}
            <div 
              onClick={() => setSelectedCategory('Electronics')}
              className="group bg-slate-50/70 border-2 border-blue-900/15 hover:border-blue-900 hover:bg-blue-50/80 rounded-3xl p-8 cursor-pointer transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-6"
            >
              <div className="w-28 h-28 mx-auto flex items-center justify-center">
                <img 
                  src={CatElectronicsImg} 
                  alt="Electronics" 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="font-serif font-bold text-xl text-blue-950 group-hover:text-blue-900 transition-colors">
                  Electronics
                </h3>
                <p className="text-xs text-blue-700 font-medium">Cameras, Projectors, Monitors</p>
              </div>
            </div>

            {/* Category 3 */}
            <div 
              onClick={() => setSelectedCategory('Toys & Sports')}
              className="group bg-slate-50/70 border-2 border-blue-900/15 hover:border-blue-900 hover:bg-blue-50/80 rounded-3xl p-8 cursor-pointer transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-6"
            >
              <div className="w-28 h-28 mx-auto flex items-center justify-center">
                <img 
                  src={CatOutdoorImg} 
                  alt="Outdoor & Sports" 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="font-serif font-bold text-xl text-blue-950 group-hover:text-blue-900 transition-colors">
                  Outdoor & Sports
                </h3>
                <p className="text-xs text-blue-700 font-medium">Tents, Kayaks, Bicycles, Helmets</p>
              </div>
            </div>

            {/* Category 4 */}
            <div 
              onClick={() => setSelectedCategory('Home & Furniture')}
              className="group bg-slate-50/70 border-2 border-blue-900/15 hover:border-blue-900 hover:bg-blue-50/80 rounded-3xl p-8 cursor-pointer transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-6"
            >
              <div className="w-28 h-28 mx-auto flex items-center justify-center">
                <img 
                  src={CatPartyImg} 
                  alt="Party & Events" 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="font-serif font-bold text-xl text-blue-950 group-hover:text-blue-900 transition-colors">
                  Party & Events
                </h3>
                <p className="text-xs text-blue-700 font-medium">Speakers, Folding Tables, Chairs</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. LIVE SEARCH & CATALOG SHOWCASE */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-blue-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-900 font-serif text-lg">❖</span>
              <h2 className="text-2xl font-serif font-bold text-blue-950">Explore Available Items</h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-blue-900 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs border-2 border-blue-900/20 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-blue-950 font-medium"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white border-blue-950 shadow-xs'
                    : 'bg-white text-blue-950 border-blue-900/15 hover:border-blue-900 hover:bg-blue-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Live Items Grid with Light Cards */}
          {loading ? (
            <div className="bg-slate-50/80 border-2 border-blue-900/20 rounded-2xl p-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 font-serif font-bold text-sm">
                <RefreshCw className="w-4 h-4 text-blue-900 animate-spin" />
                <span>Fetching live network data...</span>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-slate-50/80 border-2 border-blue-900/20 rounded-3xl p-12 text-center text-blue-950 space-y-2">
              <h3 className="font-serif font-bold text-lg">No items match your criteria</h3>
              <p className="text-xs text-blue-700">Try adjusting your search keywords or switching categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.slice(0, 6).map((item) => (
                <Link
                  key={item._id}
                  to={`/items/${item._id}`}
                  className="group bg-slate-50/70 border-2 border-blue-900/15 hover:border-blue-900 hover:bg-blue-50/60 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider bg-blue-100/60 px-2.5 py-0.5 rounded border border-blue-200">
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

                    <h3 className="text-base font-serif font-bold text-blue-950 group-hover:text-blue-900 transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-xs text-blue-900/80 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-2 text-xs bg-white/80 p-2.5 rounded-xl border border-blue-100">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-serif font-bold text-xs rounded-xl shadow-md border border-blue-950 transition-all cursor-pointer"
              >
                <span>View All {items.length} Items in Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;