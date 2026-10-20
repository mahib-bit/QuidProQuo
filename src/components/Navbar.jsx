import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, LogOut, User, Home, LayoutDashboard, Package } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeMobileMenu();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const desktopNavLinkClass = ({ isActive }) =>
    `px-3.5 py-2 text-sm font-semibold transition-all duration-200 rounded-md border whitespace-nowrap ${
      isActive
        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
        : 'text-blue-950 border-transparent hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900'
    }`;

  // Fixed mobile link class function to guarantee visible active highlight toggling
  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl border transition-all duration-200 ${
      isActive
        ? '!bg-blue-900 !text-white !border-blue-950 shadow-sm font-bold'
        : 'text-blue-950 bg-blue-50/50 border-blue-100 hover:bg-blue-100/70 hover:border-blue-200'
    }`;

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-double border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Trigger */}
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="md:hidden p-2 rounded-lg text-blue-900 hover:bg-blue-50 focus:outline-none border border-blue-200 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5 text-blue-900" />
            </button>

            {/* Brand Logo */}
            <NavLink 
              to="/" 
              end 
              onClick={closeMobileMenu}
              className="flex items-center gap-2 group shrink-0"
            >
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-serif text-lg font-bold border-2 border-blue-200 group-hover:bg-blue-800 transition-colors">
                ❖
              </div>
              <strong className="text-lg sm:text-xl font-serif tracking-wider text-blue-900 group-hover:text-blue-700 transition-colors">
                Quid Pro Quo
              </strong>
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink to="/" end className={desktopNavLinkClass}>
              Home
            </NavLink>

            {user && (
              <>
                <NavLink to="/dashboard" className={desktopNavLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/items" className={desktopNavLinkClass}>
                  Items
                </NavLink>
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {!user && (
              <>
                <NavLink to="/login" className={desktopNavLinkClass}>
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="px-4 py-2 text-sm font-semibold text-blue-900 bg-blue-50 border border-blue-900 rounded-md shadow-sm hover:bg-blue-900 hover:text-white transition-all duration-200"
                >
                  Register
                </NavLink>
              </>
            )}

            {user && (
              <div className="flex items-center gap-3">
                {user.email && (
                  <span className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full truncate max-w-[160px]">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-blue-900 bg-white border-2 border-blue-900 rounded-md shadow-sm hover:bg-blue-900 hover:text-white transition-all duration-200 focus:outline-none"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* Mobile Backdrop Overlay */}
      <div 
        onClick={closeMobileMenu}
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Mobile Slide-In Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[80%] max-w-xs bg-white border-r-4 border-double border-blue-900 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-blue-100 pb-4">
            <NavLink to="/" end onClick={closeMobileMenu} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center font-serif text-sm font-bold border border-blue-200">
                ❖
              </div>
              <span className="font-serif font-bold text-base text-blue-900">
                Quid Pro Quo
              </span>
            </NavLink>

            <button
              onClick={closeMobileMenu}
              className="p-1.5 rounded-lg text-blue-900 hover:bg-blue-50 border border-blue-200 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-blue-900" />
            </button>
          </div>

          {/* Mobile User Tag */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-blue-950">
              <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-blue-300">
                {user.email ? user.email[0].toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <p className="font-bold text-xs text-blue-900">{user.displayName || 'Community Neighbor'}</p>
                <p className="text-blue-700/80 text-[11px] truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Navigation Links inside Drawer */}
          <div className="space-y-2">
            <p className="text-[10px] font-serif uppercase tracking-widest text-blue-500 font-bold px-1 mb-2">
              Menu Navigation
            </p>

            <NavLink to="/" end onClick={closeMobileMenu} className={mobileNavLinkClass}>
              <Home className="w-4 h-4 shrink-0" />
              <span>Home</span>
            </NavLink>

            {user && (
              <>
                <NavLink to="/dashboard" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink to="/items" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                  <Package className="w-4 h-4 shrink-0" />
                  <span>Items</span>
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Drawer Auth Footer */}
        <div className="p-5 border-t border-blue-100 bg-slate-50/50">
          {!user ? (
            <div className="grid grid-cols-2 gap-2">
              <NavLink 
                to="/login" 
                onClick={closeMobileMenu} 
                className={({ isActive }) =>
                  `py-2.5 text-center text-xs font-semibold rounded-xl border transition-colors ${
                    isActive
                      ? 'bg-blue-900 text-white border-blue-950'
                      : 'text-blue-900 bg-white border-blue-200 hover:bg-blue-100'
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                onClick={closeMobileMenu} 
                className={({ isActive }) =>
                  `py-2.5 text-center text-xs font-semibold rounded-xl border transition-colors ${
                    isActive
                      ? 'bg-blue-900 text-white border-blue-950'
                      : 'text-white bg-blue-900 border-blue-950 hover:bg-blue-800'
                  }`
                }
              >
                Register
              </NavLink>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-2.5 text-xs font-semibold text-blue-900 bg-white hover:bg-blue-900 hover:text-white border-2 border-blue-900 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Account</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;