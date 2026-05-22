import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Shield, Mail, Lock, Store, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Clear messages when shifting modes
  useEffect(() => {
    setMessage(null);
  }, [isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showFeedback = (text, type = 'error') => {
    setMessage({ text, type });
    // Auto dismiss after 5s
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validation checks
    if (!formData.email || !formData.password) {
      setLoading(false);
      return showFeedback('Please fill out all mandatory fields.');
    }

    if (!isLogin && !formData.storeName) {
      setLoading(false);
      return showFeedback('Please choose a Store Name.');
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setLoading(false);
      return showFeedback('Passwords do not match.');
    }

    if (formData.password.length < 6) {
      setLoading(false);
      return showFeedback('Password must be at least 6 characters.');
    }

    try {
      if (isLogin) {
        // Handle Login
        const res = await api.auth.login({
          email: formData.email,
          password: formData.password,
        });
        if (res.success) {
          onAuthSuccess(res.data);
        }
      } else {
        // Handle Register
        const res = await api.auth.register({
          storeName: formData.storeName,
          email: formData.email,
          password: formData.password,
        });
        if (res.success) {
          onAuthSuccess(res.data);
        }
      }
    } catch (error) {
      showFeedback(error.message || 'Authentication request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-[#0b0f19]">
      
      {/* Background drifting glow blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] animate-drift-slow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-drift-slower pointer-events-none"></div>

      <div className="w-full max-w-lg z-10">
        
        {/* Logo and Headings */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/20 mb-4 animate-bounce">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            SmartStore AI
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base font-light">
            AI-powered E-commerce Admin & Store Suggestions Suite
          </p>
        </div>

        {/* Premium Card Surface */}
        <div className="glass-panel-neon rounded-3xl p-8 overflow-hidden relative">
          
          {/* Active indicator bar */}
          <div className="flex border-b border-gray-800 mb-8 relative">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-4 text-sm font-semibold tracking-wider transition-all duration-300 ${
                isLogin ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              STORE OWNER LOGIN
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-4 text-sm font-semibold tracking-wider transition-all duration-300 ${
                !isLogin ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              REGISTER FROM SCRATCH
            </button>
            {/* Sliding Underline Accent */}
            <div
              className={`absolute bottom-0 h-0.5 w-1/2 bg-gradient-to-r ${
                isLogin ? 'from-cyan-400 to-indigo-500 left-0' : 'from-indigo-500 to-cyan-400 left-1/2'
              } transition-all duration-300`}
            ></div>
          </div>

          {/* User Feedback Alerts */}
          {message && (
            <div
              className={`flex items-start gap-3 p-4 rounded-xl mb-6 text-sm border animate-fade-in ${
                message.type === 'error'
                  ? 'bg-red-500/10 border-red-500/20 text-red-300'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              ) : (
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form Setup */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Store Name input (Only shown for Signup/Register) */}
            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Store / Brand Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Store className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full bg-[#131926]/60 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-200"
                    placeholder="e.g. My Futuristic Store"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#131926]/60 border border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-200"
                  placeholder="name@store.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#131926]/60 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Password Confirm (Signup only) */}
            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Shield className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-[#131926]/60 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wider flex items-center justify-center gap-2 text-white shadow-lg transition-all duration-300 relative overflow-hidden group ${
                isLogin
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-cyan-500/20'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-indigo-500/20'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-45" />
                  {isLogin ? 'ENTER MANAGEMENT PANEL' : 'REGISTER STORE OWNER'}
                </>
              )}
            </button>
          </form>

          {/* Decorative design sparkles inside card */}
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}
