import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const roles = ["ADMIN"];

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState('ADMIN');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();
  const iconRef = useRef(null);

  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.classList.add('animate-bounce');
      setTimeout(() => {
        iconRef.current.classList.remove('animate-bounce');
      }, 1200);
    }
  }, [mode]);

  useEffect(() => {
    document.body.classList.add('bg-gradient-to-br', 'from-gray-900', 'via-gray-800', 'to-gray-900');
    return () => {
      document.body.classList.remove('bg-gradient-to-br', 'from-gray-900', 'via-gray-800', 'to-gray-900');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
          throw new Error('Invalid username or password');
        }
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        if (rememberMe) localStorage.setItem('rememberMe', 'true');
        else localStorage.removeItem('rememberMe');
        navigate('/dashboard');
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role: 'ADMIN' }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Registration failed');
        }
        setSuccess('Registration successful! You can now log in.');
        setMode('login');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.message || (mode === 'login' ? 'Login failed' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Blurred background shapes */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-blue-700/30 rounded-full blur-3xl z-0"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl z-0"
      />
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md mx-auto z-10"
      >
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="relative px-10 py-12 bg-white/10 dark:bg-gray-800/80 border-4 rounded-[2rem] shadow-xl backdrop-blur-2xl bg-clip-padding border-transparent transform hover:-rotate-1 hover:-translate-y-1 transition-all duration-300"
style={{
  boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
  borderImage: 'linear-gradient(135deg, #fbbf24, #fb7185, #8b5cf6) 1',
  transform: 'skewY(-2deg) rotate(-1deg)'
}}


        >
          {/* Shine effect */}
          <span className="absolute left-0 top-0 w-full h-full pointer-events-none shine-animate"></span>
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center mb-2"
          >
            <motion.span 
              ref={iconRef}
              className="inline-block mb-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mode === 'login' ? (
                <ArrowLeftOnRectangleIcon className="h-14 w-14 text-yellow-400 drop-shadow-lg animate-truck-wiggle group-hover:animate-wiggle" />
              ) : (
                <UserPlusIcon className="h-14 w-14 text-yellow-400 drop-shadow-lg animate-truck-wiggle group-hover:animate-wiggle" />
              )}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative text-2xl font-extrabold bg-gradient-to-r from-orange-400 via-orange-600 to-red-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight text-center logo-gradient-text"
            >
              {mode === 'login' ? 'Delivery Manager Login' : 'Register'}
              <span className="absolute left-0 top-0 w-full h-full pointer-events-none logo-shine"></span>
            </motion.h2>
          </motion.div>

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 text-red-400 p-2 rounded text-center text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-500/10 text-green-400 p-2 rounded text-center text-sm"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            <div className="group">
              <label className="block text-gray-300 mb-1 group-hover:text-yellow-400 transition-colors duration-200">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg bg-gray-900/50 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 group-hover:border-yellow-400/50"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="group">
              <label className="block text-gray-300 mb-1 group-hover:text-yellow-400 transition-colors duration-200">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-lg bg-gray-900/50 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 group-hover:border-yellow-400/50"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <label className="block text-gray-300 mb-1 group-hover:text-yellow-400 transition-colors duration-200">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900/50 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 group-hover:border-yellow-400/50"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </motion.div>
            )}
            {mode === 'login' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 group"
              >
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded bg-gray-700/50 transition-all duration-200 group-hover:border-yellow-400/50"
                />
                <label htmlFor="rememberMe" className="text-gray-300 text-sm group-hover:text-yellow-400 transition-colors duration-200">Remember Me</label>
              </motion.div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold transition-all duration-200 disabled:opacity-60 shadow-lg mt-2 relative overflow-hidden group"
            disabled={loading}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : null}
              {loading ? (mode === 'login' ? 'Logging in...' : 'Registering...') : (mode === 'login' ? 'Login' : 'Register')}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 group-hover:opacity-100 opacity-0 transition-opacity duration-200"></span>
          </motion.button>

          {/* Toggle Mode Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-2"
          >
            {mode === 'login' ? (
              <span className="text-gray-400">
                Don&apos;t have an account?{' '}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-yellow-400 font-bold hover:underline hover:text-yellow-300 transition"
                  onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                >
                  Register
                </motion.button>
              </span>
            ) : (
              <span className="text-gray-400">
                Already have an account?{' '}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-yellow-400 font-bold hover:underline hover:text-yellow-300 transition"
                  onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                >
                  Login
                </motion.button>
              </span>
            )}
          </motion.div>
        </motion.form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center mt-8 text-gray-400 text-sm select-none"
        >
          Powered by DeliverySys <span className="inline-block align-middle">🚚</span>
        </motion.div>
      </motion.div>
      {/* Animations */}
      <style>{`
        .animate-fadeInUp {
          animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-truck-wiggle {
          animation: truckWiggle 1.1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes truckWiggle {
          0% { transform: rotate(-8deg) scale(1.1); }
          20% { transform: rotate(8deg) scale(1.1); }
          40% { transform: rotate(-6deg) scale(1.1); }
          60% { transform: rotate(6deg) scale(1.1); }
          80% { transform: rotate(-2deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .logo-gradient-text {
          position: relative;
          display: inline-block;
        }
        .logo-shine::before {
          content: '';
          position: absolute;
          top: 0;
          left: -60%;
          width: 60%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .logo-gradient-text:hover .logo-shine::before {
          opacity: 1;
          animation: logo-shine-move 1.1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes logo-shine-move {
          0% { left: -60%; }
          100% { left: 110%; }
        }
        .shine-pill {
          position: relative;
          overflow: hidden;
        }
        .shine-animate::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -40%;
          width: 60%;
          height: 200%;
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-20deg);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .shine-pill:hover .shine-animate::before {
          opacity: 1;
          animation: shine-move 1.1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes shine-move {
          0% { left: -40%; }
          100% { left: 110%; }
        }
        .animate-wiggle {
          animation: wiggle 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes wiggle {
          0% { transform: rotate(-8deg) scale(1.08); }
          20% { transform: rotate(8deg) scale(1.08); }
          40% { transform: rotate(-6deg) scale(1.08); }
          60% { transform: rotate(6deg) scale(1.08); }
          80% { transform: rotate(-2deg) scale(1.08); }
          100% { transform: rotate(0deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Login; 