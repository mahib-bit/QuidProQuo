import React, { useContext } from 'react';
import { NavLink } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';

//=========================Navbar Component=========================
const Navbar = () => {
    const { user } = useContext(AuthContext);

    //=========================Handle Logout=========================
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    //========================= NavLink Styling=========================
    const navLinkClass = ({ isActive }) =>
        `px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-md border ${
            isActive
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'text-blue-950 border-transparent hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900'
        }`;

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-4 border-double border-blue-900 shadow-md px-6 py-3 flex items-center justify-between">
            {/*=========================Brand=========================*/}
            <NavLink 
                to="/" 
                end 
                className="flex items-center gap-2 group"
            >
                {/* Traditional Gzhel Cobalt Motif Emblem */}
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-serif text-lg font-bold border-2 border-blue-200 group-hover:bg-blue-800 transition-colors">
                    ❖
                </div>
                <strong className="text-xl font-serif tracking-wider text-blue-900 group-hover:text-blue-700 transition-colors">
                    Quid Pro Quo
                </strong>
            </NavLink>

            {/*=========================Navigation Links=========================*/}
            <div className="flex items-center gap-2">
                <NavLink to="/" end className={navLinkClass}>
                    Home
                </NavLink>

                {user && (
                    <>
                        <NavLink to="/dashboard" className={navLinkClass}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/items" className={navLinkClass}>
                            Items
                        </NavLink>
                    </>
                )}
            </div>

            {/*=========================Authentication Links=========================*/}
            <div className="flex items-center gap-3">
                {!user && (
                    <>
                        <NavLink to="/login" className={navLinkClass}>
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
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-semibold text-blue-900 bg-white border-2 border-blue-900 rounded-md shadow-sm hover:bg-blue-900 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;