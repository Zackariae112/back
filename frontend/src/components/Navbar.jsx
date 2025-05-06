import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon, Bars3Icon, BellIcon, HomeIcon, ClipboardDocumentListIcon, ClipboardDocumentCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import authFetch from '../utils/authFetch';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unassignedCount, setUnassignedCount] = useState(0);

  // Fetch unassigned orders count
  useEffect(() => {
    const fetchCount = () => {
      authFetch('/api/orders/status/UnAssigned')
        .then(res => res.json())
        .then(data => setUnassignedCount(Array.isArray(data) ? data.length : 0))
        .catch(() => setUnassignedCount(0));
    };

    fetchCount(); // initial fetch

    // Set up polling every 1 second
    const interval = setInterval(fetchCount, 10000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);

  // Get current page title from path
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    if (path === 'delivery-persons') return 'Delivery Persons';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Get stick color based on page
  const getStickColor = () => {
    const path = location.pathname.split('/')[1];
    if (!path || path === 'dashboard') return 'bg-yellow-400 shadow-yellow-400/40';
    if (path === 'orders') return 'bg-blue-500 shadow-blue-400/40';
    if (path === 'assignments') return 'bg-green-400 shadow-green-400/40';
    if (path === 'delivery-persons') return 'bg-orange-400 shadow-orange-400/40';
    return 'bg-gray-400 shadow-gray-400/40';
  };

  // Get accent color for shadow and pulse
  const getAccentShadow = () => {
    const path = location.pathname.split('/')[1];
    if (!path || path === 'dashboard') return 'shadow-yellow-400/40 hover:shadow-yellow-400/60';
    if (path === 'orders') return 'shadow-blue-400/40 hover:shadow-blue-400/60';
    if (path === 'assignments') return 'shadow-green-400/40 hover:shadow-green-400/60';
    if (path === 'delivery-persons') return 'shadow-orange-400/40 hover:shadow-orange-400/60';
    return 'shadow-gray-400/40 hover:shadow-gray-400/60';
  };

  const getPulseClass = () => {
    const path = location.pathname.split('/')[1];
    if (!path || path === 'dashboard') return 'group-hover:animate-pulse-yellow';
    if (path === 'orders') return 'group-hover:animate-pulse-blue';
    if (path === 'assignments') return 'group-hover:animate-pulse-green';
    if (path === 'delivery-persons') return 'group-hover:animate-pulse-orange';
    return '';
  };

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-20 flex items-center justify-between px-8 py-2
      bg-gradient-to-br from-yellow-400/10 to-blue-400/10 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-800/60 shadow-2xl scale-[1.01] rounded-b-3xl transition-all duration-300">
      {/* Left section - App name and mobile menu button */}
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {/* Optionally, you can add a logo or icon here */}
        </div>
      </div>

      {/* Center section - Current page title */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center">
          <span className={`relative flex items-center px-5 py-2 rounded-full bg-gray-900/60 backdrop-blur-md border border-blue-900/30 text-lg font-bold text-white drop-shadow tracking-tight shadow-md transition-all duration-300 group focus-within:shadow-lg overflow-hidden shine-pill ${getAccentShadow()}`}>
            {(() => {
              const path = location.pathname.split('/')[1];
              if (!path || path === 'dashboard') {
                return (
                  <HomeIcon className={`w-6 h-6 mr-4 text-yellow-400 drop-shadow shadow-yellow-400/40 transition-all duration-200 group-hover:animate-wiggle group-focus-within:animate-wiggle group-hover:shadow-yellow-400/60 group-focus-within:shadow-yellow-400/60 ${getPulseClass()}`} />
                );
              }
              if (path === 'orders') {
                return (
                  <ClipboardDocumentListIcon className={`w-6 h-6 mr-4 text-blue-400 drop-shadow shadow-blue-400/40 transition-all duration-200 group-hover:animate-wiggle group-focus-within:animate-wiggle group-hover:shadow-blue-400/60 group-focus-within:shadow-blue-400/60 ${getPulseClass()}`} />
                );
              }
              if (path === 'assignments') {
                return (
                  <ClipboardDocumentCheckIcon className={`w-6 h-6 mr-4 text-green-400 drop-shadow shadow-green-400/40 transition-all duration-200 group-hover:animate-wiggle group-focus-within:animate-wiggle group-hover:shadow-green-400/60 group-focus-within:shadow-green-400/60 ${getPulseClass()}`} />
                );
              }
              if (path === 'delivery-persons') {
                return (
                  <UserGroupIcon className={`w-6 h-6 mr-4 text-orange-400 drop-shadow shadow-orange-400/40 transition-all duration-200 group-hover:animate-wiggle group-focus-within:animate-wiggle group-hover:shadow-orange-400/60 group-focus-within:shadow-orange-400/60 ${getPulseClass()}`} />
                );
              }
              return <span className={`inline-block w-7 h-2 rounded-full mr-4 transition-all duration-300 shadow-md ${getStickColor()}`}></span>;
            })()}
            {getPageTitle()}
            {/* Shine effect */}
            <span className="absolute left-0 top-0 w-full h-full pointer-events-none shine-animate"></span>
          </span>
        </div>
      </div>

      {/* Right section - Notification */}
      <div className="flex items-center space-x-4">
        <div className="relative group cursor-pointer">
          <BellIcon className="h-7 w-7 text-amber-400 group-hover:text-amber-300 group-hover:scale-110 drop-shadow transition-all duration-200 animate-bounce-once" />
          {unassignedCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg animate-pulse border-2 border-gray-900">
              {unassignedCount}
            </span>
          )}
          <div className="absolute right-0 mt-2 w-56 bg-gray-900/90 text-gray-200 rounded-xl shadow-lg p-4 text-sm hidden group-hover:block z-50 border border-blue-400/10 backdrop-blur-md">
            {unassignedCount > 0 ? (
              <span>You have <b>{unassignedCount}</b> unassigned order{unassignedCount > 1 ? 's' : ''}!</span>
            ) : (
              <span>All orders are assigned. 🎉</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 