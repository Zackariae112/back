import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  ClipboardDocumentCheckIcon, 
  UserGroupIcon, 
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  TruckIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import LogoutConfirmationModal from './LogoutConfirmationModal';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'yellow' },
    { name: 'Orders', href: '/orders', icon: ClipboardDocumentListIcon, color: 'blue' },
    { name: 'Assignments', href: '/assignments', icon: ClipboardDocumentCheckIcon, color: 'green' },
    { name: 'Delivery Persons', href: '/delivery-persons', icon: UserGroupIcon, color: 'orange' },
    { name: 'Logout', href: '/logout', icon: ArrowLeftOnRectangleIcon },
  ];

  // Accent color classes for each section
  const accentColors = {
    yellow: {
      bg: 'bg-yellow-400/20',
      text: 'text-yellow-400',
      border: 'border-yellow-400',
      shadow: 'shadow-yellow-400/40',
      icon: 'text-yellow-400',
      hover: 'hover:bg-yellow-400/10 hover:text-yellow-300',
    },
    blue: {
      bg: 'bg-blue-400/20',
      text: 'text-blue-400',
      border: 'border-blue-400',
      shadow: 'shadow-blue-400/40',
      icon: 'text-blue-400',
      hover: 'hover:bg-blue-400/10 hover:text-blue-300',
    },
    green: {
      bg: 'bg-green-400/20',
      text: 'text-green-400',
      border: 'border-green-400',
      shadow: 'shadow-green-400/40',
      icon: 'text-green-400',
      hover: 'hover:bg-green-400/10 hover:text-green-300',
    },
    orange: {
      bg: 'bg-orange-400/20',
      text: 'text-orange-400',
      border: 'border-orange-400',
      shadow: 'shadow-orange-400/40',
      icon: 'text-orange-400',
      hover: 'hover:bg-orange-400/10 hover:text-orange-300',
    },
  };

  // Get accent color based on current path
  const getAccentColor = () => {
    const path = location.pathname.split('/')[1];
    if (!path || path === 'dashboard') return 'yellow';
    if (path === 'orders') return 'blue';
    if (path === 'assignments') return 'green';
    if (path === 'delivery-persons') return 'orange';
    return 'yellow';
  };

  // Get gradient colors based on accent
  const getGradientColors = () => {
    const accent = getAccentColor();
    switch (accent) {
      case 'yellow':
        return 'from-yellow-400/10 to-yellow-600/10';
      case 'blue':
        return 'from-blue-400/10 to-blue-600/10';
      case 'green':
        return 'from-green-400/10 to-green-600/10';
      case 'orange':
        return 'from-orange-400/10 to-orange-600/10';
      default:
        return 'from-yellow-400/10 to-yellow-600/10';
    }
  };

  // Get icon color based on accent
  const getIconColor = () => {
    const accent = getAccentColor();
    return `text-${accent}-400`;
  };

  // Get border color based on accent
  const getBorderColor = () => {
    const accent = getAccentColor();
    return `border-${accent}-400/30`;
  };

  // Get shadow color based on accent
  const getShadowColor = () => {
    const accent = getAccentColor();
    return `shadow-${accent}-400/20`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const username = localStorage.getItem('username') || 'Admin';

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-gradient-to-br from-yellow-400/10 to-blue-400/10 dark:bg-gray-900/70 backdrop-blur-xl border-r border-gray-800/60 shadow-2xl scale-[1.01] rounded-r-3xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-4 py-2 
            bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-red-400/10 
            dark:bg-gray-900/70 backdrop-blur-xl 
            border-b border-orange-400/30 
            shadow-orange-400/20 shadow-2xl 
            scale-[1.01] rounded-br-3xl rounded-bl-2xl 
            transition-all duration-300 group hover:scale-105 hover:shadow-2xl">
            <TruckIcon className="h-7 w-7 mr-3 text-orange-400 drop-shadow animate-truck-wiggle transition-all duration-300" />
            <span className="relative text-xl font-extrabold bg-gradient-to-r from-orange-400 via-orange-600 to-red-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight select-none transition-all duration-300 logo-gradient-text">
              Delivery Manager
              <span className="absolute left-0 top-0 w-full h-full pointer-events-none logo-shine"></span>
            </span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              item.name === 'Logout' ? (
                <button
                  key={item.name}
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 
                    text-red-400 hover:text-red-300 hover:bg-red-900/30 
                    border border-red-500/30 hover:border-red-400/50
                    w-full text-left group"
                >
                  <item.icon className="h-5 w-5 mr-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">{item.name}</span>
                </button>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => {
                    const color = accentColors[item.color] || accentColors.blue;
                    return [
                      'group relative flex items-center px-4 py-3 transition-all duration-200 overflow-hidden',
                      isActive
                        ? `rounded-3xl ${color.bg} ${color.text} border-l-4 ${color.border} ${color.shadow} shadow-lg relative`
                        : 'rounded-lg text-gray-300 hover:shadow-lg',
                      // Always apply the color hover
                      color.hover,
                    ].join(' ');
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <item.icon
                    className={[
                      'h-5 w-5 shrink-0 mr-4 transition-all duration-200',
                      'group-hover:scale-110 group-active:scale-105',
                      item.color && accentColors[item.color] ? accentColors[item.color].icon : 'text-blue-400',
                      'group-hover:drop-shadow',
                    ].join(' ')}
                  />
                  <span className="font-medium truncate group-hover:translate-x-1 transition-transform duration-200">
                    {item.name}
                  </span>
                </NavLink>
              )
            ))}
          </nav>

          {/* User Profile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-4 border-t border-gray-700/50"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 shadow-lg group"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-lg group-hover:shadow-blue-400/20 transition-all duration-300"
              >
                <UserIcon className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-xs uppercase tracking-wide text-blue-400/80 font-semibold mb-0.5 block group-hover:text-red-300 transition-colors duration-300"
                >
                  Signed in as
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-sm font-bold text-gray-100 truncate group-hover:text-white transition-colors duration-300"
                >
                  {username}
                </motion.p>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ArrowLeftOnRectangleIcon 
                  className="h-5 w-5 text-red-400 hover:text-red-300 cursor-pointer transition-colors duration-300" 
                  onClick={() => setIsLogoutModalOpen(true)}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Sidebar; 