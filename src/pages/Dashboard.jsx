import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon, Mail, Key, Shield, Package, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
    const { user, mongoUser, loading } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
                <div className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-blue-900/20 rounded-2xl shadow-sm text-blue-950 font-serif font-bold text-sm">
                    <span className="animate-spin text-blue-900">❖</span>
                    <span>Loading profile data...</span>
                </div>
            </div>
        );
    }

    const userInitial = mongoUser?.name ? mongoUser.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U';

    return (
        <div className="min-h-screen bg-slate-50/60 text-blue-950 font-sans py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Dashboard Banner Header */}
                <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-double border-blue-300/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white text-blue-950 font-serif font-bold text-2xl flex items-center justify-center shadow-md border-2 border-blue-200 shrink-0">
                            {userInitial}
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-serif uppercase tracking-widest text-blue-200 bg-blue-900/80 px-2.5 py-0.5 rounded-full border border-blue-400/30 inline-block">
                                Active Member
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                                {mongoUser?.name || 'Member Dashboard'}
                            </h1>
                            <p className="text-xs text-blue-200">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2.5 bg-blue-900/80 hover:bg-red-900/80 text-white text-xs font-semibold rounded-xl border border-blue-300/40 hover:border-red-300/50 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4 text-red-300" />
                        <span>Log Out</span>
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border-2 border-blue-900/15 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider block">My Listed Items</span>
                            <span className="text-xl font-serif font-bold text-blue-950">0 Items</span>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-blue-900/15 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider block">Active Borrows</span>
                            <span className="text-xl font-serif font-bold text-blue-950">0 Requests</span>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-blue-900/15 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center shrink-0">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider block">Trust Rating</span>
                            <span className="text-xl font-serif font-bold text-blue-950">Verified</span>
                        </div>
                    </div>
                </div>

                {/* Profile Information Box */}
                <div className="bg-white border-4 border-double border-blue-900 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-blue-100 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-900 font-serif">❖</span>
                            <h2 className="text-xl font-serif font-bold text-blue-950">Account & Profile Details</h2>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-sky-600" /> Synchronized
                        </span>
                    </div>

                    {mongoUser ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50/60 border border-blue-100 space-y-1">
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-500 uppercase">
                                    <UserIcon className="w-3.5 h-3.5 text-blue-700" />
                                    <span>Full Name</span>
                                </div>
                                <p className="text-sm font-semibold text-blue-950">{mongoUser.name}</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50/60 border border-blue-100 space-y-1">
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-500 uppercase">
                                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                                    <span>Email Address</span>
                                </div>
                                <p className="text-sm font-semibold text-blue-950">{mongoUser.email}</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50/60 border border-blue-100 space-y-1 md:col-span-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-500 uppercase">
                                    <Key className="w-3.5 h-3.5 text-blue-700" />
                                    <span>Firebase Identifier UID</span>
                                </div>
                                <p className="text-xs font-mono text-blue-900 break-all bg-white p-2 rounded-lg border border-blue-200/60">
                                    {mongoUser.firebaseUid || user?.uid}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-blue-700">No profile data sync found for this user.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;