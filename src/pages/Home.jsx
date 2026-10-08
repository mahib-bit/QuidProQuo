import React from 'react';
import { NavLink } from 'react-router';
import { 
    Search, 
    ShieldCheck, 
    Wrench, 
    Tent, 
    Camera, 
    PartyPopper, 
    Sparkles, 
    ArrowRight, 
    RefreshCw, 
    CheckCircle2, 
    Clock, 
    Handshake, 
    HeartHandshake, 
    Lock
} from 'lucide-react';

const Home = () => {
    // Sample items reflecting real neighborhood lending use-cases
    const sampleItems = [
        {
            id: '1',
            name: 'Kärcher K3 High Pressure Washer',
            category: 'Tools & Garden',
            condition: 'Good',
            estimatedValue: '18,000',
            location: 'Block C, Sector 6',
            status: 'Available',
            lender: 'Arif H.'
        },
        {
            id: '2',
            name: '4-Person Waterproof Camping Tent',
            category: 'Outdoors',
            condition: 'Like New',
            estimatedValue: '12,500',
            location: 'Uttara, Sector 10',
            status: 'Available',
            lender: 'Nadia T.'
        },
        {
            id: '3',
            name: 'Bosch Professional Cordless Drill Set',
            category: 'Tools & Garden',
            condition: 'Good',
            estimatedValue: '14,000',
            location: 'Mirpur DOHS',
            status: 'On Loan',
            lender: 'Tanvir A.'
        }
    ];

    const categories = [
        { name: 'Power Tools', icon: Wrench, count: '42 items' },
        { name: 'Camping & Outdoor', icon: Tent, count: '28 items' },
        { name: 'Electronics & Optics', icon: Camera, count: '19 items' },
        { name: 'Events & Parties', icon: PartyPopper, count: '31 items' },
    ];

    return (
        <div className="min-h-screen bg-slate-50/60 text-blue-950 font-sans py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-16">

                {/*=========================Hero Section=========================*/}
                <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border-4 border-double border-blue-300/40">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/90 border border-blue-300/50 text-blue-100 text-xs font-serif tracking-widest uppercase">
                            <span>❖</span> Peer-to-Peer Item Sharing <span>❖</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
                            Stop buying things you'll only use twice a year.
                        </h1>

                        <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                            Quid Pro Quo lets you borrow tools, camping gear, party supplies, and electronics directly from trusted neighbors nearby—and lend out your idle items when you aren't using them.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-4">
                            <NavLink
                                to="/items"
                                className="px-6 py-3 bg-white text-blue-950 text-sm font-semibold rounded-xl shadow-md border-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 group"
                            >
                                <span>Browse Available Items</span>
                                <ArrowRight className="w-4 h-4 text-blue-900 group-hover:translate-x-1 transition-transform" />
                            </NavLink>

                            <NavLink
                                to="/register"
                                className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl border border-blue-300/60 transition-all duration-200"
                            >
                                List Your First Item
                            </NavLink>
                        </div>

                        {/* Quick Trust Bar */}
                        <div className="pt-6 border-t border-blue-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-blue-200 font-medium">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
                                <span>Verified Community Members</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-blue-300 shrink-0" />
                                <span>Replacement Guarantees</span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                                <Handshake className="w-4 h-4 text-blue-300 shrink-0" />
                                <span>Zero Rental Fees</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*=========================The Math / Value Proposition=========================*/}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-6 space-y-3 shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <h3 className="font-serif font-bold text-lg text-blue-950">Save Money</h3>
                        <p className="text-xs text-blue-900/80 leading-relaxed">
                            Why spend ৳15,000 on a high-pressure washer or ৳10,000 on a drill set when your neighbor already owns one and is happy to share?
                        </p>
                    </div>

                    <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-6 space-y-3 shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="font-serif font-bold text-lg text-blue-950">Free Up Storage</h3>
                        <p className="text-xs text-blue-900/80 leading-relaxed">
                            Keep your closets and garage clutter-free. Borrow large items only for the weekend you need them, then return them home.
                        </p>
                    </div>

                    <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-6 space-y-3 shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900">
                            <HeartHandshake className="w-5 h-5" />
                        </div>
                        <h3 className="font-serif font-bold text-lg text-blue-950">Build Neighborhood Trust</h3>
                        <p className="text-xs text-blue-900/80 leading-relaxed">
                            Sharing resources fosters real connections. Every item exchange comes with ratings, condition logs, and clear agreements.
                        </p>
                    </div>
                </div>

                {/*=========================Browse Categories=========================*/}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-blue-100 pb-3">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-blue-950">Popular Item Categories</h2>
                            <p className="text-xs text-blue-700">Explore everyday tools and gear shared by people around you.</p>
                        </div>
                        <NavLink to="/items" className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1">
                            <span>View All</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </NavLink>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {categories.map((cat, idx) => {
                            const IconComponent = cat.icon;
                            return (
                                <NavLink
                                    key={idx}
                                    to="/items"
                                    className="bg-white border-2 border-blue-900/15 hover:border-blue-900 rounded-2xl p-5 text-center space-y-3 transition-all duration-200 group shadow-xs"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center mx-auto group-hover:bg-blue-900 group-hover:text-white transition-colors">
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-serif font-bold text-sm text-blue-950 group-hover:text-blue-700 transition-colors">
                                            {cat.name}
                                        </h4>
                                        <span className="text-[11px] text-blue-500 font-medium">{cat.count}</span>
                                    </div>
                                </NavLink>
                            );
                        })}
                    </div>
                </div>

                {/*=========================Sample Catalog Preview=========================*/}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-blue-100 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-900 font-serif">❖</span>
                            <h2 className="text-2xl font-serif font-bold text-blue-950">Recently Listed Nearby</h2>
                        </div>
                        <NavLink to="/items" className="text-xs font-semibold text-blue-900 hover:underline">
                            See catalog ({sampleItems.length}+ items)
                        </NavLink>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sampleItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border-2 border-blue-900/20 hover:border-blue-900 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 transition-all duration-200"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2 border-b border-blue-100 pb-2.5">
                                        <div>
                                            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
                                                {item.category}
                                            </span>
                                            <h3 className="text-base font-serif font-bold text-blue-950">
                                                {item.name}
                                            </h3>
                                        </div>
                                        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full shrink-0 flex items-center gap-1 border ${
                                            item.status === 'On Loan'
                                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                                : 'bg-blue-900 text-white border-blue-950'
                                        }`}>
                                            {item.status === 'On Loan' ? (
                                                <Clock className="w-3 h-3 text-amber-700" />
                                            ) : (
                                                <CheckCircle2 className="w-3 h-3 text-sky-200" />
                                            )}
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-950 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                                        <div>
                                            <span className="text-blue-500 block text-[10px] uppercase font-bold">Lender</span>
                                            <span className="font-semibold text-blue-900">{item.lender}</span>
                                        </div>
                                        <div>
                                            <span className="text-blue-500 block text-[10px] uppercase font-bold">Est. Value</span>
                                            <span className="font-semibold text-blue-900">৳{item.estimatedValue}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-blue-700/80">
                                        Location: <strong className="text-blue-950 font-semibold">{item.location}</strong>
                                    </p>
                                </div>

                                <NavLink
                                    to="/items"
                                    className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-900 text-blue-950 hover:text-white text-xs font-semibold rounded-xl border border-blue-300 hover:border-blue-900 transition-all duration-200 text-center block"
                                >
                                    View Item Details
                                </NavLink>
                            </div>
                        ))}
                    </div>
                </div>

                {/*=========================How It Works=========================*/}
                <div className="bg-white border-4 border-double border-blue-900 rounded-3xl p-8 sm:p-10 shadow-lg space-y-8">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <span className="text-xs font-serif font-bold text-blue-900 uppercase tracking-widest">Simple & Transparent</span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-blue-950">How Borrowing & Lending Works</h2>
                        <p className="text-xs sm:text-sm text-blue-700">Designed around mutual respect, clear expectations, and item safety.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Step 1 */}
                        <div className="space-y-3 relative">
                            <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-serif font-bold flex items-center justify-center text-base border-2 border-blue-300 shadow-sm">
                                1
                            </div>
                            <h3 className="font-serif font-bold text-base text-blue-950">Find or List an Item</h3>
                            <p className="text-xs text-blue-800/80 leading-relaxed">
                                Search the catalog for what you need or upload an item with usage notes, condition status, and estimated replacement value.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-3 relative">
                            <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-serif font-bold flex items-center justify-center text-base border-2 border-blue-300 shadow-sm">
                                2
                            </div>
                            <h3 className="font-serif font-bold text-base text-blue-950">Send a Request</h3>
                            <p className="text-xs text-blue-800/80 leading-relaxed">
                                Pick your borrowing dates and send a request. Lenders review member profiles and confirm pickup timing.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-3 relative">
                            <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-serif font-bold flex items-center justify-center text-base border-2 border-blue-300 shadow-sm">
                                3
                            </div>
                            <h3 className="font-serif font-bold text-base text-blue-950">Handshake & Return</h3>
                            <p className="text-xs text-blue-800/80 leading-relaxed">
                                Meet locally for pickup, use the item responsibly, and return it clean on time to maintain your community trust score.
                            </p>
                        </div>
                    </div>
                </div>

                {/*=========================Bottom CTA Banner=========================*/}
                <div className="bg-blue-900 text-white rounded-2xl p-8 text-center space-y-4 border-2 border-blue-950 shadow-md">
                    <h2 className="text-2xl font-serif font-bold text-white">Have extra gear lying around?</h2>
                    <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl mx-auto leading-relaxed">
                        Put your unused lawnmowers, tents, or tools to work. Help a neighbor out while keeping track of your items safely.
                    </p>
                    <div className="pt-2">
                        <NavLink
                            to="/items"
                            className="inline-block px-6 py-3 bg-white text-blue-950 text-xs sm:text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
                        >
                            Explore Community Items
                        </NavLink>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;