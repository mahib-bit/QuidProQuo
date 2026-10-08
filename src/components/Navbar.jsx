import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, LogOut, User } from 'lucide-react';

//=========================Navbar Component=========================
const Navbar = () => {
    const { user } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Toggle & Close Helpers for Mobile
    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    //=========================Handle Logout=========================
    const handleLogout = async () => {
        try {
            await signOut(auth);
            closeMobileMenu();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    //========================= NavLink Styling =========================
    const desktopNavLinkClass = ({ isActive }) =>
        `px-3.5 py-2 text-sm font-semibold transition-all duration-200 rounded-md border whitespace-nowrap ${
            isActive
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'text-blue-950 border-transparent hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900'
        }`;

    const mobileNavLinkClass = ({ isActive }) =>
        `block px-4 py-3 text-sm font-semibold rounded-xl border transition-all duration-200 ${
            isActive
                ? 'bg-blue-900 text-white border-blue-950 shadow-sm'
                : 'text-blue-950 bg-blue-50/50 border-blue-100 hover:bg-blue-100/70 hover:border-blue-200'
        }`;

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-4 border-double border-blue-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                
                {/*=========================Brand=========================*/}
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

                {/*=========================Desktop Navigation Links=========================*/}
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

                {/*=========================Desktop Auth Links=========================*/}
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
                                className="px-4 py-2 text-sm font-semibold text-blue-900 bg-white border-2 border-blue-900 rounded-md shadow-sm hover:bg-blue-900 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/*=========================Mobile Hamburger Button=========================*/}
                <button
                    onClick={toggleMobileMenu}
                    type="button"
                    className="md:hidden p-2 rounded-lg text-blue-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-900 border border-blue-200 transition-colors"
                    aria-label="Toggle Navigation Menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6 text-blue-900" />
                    ) : (
                        <Menu className="w-6 h-6 text-blue-900" />
                    )}
                </button>
            </div>

            {/*=========================Mobile Navigation Drawer=========================*/}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t-2 border-blue-100 bg-white/98 px-4 pt-3 pb-6 space-y-4 shadow-xl transition-all">
                    
                    {/* Logged in User Profile Info on Mobile */}
                    {user && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-blue-950">
                            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-blue-300">
                                {user.email ? user.email[0].toUpperCase() : <User className="w-4 h-4" />}
                            </div>
                            <div className="truncate">
                                <p className="font-bold text-xs text-blue-900">{user.displayName || 'Community Neighbor'}</p>
                                <p className="text-blue-700/80 text-[11px] truncate">{user.email}</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Items */}
                    <div className="space-y-2">
                        <NavLink to="/" end onClick={closeMobileMenu} className={mobileNavLinkClass}>
                            Home
                        </NavLink>

                        {user && (
                            <>
                                <NavLink to="/dashboard" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                                    Dashboard
                                </NavLink>
                                <NavLink to="/items" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                                    Items
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Authentication Actions */}
                    <div className="pt-3 border-t border-blue-100">
                        {!user ? (
                            <div className="grid grid-cols-2 gap-2">
                                <NavLink 
                                    to="/login" 
                                    onClick={closeMobileMenu} 
                                    className="py-2.5 text-center text-sm font-semibold text-blue-900 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                                >
                                    Login
                                </NavLink>
                                <NavLink 
                                    to="/register" 
                                    onClick={closeMobileMenu} 
                                    className="py-2.5 text-center text-sm font-semibold text-white bg-blue-900 rounded-xl shadow-sm hover:bg-blue-800 transition-colors"
                                >
                                    Register
                                </NavLink>
                            </div>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="w-full py-2.5 text-sm font-semibold text-blue-900 bg-blue-50 hover:bg-blue-900 hover:text-white border-2 border-blue-900 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xs"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        )}
                    </div>

                </div>
            )}
        </nav>
    );
};

export default Navbar;