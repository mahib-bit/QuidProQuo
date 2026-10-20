import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
import SwapRoomImg from '../assets/SwapRoom.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', result.user.email);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/60 text-blue-950 flex md:grid md:grid-cols-2 items-center justify-center p-4 sm:p-6 md:p-0 font-sans">
      
      {/* Left Side: Hidden on mobile, 50% split on desktop */}
      <div className="hidden md:flex bg-blue-50/70 p-8 lg:p-12 flex-col justify-between items-center relative min-h-screen border-r border-blue-100">
        
        {/* Brand Logo Header */}
        <div className="w-full flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-serif text-base font-bold">
            ❖
          </div>
          <strong className="text-xl font-serif tracking-wider text-blue-900">
            QuidProQuo
          </strong>
        </div>

        {/* Centered Image Asset & Caption */}
        <div className="my-auto py-6 text-center max-w-md space-y-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm max-h-[420px] flex items-center justify-center">
            <img 
              src={SwapRoomImg} 
              alt="SwapRoom Community Sharing" 
              className="w-full h-auto max-h-[380px] object-contain drop-shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-blue-950">
              Borrow local gear, share what you own
            </h2>
            <p className="text-xs text-blue-800/80 leading-relaxed max-w-xs mx-auto">
              Join neighbors in exchanging tools, outdoor gear, and household items safely.
            </p>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="w-full flex items-center justify-center gap-2 text-xs text-blue-900/70 font-medium">
          <ShieldCheck className="w-4 h-4 text-blue-800" />
          <span>Encrypted community verification network</span>
        </div>
      </div>

      {/* Right Side: Single-bordered card on mobile, 50% panel on desktop */}
      <div className="w-full max-w-md md:max-w-none md:min-h-screen p-6 sm:p-8 md:p-12 lg:p-20 bg-white border border-blue-900/20 rounded-3xl md:rounded-none md:border-none shadow-lg md:shadow-none flex flex-col justify-center space-y-6">
        
        {/* Header Section (Visible on ALL devices) */}
        <div className="space-y-2">
          {/* Mobile Brand Tag */}
          <div className="md:hidden flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center font-serif text-xs font-bold">
              ❖
            </div>
            <strong className="text-base font-serif tracking-wider text-blue-900">
              QuidProQuo
            </strong>
          </div>

          <div className="flex items-center gap-2 border-b-2 border-blue-100 pb-3">
            <LogIn className="w-5 h-5 text-blue-900 shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-blue-950">
              Welcome Back
            </h1>
          </div>
          <p className="text-xs text-blue-700">
            Sign in with your email to access your items and requests.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
            {error}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider">
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
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border-2 border-blue-900/20 focus:border-blue-900 rounded-xl text-xs text-blue-950 placeholder-blue-300 focus:outline-none focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border-2 border-blue-900/20 focus:border-blue-900 rounded-xl text-xs text-blue-950 placeholder-blue-300 focus:outline-none focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md border border-blue-950 flex items-center justify-center gap-2 group cursor-pointer disabled:cursor-not-allowed rounded-xl"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer Nav Link */}
        <div className="pt-4 border-t border-blue-100 text-center text-xs text-blue-700">
          Don't have an account?{' '}
          <NavLink to="/register" className="font-serif font-bold text-blue-900 hover:underline">
            Register here
          </NavLink>
        </div>

        {/* Mobile Verification Badge */}
        <div className="md:hidden flex items-center justify-center gap-2 text-xs text-blue-800/70 pt-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Protected with encrypted neighborhood verification</span>
        </div>

      </div>

    </div>
  );
};

export default Login;