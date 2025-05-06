import React, { useEffect, useState, useMemo, useRef } from 'react';
import { PlusIcon, PencilIcon, XMarkIcon, TrashIcon, CheckIcon, ClipboardDocumentCheckIcon, TruckIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import authFetch from '../utils/authFetch';


const STATUS_OPTIONS = [
  'Pending',
  'In Progress',
  'Out For Delivery',
  'Delivered',
  'Cancelled',
];

const Assignments = () => {
  const location = useLocation();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterPerson, setFilterPerson] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchClient, setSearchClient] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAssignment, setModalAssignment] = useState(null);
  const [modalStatus, setModalStatus] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // New Assignment modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newAssignmentOrderId, setNewAssignmentOrderId] = useState('');
  const [newAssignmentPersonId, setNewAssignmentPersonId] = useState('');
  const [newAssignmentLoading, setNewAssignmentLoading] = useState(false);
  const [newAssignmentError, setNewAssignmentError] = useState('');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [availablePersons, setAvailablePersons] = useState([]);

  // Delete assignment modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Cancel assignment modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const tableBodyRef = useRef(null);

  useEffect(() => {
    authFetch('/api/assignments')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch assignments');
        return res.json();
      })
      .then((data) => {
        setAssignments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    if (location.state && location.state.openNew) {
      setIsNewModalOpen(true);
      fetchAvailableOrdersAndPersons();
    }
  }, []);

  // Fetch available orders and persons for new assignment
  const fetchAvailableOrdersAndPersons = async () => {
    try {
      const [ordersRes, personsRes] = await Promise.all([
        authFetch('/api/orders/pending'),
        authFetch('/api/delivery-persons/available'),
      ]);
      if (!ordersRes.ok) throw new Error('Failed to fetch orders');
      if (!personsRes.ok) throw new Error('Failed to fetch delivery persons');
      const orders = await ordersRes.json();
      const persons = await personsRes.json();
      setAvailableOrders(orders);
      setAvailablePersons(persons);
    } catch (err) {
      setNewAssignmentError(err.message);
    }
  };

  // Unique delivery persons and statuses for filters
  const deliveryPersons = useMemo(() => {
    const names = assignments.map(a => a.deliveryPerson?.name).filter(Boolean);
    return Array.from(new Set(names));
  }, [assignments]);
  const statuses = useMemo(() => {
    const sts = assignments.map(a => a.status).filter(Boolean);
    return Array.from(new Set(sts.concat(STATUS_OPTIONS)));
  }, [assignments]);

  // Filtering logic
  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchesPerson = filterPerson ? a.deliveryPerson?.name === filterPerson : true;
      const matchesStatus = filterStatus ? a.status === filterStatus : true;
      const matchesClient = searchClient ? a.order?.clientName?.toLowerCase().includes(searchClient.toLowerCase()) : true;
      return matchesPerson && matchesStatus && matchesClient;
    });
  }, [assignments, filterPerson, filterStatus, searchClient]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    if (!status || typeof status !== 'string') return 'bg-gray-500/10 text-gray-500';
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'in progress':
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-500';
      case 'out for delivery':
        return 'bg-green-500/10 text-green-500';
      case 'delivered':
        return 'bg-green-500/10 text-green-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  // Modal handlers
  const openModal = (assignment) => {
    setModalAssignment(assignment);
    setModalStatus(assignment.status || 'Pending');
    setModalOpen(true);
    setModalError('');
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalAssignment(null);
    setModalStatus('');
    setModalLoading(false);
    setModalError('');
  };
  const saveModal = async () => {
    if (!modalAssignment) return;
    setModalLoading(true);
    setModalError('');
    try {
      const res = await authFetch(`/api/assignments/${modalAssignment.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: modalStatus }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to update status');
      }
      setAssignments(prev => prev.map(a =>
        a.id === modalAssignment.id ? { ...a, status: modalStatus } : a
      ));
      closeModal();
    } catch (err) {
      setModalError(err.message || 'Failed to update status');
    } finally {
      setModalLoading(false);
    }
  };

  // New Assignment modal handlers
  const openNewAssignmentModal = () => {
    setIsNewModalOpen(true);
    setNewAssignmentOrderId('');
    setNewAssignmentPersonId('');
    setNewAssignmentError('');
    fetchAvailableOrdersAndPersons();
  };
  const closeNewAssignmentModal = () => {
    setIsNewModalOpen(false);
    setNewAssignmentOrderId('');
    setNewAssignmentPersonId('');
    setNewAssignmentError('');
  };
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setNewAssignmentLoading(true);
    setNewAssignmentError('');
    try {
      const res = await authFetch(`/api/assignments?orderId=${newAssignmentOrderId}&deliveryPersonId=${newAssignmentPersonId}`, {
        method: 'POST',
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to create assignment');
      }
      // Refresh assignments list
      const assignmentsRes = await authFetch('/api/assignments');
      setAssignments(await assignmentsRes.json());
      closeNewAssignmentModal();
      showToast('Assignment created!');
    } catch (err) {
      setNewAssignmentError(err.message || 'Failed to create assignment');
    } finally {
      setNewAssignmentLoading(false);
    }
  };

  // Delete assignment modal handlers
  const openDeleteModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsDeleteModalOpen(true);
    setDeleteError('');
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAssignment(null);
    setDeleteError('');
  };
  const handleDeleteAssignment = async () => {
    if (!selectedAssignment) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await authFetch(`/api/assignments/${selectedAssignment.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to delete assignment');
      }
      // Refresh assignments list
      const assignmentsRes = await authFetch('/api/assignments');
      setAssignments(await assignmentsRes.json());
      closeDeleteModal();
      showToast('Assignment deleted!', 'error');
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete assignment');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cancel assignment modal handlers
  const openCancelModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsCancelModalOpen(true);
    setCancelError('');
  };
  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedAssignment(null);
    setCancelError('');
  };
  const handleCancelAssignment = async () => {
    if (!selectedAssignment) return;
    setCancelLoading(true);
    setCancelError('');
    try {
      const res = await authFetch(`/api/assignments/${selectedAssignment.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to cancel assignment');
      }
      // Refresh assignments list
      const assignmentsRes = await authFetch('/api/assignments');
      setAssignments(await assignmentsRes.json());
      closeCancelModal();
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel assignment');
    } finally {
      setCancelLoading(false);
    }
  };

  // Mark as Delivered handler
  const handleMarkAsDelivered = async (assignment) => {
    try {
      const res = await authFetch(`/api/assignments/${assignment.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Delivered' }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to mark as delivered');
      }
      // Refresh assignments list
      const assignmentsRes = await authFetch('/api/assignments');
      setAssignments(await assignmentsRes.json());
    } catch (err) {
      alert(err.message || 'Failed to mark as delivered');
    }
  };

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          <p className="font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative overflow-x-hidden bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl p-6 mt-6 animate-fadeInUp" style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)' }}>
      {/* Blurred background shapes */}
      <div className="absolute -top-24 -left-24 w-[400px] h-[400px] bg-gradient-to-br from-green-500/30 via-green-400/20 to-transparent rounded-full blur-3xl z-0 animate-fadeInUp" />
<div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/20 via-emerald-400/10 to-transparent rounded-full blur-3xl z-0 animate-fadeInUp" />


      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-xl text-white font-semibold text-sm animate-fadeInUp ${toast.type === 'error' ? 'bg-red-500/90' : 'bg-blue-600/90'}`}>
          {toast.msg}
        </div>
      )}
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeInUp">
      <h1 className="text-2xl font-extrabold tracking-tight text-green-300 drop-shadow-xl glow-assignments flex items-center gap-2">
  <span className="inline-block">
    <ClipboardDocumentCheckIcon className="h-7 w-7 text-green-400 animate-truck-wiggle drop-shadow" />
  </span>
  Assignments

</h1>


        <button
          className="group relative flex items-center gap-2 px-4 py-2 bg-green-400/10 hover:bg-green-400/20 text-green-400 hover:text-green-300 border border-green-400/30 hover:border-green-400/50 rounded-lg shadow-green-400/20 shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
          onClick={openNewAssignmentModal}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <PlusIcon className="h-5 w-5 group-hover:text-green-300 transition-colors duration-200" /> 
          <span className="relative z-10 group-hover:text-green-300 transition-colors duration-200">New Assignment</span>
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-4 shadow animate-fadeInUp">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Delivery Person</label>
          <select
            className="bg-gray-900 text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filterPerson}
            onChange={e => setFilterPerson(e.target.value)}
          >
            <option value="">All</option>
            {deliveryPersons.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Status</label>
          <select
            className="bg-gray-900 text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">Client Name</label>
          <input
            type="text"
            className="w-full bg-gray-900 text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Search by client name..."
            value={searchClient}
            onChange={e => setSearchClient(e.target.value)}
          />
        </div>
      </div>

      {/* Table or Empty State */}
      {filteredAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-lg animate-fadeInUp">
          <span className="text-6xl mb-4 animate-truck-wiggle"><ClipboardDocumentCheckIcon className="h-7 w-15 text-green-400 animate-truck-wiggle drop-shadow" /></span>
          <p className="text-gray-400 text-lg mb-4">No assignments found.</p>
          <button
            onClick={openNewAssignmentModal}
            className="group flex items-center gap-2 px-4 py-2 bg-green-400/10 hover:bg-green-400/20 text-green-400 border border-green-400/30 rounded-lg shadow-green-400/20 shadow-lg transition-all duration-300 hover:scale-105"
          >
            <PlusIcon className="h-5 w-5 group-hover:text-green-300 transition-colors duration-200" /> Create your first assignment
          </button>
        </div>
      ) : (
        <div className="bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-lg overflow-hidden animate-fadeInUp">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 rounded-xl overflow-hidden">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Delivery Person</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assigned Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody ref={tableBodyRef} className="divide-y divide-gray-700">
                {filteredAssignments.map((assignment, idx) => (
                  <tr
                    key={assignment.id}
                    className="hover:bg-gray-700/40 transition-colors duration-150 animate-fadeInUp"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{assignment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{assignment.order?.clientName || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{assignment.deliveryPerson?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(assignment.assignedAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(assignment.status)}`}>{assignment.status ? assignment.status : 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right flex gap-2 justify-end">
                      <button
                        className="flex items-center gap-1 px-2 py-1 text-xs text-blue-400 hover:text-blue-200 bg-blue-500/10 rounded transition"
                        onClick={() => openModal(assignment)}
                        title="Update Status"
                      >
                        <PencilIcon className="h-4 w-4" /> Update
                      </button>
                      {assignment.status !== 'Delivered' && assignment.status !== 'Cancelled' && (
                        <>
                          <button
                            className="flex items-center gap-1 px-2 py-1 text-xs text-green-500 hover:text-green-300 bg-green-500/10 rounded transition"
                            onClick={() => handleMarkAsDelivered(assignment)}
                            title="Mark as Delivered"
                          >
                            <CheckIcon className="h-4 w-4" /> Delivered
                          </button>
                          <button
                            className="flex items-center gap-1 px-2 py-1 text-xs text-yellow-500 hover:text-yellow-300 bg-yellow-500/10 rounded transition"
                            onClick={() => openCancelModal(assignment)}
                            title="Cancel Assignment"
                          >
                            <XMarkIcon className="h-4 w-4" /> Cancel
                          </button>
                        </>
                      )}
                      <button
                        className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-200 bg-red-500/10 rounded transition"
                        onClick={() => openDeleteModal(assignment)}
                        title="Delete Assignment"
                      >
                        <TrashIcon className="h-4 w-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {modalOpen && (
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
              className="absolute -top-32 -right-32 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" 
            />
            <motion.div 
              initial={{ x: 100, y: 100, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-32 -left-32 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse" 
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
                  className="p-2 rounded-lg bg-green-500/10 border border-green-400/30"
                >
                  <TruckIcon className="h-6 w-6 text-green-400" />
                </motion.div>
                <h2 className="text-xl font-semibold text-gray-100">Update Status</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                disabled={modalLoading}
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 relative z-10"
            >
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="group"
              >
                <label className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-green-400 transition-colors duration-200">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 group-hover:border-green-400/50"
                  value={modalStatus}
                  onChange={e => setModalStatus(e.target.value)}
                  disabled={modalLoading}
                >
                  {STATUS_OPTIONS.filter(opt => {
                    const lower = opt.toLowerCase();
                    return lower !== 'in progress' && lower !== 'delivered' && lower !== 'cancelled';
                  }).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </motion.div>

              {modalError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {modalError}
                </motion.p>
              )}

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
                  onClick={closeModal}
                  disabled={modalLoading}
                  className="px-4 py-2 text-gray-300 hover:text-gray-100 transition-colors duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveModal}
                  disabled={modalLoading}
                  className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-400/30 rounded-lg shadow-green-400/20 shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  {modalLoading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-green-400 border-t-transparent rounded-full"></span>
                  ) : null}
                  {modalLoading ? 'Saving...' : 'Save'}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* New Assignment Modal */}
      {isNewModalOpen && (
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
              className="absolute -top-32 -right-32 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" 
            />
            <motion.div 
              initial={{ x: 100, y: 100, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-32 -left-32 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse" 
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
                  className="p-2 rounded-lg bg-green-500/10 border border-green-400/30"
                >
                  <TruckIcon className="h-6 w-6 text-green-400" />
                </motion.div>
                <h2 className="text-xl font-semibold text-gray-100">Assign Delivery</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsNewModalOpen(false);
                  setNewAssignmentOrderId('');
                  setNewAssignmentPersonId('');
                  setNewAssignmentError('');
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
              onSubmit={handleCreateAssignment} 
              className="space-y-4 relative z-10"
            >
              {['order', 'person'].map((field, index) => (
                <motion.div 
                  key={field}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="group"
                >
                  <label className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-green-400 transition-colors duration-200">
                    {field === 'order' ? 'Order' : 'Delivery Person'}
                  </label>
                  <select
                    value={
                      field === 'order'
                        ? newAssignmentOrderId || ''
                        : newAssignmentPersonId || ''
                    }                    
                    onChange={(e) => {
                      if (field === 'order') {
                        setNewAssignmentOrderId(e.target.value);
                      } else {
                        setNewAssignmentPersonId(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 group-hover:border-green-400/50"
                    required
                  >
                    <option value="">Select {field === 'order' ? 'Order' : 'Delivery Person'}</option>
                    {field === 'order' 
                      ? availableOrders.map(order => (
                          <option key={order.id} value={order.id}>
                            {order.clientName} - {order.deliveryAddress}
                          </option>
                        ))
                      : availablePersons.map(person => (
                          <option key={person.id} value={person.id}>
                            {person.name} - {person.phoneNumber}
                          </option>
                        ))
                    }
                  </select>
                </motion.div>
              ))}

              {newAssignmentError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {newAssignmentError}
                </motion.p>
              )}

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
                    setIsNewModalOpen(false);
                    setNewAssignmentOrderId('');
                    setNewAssignmentPersonId('');
                    setNewAssignmentError('');
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-gray-100 transition-colors duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="group relative flex items-center gap-2 px-4 py-2 bg-green-400/10 hover:bg-green-400/20 text-green-400 hover:text-green-300 border border-green-400/30 hover:border-green-400/50 rounded-lg shadow-green-400/20 shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10 group-hover:text-green-300 transition-colors duration-200">Assign</span>
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-xs relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={closeDeleteModal}
              title="Close"
              disabled={deleteLoading}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-100 mb-4">Delete Assignment</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete assignment #{selectedAssignment.id} for {selectedAssignment.order?.clientName}?
            </p>
            {deleteError && (
              <div className="mb-2 text-sm text-red-400 bg-red-500/10 rounded px-2 py-1">{deleteError}</div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >Cancel</button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
                onClick={handleDeleteAssignment}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : null}
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-xs relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={closeCancelModal}
              title="Close"
              disabled={cancelLoading}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-100 mb-4">Cancel Assignment</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel assignment #{selectedAssignment.id} for {selectedAssignment.order?.clientName}?
            </p>
            {cancelError && (
              <div className="mb-2 text-sm text-red-400 bg-red-500/10 rounded px-2 py-1">{cancelError}</div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                onClick={closeCancelModal}
                disabled={cancelLoading}
              >Cancel</button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition flex items-center gap-2"
                onClick={handleCancelAssignment}
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
      .glow-assignments {
    text-shadow:
      0 2px 4px rgba(110, 231, 183, 0.25),
      0 4px 8px rgba(16, 185, 129, 0.15),
      0 8px 16px rgba(5, 150, 105, 0.1);
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

export default Assignments;
  