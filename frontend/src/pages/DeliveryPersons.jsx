import React, { useEffect, useState, useMemo, useRef } from 'react';
import { PlusIcon, XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import authFetch from '../utils/authFetch';


const DeliveryPersons = () => {
  const location = useLocation();
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    isAvailable: true
  });
  const [searchName, setSearchName] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const [toast, setToast] = useState(null);
  const tableBodyRef = useRef(null);

  useEffect(() => {
    fetchDeliveryPersons();
    if (location.state && location.state.openNew) {
      setSelectedPerson(null);
      setFormData({ name: '', phoneNumber: '', isAvailable: true });
      setIsModalOpen(true);
    }
  }, []);

  const fetchDeliveryPersons = () => {
    authFetch('/api/delivery-persons')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch delivery persons');
        return res.json();
      })
      .then((data) => {
        setDeliveryPersons(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedPerson ? `/api/delivery-persons/${selectedPerson.id}` : '/api/delivery-persons';
      const method = selectedPerson ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(selectedPerson ? 'Failed to update delivery person' : 'Failed to create delivery person');
      }

      setIsModalOpen(false);
      setSelectedPerson(null);
      setFormData({
        name: '',
        phoneNumber: '',
        isAvailable: true
      });
      fetchDeliveryPersons();
      showToast('Delivery person updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (personId) => {
    try {
      const response = await authFetch(`/api/delivery-persons/${personId}`, {
        method: 'DELETE',
      });

      if (response.status === 200) {
        setIsDeleteModalOpen(false);
        setSelectedPerson(null);
        fetchDeliveryPersons();
        showToast('Delivery person deleted successfully');
      } else if (response.status === 400) {
        throw new Error('Cannot delete delivery person: This person has active assignments');
      } else if (response.status === 404) {
        throw new Error('Delivery person not found');
      } else {
        throw new Error('Failed to delete delivery person');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setFormData({
      name: person.name,
      phoneNumber: person.phoneNumber,
      isAvailable: person.isAvailable
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getStatusBadge = (isAvailable) => {
    return isAvailable
      ? 'bg-green-500/10 text-green-500'
      : 'bg-red-500/10 text-red-500';
  };

  // Filtered delivery persons
  const filteredDeliveryPersons = useMemo(() => {
    return deliveryPersons.filter(person => {
      const matchesName = searchName ? person.name?.toLowerCase().includes(searchName.toLowerCase()) : true;
      const matchesAvailability = filterAvailability
        ? (filterAvailability === 'available' ? person.isAvailable : !person.isAvailable)
        : true;
      return matchesName && matchesAvailability;
    });
  }, [deliveryPersons, searchName, filterAvailability]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    const isActiveAssignmentError = error.includes('active assignments');
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
          <p className="font-medium">Error: {error}</p>
        </div>
        {isActiveAssignmentError && (
          <button
            onClick={() => {
              setError(null);
              setIsDeleteModalOpen(false);
              setSelectedPerson(null);
              fetchDeliveryPersons();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
          >
            Return
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 relative overflow-x-hidden bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl p-6 mt-6 animate-fadeInUp" style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)' }}>
      {/* Blurred background shapes */}
      <div className="absolute -top-24 -left-24 w-[400px] h-[400px] bg-gradient-to-br from-orange-500/30 via-amber-400/20 to-transparent rounded-full blur-3xl z-0 animate-fadeInUp" />
<div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-gradient-to-tr from-yellow-500/20 via-orange-400/10 to-transparent rounded-full blur-3xl z-0 animate-fadeInUp" />

      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-xl text-white font-semibold text-sm animate-fadeInUp ${toast.type === 'error' ? 'bg-red-500/90' : 'bg-blue-600/90'}`}>
          {toast.msg}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeInUp">
      <h1 className="text-2xl font-extrabold tracking-tight text-orange-300 drop-shadow-xl glow-delivery flex items-center gap-2">
  <span className="inline-block">
  <UserGroupIcon className="h-7 w-7 text-orange-400 animate-truck-wiggle drop-shadow" />
  </span>
  Delivery Persons
</h1>

        <button
          className="group relative flex items-center gap-2 px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 hover:text-orange-300 border border-orange-400/30 hover:border-orange-400/50 rounded-lg shadow-orange-400/20 shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
          onClick={() => {
            setSelectedPerson(null);
            setFormData({ name: '', phoneNumber: '', isAvailable: true });
            setIsModalOpen(true);
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <PlusIcon className="h-5 w-5 group-hover:text-orange-300 transition-colors duration-200" /> 
          <span className="relative z-10 group-hover:text-orange-300 transition-colors duration-200">New Delivery Person</span>
        </button>
      </div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-4 shadow animate-fadeInUp">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Availability</label>
          <select
            className="bg-gray-900 text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterAvailability}
            onChange={e => setFilterAvailability(e.target.value)}
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">Name</label>
          <input
            type="text"
            className="w-full bg-gray-900 text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by name..."
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
        </div>
      </div>
      {/* Table or Empty State */}
      {filteredDeliveryPersons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-lg animate-fadeInUp">
          <span className="text-6xl mb-4 animate-truck-wiggle"><UserGroupIcon className="h-7 w-7 text-orange-400 animate-truck-wiggle drop-shadow" /></span>
          <p className="text-gray-400 text-lg mb-4">No delivery persons found.</p>
          <button
            onClick={() => {
              setSelectedPerson(null);
              setFormData({ name: '', phoneNumber: '', isAvailable: true });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 border border-orange-400/30 rounded-lg shadow-orange-400/20 shadow-lg transition-all duration-300 hover:scale-105"
          >
            <PlusIcon className="h-5 w-5 group-hover:text-orange-300 transition-colors duration-200" /> Add your first delivery person
          </button>
        </div>
      ) : (
        <div className="bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-lg overflow-hidden animate-fadeInUp">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 rounded-xl overflow-hidden">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody ref={tableBodyRef} className="divide-y divide-gray-700">
                {filteredDeliveryPersons.map((person, idx) => (
                  <tr
                    key={person.id}
                    className="hover:bg-gray-700/40 transition-colors duration-150 animate-fadeInUp"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{person.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{person.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{person.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(person.isAvailable)}`}>
                        {person.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(person)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-400 hover:text-blue-200 bg-blue-500/10 rounded transition"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPerson(person);
                            setIsDeleteModalOpen(true);
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-200 bg-red-500/10 rounded transition"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-xl relative overflow-hidden"
          >
            {/* Magical background elements */}
            <motion.div 
              initial={{ x: -100, y: -100, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-32 -right-32 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" 
            />
            <motion.div 
              initial={{ x: 100, y: 100, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-32 -left-32 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl animate-pulse" 
              style={{ animationDelay: '1s' }} 
            />
            
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between mb-6 relative z-10"
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className="p-2 rounded-lg bg-orange-500/10 border border-orange-400/30"
                >
                  <UserGroupIcon className="h-6 w-6 text-orange-400" />
                </motion.div>
                <h2 className="text-xl font-semibold text-gray-100">
                  {selectedPerson ? 'Edit Delivery Person' : 'Add Delivery Person'}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPerson(null);
                  setFormData({ name: '', phoneNumber: '', isAvailable: true });
                }}
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </motion.div>

            <motion.form 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit} 
              className="space-y-4 relative z-10"
            >
              {['name', 'phoneNumber'].map((field, index) => (
                <motion.div 
                  key={field}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="group"
                >
                  <label className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-orange-400 transition-colors duration-200">
                    {field === 'name' ? 'Name' : 'Phone Number'}
                  </label>
                  <input
                    type={field === 'phoneNumber' ? 'tel' : 'text'}
                    value={formData[field] || ''}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 group-hover:border-orange-400/50"
                    required
                  />
                </motion.div>
              ))}

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-2 group"
              >
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-700/50 transition-all duration-300 group-hover:border-orange-400/50"
                />
                <label className="text-sm font-medium text-gray-300 group-hover:text-orange-400 transition-colors duration-200">Available</label>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex justify-end gap-3 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedPerson(null);
                    setFormData({ name: '', phoneNumber: '', isAvailable: true });
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-gray-100 transition-colors duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="group relative flex items-center gap-2 px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 hover:text-orange-300 border border-orange-400/30 hover:border-orange-400/50 rounded-lg shadow-orange-400/20 shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10 group-hover:text-orange-300 transition-colors duration-200">{selectedPerson ? 'Update' : 'Create'}</span>
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedPerson && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Delete Delivery Person</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete {selectedPerson.name}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedPerson(null);
                }}
                className="px-4 py-2 text-gray-300 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedPerson.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
      .glow-delivery {
    text-shadow:
      0 2px 4px rgba(253, 186, 116, 0.25),
      0 4px 8px rgba(251, 146, 60, 0.15),
      0 8px 16px rgba(234, 88, 12, 0.1);
  }
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
      `}</style>
    </div>
  );
};

export default DeliveryPersons;
  