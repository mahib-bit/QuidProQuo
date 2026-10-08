import React from 'react';
import { useRouteError, NavLink, useNavigate } from 'react-router';
import { AlertTriangle, Home, ArrowLeft, ShieldAlert } from 'lucide-react';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    // Extract dynamic error status & message from React Router if available
    const status = error?.status || 404;
    const statusText = error?.statusText || 'Page Not Found';
    const errorMessage =
        error?.data?.message ||
        error?.message ||
        'The page you are looking for might have been removed, renamed, or is temporarily unavailable.';

    return (
        <div className="min-h-screen bg-slate-50/60 text-blue-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* Brand Header */}
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-serif tracking-wider uppercase">
                        <span>❖</span> Community Item Sharing <span>❖</span>
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-blue-950 tracking-tight">
                        Quid Pro Quo
                    </h1>
                </div>

                {/* Error Card */}
                <div className="bg-white border-4 border-double border-blue-900 rounded-3xl p-8 shadow-lg space-y-6">
                    {/* Error Icon Badge */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-700 shadow-xs">
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200 inline-block">
                            Error {status} • {statusText}
                        </span>
                        <h2 className="text-2xl font-serif font-bold text-blue-950 pt-2">
                            Something Went Wrong
                        </h2>
                        <p className="text-xs text-blue-800/80 leading-relaxed max-w-xs mx-auto">
                            {errorMessage}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t-2 border-blue-100 pt-6 space-y-3">
                        <NavLink
                            to="/"
                            className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            <Home className="w-4 h-4" />
                            <span>Return to Homepage</span>
                        </NavLink>

                        <button
                            onClick={() => navigate(-1)}
                            className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-blue-950 font-semibold text-xs rounded-xl transition-all border border-blue-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4 text-blue-700" />
                            <span>Go Back Previous Page</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Footer Note */}
                <div className="flex items-center justify-center gap-2 text-xs text-blue-800/70">
                    <ShieldAlert className="w-4 h-4 text-blue-600" />
                    <span>Need assistance? Contact neighborhood support</span>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;