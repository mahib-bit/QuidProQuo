import React from 'react';
import { Link } from 'react-router';
import { Package, ShieldCheck, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 w-full bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white border-t-4 border-double border-blue-300/40 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center font-serif text-sm font-bold border border-blue-200">
                ❖
              </div>
              <span className="font-serif font-bold text-xl text-white tracking-wider">
                QuidProQuo
              </span>
            </div>
            <p className="text-xs text-blue-200 leading-relaxed font-light">
              Empowering local communities to share equipment, tools, electronics, and household goods safely and sustainably.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-serif uppercase tracking-widest text-blue-200 bg-blue-900/90 px-3 py-1 rounded-full border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" /> Verified Network
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider border-b border-blue-800/80 pb-2">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-blue-200">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Home Page</span>
                </Link>
              </li>
              <li>
                <Link to="/items" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>All Listed Items</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Member Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Member Services */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider border-b border-blue-800/80 pb-2">
              Member Hub
            </h3>
            <ul className="space-y-2 text-xs text-blue-200">
              <li>
                <Link to="/my-requests" className="hover:text-white transition-colors">
                  Sent Requests
                </Link>
              </li>
              <li>
                <Link to="/incoming-requests" className="hover:text-white transition-colors">
                  Incoming Requests
                </Link>
              </li>
              <li>
                <Link to="/my-agreements" className="hover:text-white transition-colors">
                  Active Agreements
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Info */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider border-b border-blue-800/80 pb-2">
              Community
            </h3>
            <div className="space-y-2 text-xs text-blue-200">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span>Local Neighborhood Hubs</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span>support@quidproquo.com</span>
              </p>
              <div className="pt-2">
                <Link
                  to="/items"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-950 font-serif font-bold text-[11px] rounded-lg shadow-xs hover:bg-blue-50 transition-all border border-blue-200"
                >
                  <Package className="w-3.5 h-3.5 text-blue-900" />
                  <span>List an Item</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
          <p>© {new Date().getFullYear()} QuidProQuo. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built for sustainable local communities</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;