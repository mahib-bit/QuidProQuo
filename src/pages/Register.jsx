import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { authenticatedFetch } from '../api/api';
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            const response = await authenticatedFetch(
                result.user,
                '/users',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: result.user.email,
                        photo: result.user.photoURL || ''
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to create user record in backend');
            }

            const data = await response.json();
            console.log('MongoDB User created:', data);
        } catch (err) {
            console.error('Registration failed:', err);
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/60 text-blue-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-serif tracking-wider uppercase">
                        <span>❖</span> Community Item Sharing <span>❖</span>
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-blue-950 tracking-tight">Quid Pro Quo</h1>
                    <p className="text-xs text-blue-700">Join your neighborhood sharing network</p>
                </div>

                {/* Form Card */}
                <div className="bg-white border-4 border-double border-blue-900 rounded-3xl p-8 shadow-lg space-y-6">
                    <div className="flex items-center gap-2 border-b-2 border-blue-100 pb-3">
                        <UserPlus className="w-5 h-5 text-blue-900" />
                        <h2 className="text-xl font-serif font-bold text-blue-950">Create Account</h2>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-blue-900 uppercase tracking-wider">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Alex Doe"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-blue-200 rounded-xl text-xs text-blue-950 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-blue-900 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-blue-200 rounded-xl text-xs text-blue-950 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-blue-900 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-blue-200 rounded-xl text-xs text-blue-950 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer mt-2"
                        >
                            <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Footer Nav */}
                    <div className="pt-4 border-t border-blue-100 text-center text-xs text-blue-700">
                        Already have an account?{' '}
                        <NavLink to="/login" className="font-bold text-blue-900 hover:underline">
                            Sign in
                        </NavLink>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-blue-800/70">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Free membership • Zero hidden rental fees</span>
                </div>
            </div>
        </div>
    );
};

export default Register;