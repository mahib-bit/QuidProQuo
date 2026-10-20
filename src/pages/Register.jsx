import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { authenticatedFetch } from '../api/api';
import {
  User,
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import SwapRoomImg from '../assets/SwapRoom.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const response = await authenticatedFetch(result.user, '/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: result.user.email,
          photo: result.user.photoURL || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user record in backend');
      }

      const data = await response.json();
      console.log('MongoDB User created:', data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
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
              Join Your Local Community Network
            </h2>
            <p className="text-xs text-blue-800/80 leading-relaxed max-w-xs mx-auto">
              Start sharing and borrowing gear with nearby neighbors with zero hidden fees.
            </p>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="w-full flex items-center justify-center gap-2 text-xs text-blue-900/70 font-medium">
          <ShieldCheck className="w-4 h-4 text-blue-800" />
          <span>Free membership • Encrypted verification network</span>
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
            <UserPlus className="w-5 h-5 text-blue-900 shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-blue-950">
              Create Account
            </h1>
          </div>
          <p className="text-xs text-blue-700">
            Join your neighborhood sharing network today.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
            {error}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider">
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
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border-2 border-blue-900/20 focus:border-blue-900 rounded-xl text-xs text-blue-950 placeholder-blue-300 focus:outline-none focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Email Address Field */}
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
                placeholder="At least 6 characters"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border-2 border-blue-900/20 focus:border-blue-900 rounded-xl text-xs text-blue-950 placeholder-blue-300 focus:outline-none focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Registration Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md border border-blue-950 flex items-center justify-center gap-2 group cursor-pointer disabled:cursor-not-allowed rounded-xl mt-2"
          >
            <span>
              {isSubmitting ? 'Registering...' : 'Complete Registration'}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer Nav Link */}
        <div className="pt-4 border-t border-blue-100 text-center text-xs text-blue-700">
          Already have an account?{' '}
          <NavLink
            to="/login"
            className="font-serif font-bold text-blue-900 hover:underline"
          >
            Sign in
          </NavLink>
        </div>

        {/* Mobile Verification Badge */}
        <div className="md:hidden flex items-center justify-center gap-2 text-xs text-blue-800/70 pt-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Free membership • Zero hidden rental fees</span>
        </div>

      </div>

    </div>
  );
};

export default Register;