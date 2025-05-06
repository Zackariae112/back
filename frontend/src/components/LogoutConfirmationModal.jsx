import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-red-500/30"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center space-y-6">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 20, stiffness: 300 }}
              className="p-4 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30"
            >
              <ArrowLeftOnRectangleIcon className="h-12 w-12 text-red-400" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-100 text-center"
            >
              Are you sure you want to logout?
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-center"
            >
              You'll need to log back in to access your account.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 w-full"
            >
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-gray-100 transition-all duration-200 border border-gray-600/50 hover:border-gray-500/50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200 border border-red-500/50 hover:border-red-400/50 shadow-lg hover:shadow-red-500/20"
              >
                Logout
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LogoutConfirmationModal; 