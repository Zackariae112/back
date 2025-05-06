import React, { useEffect, useState, useMemo, useRef } from 'react';
import { PlusIcon, XMarkIcon, PencilIcon, TrashIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import authFetch from '../utils/authFetch';


const Orders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    deliveryAddress: '',
    orderDate: '',
    status: 'UnAssigned',
    createdAt: new Date().toISOString()
  });
  const [searchClient, setSearchClient] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Cancel order modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const tableBodyRef = useRef(null);

  useEffect(() => {
    fetchOrders();
    if (location.state && location.state.openNew) {
      setIsModalOpen(true);
    }
  }, []);

  const fetchOrders = () => {
    authFetch('/api/orders')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setFormData({
      clientName: order.clientName,
      deliveryAddress: order.deliveryAddress,
      orderDate: order.orderDate.split('T')[0],
      status: order.status,
      createdAt: order.createdAt
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (orderId) => {
    try {
      const response = await authFetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        setIsDeleteModalOpen(false);
        setSelectedOrder(null);
        fetchOrders();
        showToast('Order deleted!', 'error');
      } else if (response.status === 400) {
        throw new Error('Cannot delete order: This order has active assignments');
      } else if (response.status === 404) {
        throw new Error('Order not found');
      } else {
        throw new Error('Failed to delete order');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedOrder ? `/api/orders/${selectedOrder.id}` : '/api/orders';
      const method = selectedOrder ? 'PUT' : 'POST';
      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(selectedOrder ? 'Failed to update order' : 'Failed to create order');
      }
      setIsModalOpen(false);
      setSelectedOrder(null);
      setFormData({
        clientName: '',
        deliveryAddress: '',
        orderDate: '',
        status: 'UnAssigned',
        createdAt: new Date().toISOString()
      });
      fetchOrders();
      showToast(selectedOrder ? 'Order updated!' : 'Order created!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    if (!status || typeof status !== 'string') {
      return 'bg-gray-500/10 text-gray-500';
    }
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
        case 'pending assignment':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'assigned':
        return 'bg-green-500/10 text-green-500';
      case 'unassigned':
        return 'bg-red-500/10 text-red-500';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500';
        case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesClient = searchClient ? order.clientName?.toLowerCase().includes(searchClient.toLowerCase()) : true;
      const matchesStatus = filterStatus ? (order.status && order.status.toLowerCase() === filterStatus.toLowerCase()) : true;
      return matchesClient && matchesStatus;
    });
  }, [orders, searchClient, filterStatus]);

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
    setCancelError('');
  };
  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedOrder(null);
    setCancelError('');
  };
  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    setCancelLoading(true);
    setCancelError('');
    try {
      const response = await authFetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedOrder, status: 'Cancelled' }),
      });
      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }
      closeCancelModal();
      fetchOrders();
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelLoading(false);
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
              setSelectedOrder(null);
              fetchOrders();
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
<div className="min-h-fit space-y-6 relative overflow-x-hidden bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl p-8 mt-6 animate-fadeInUp w-full max-w-7xl mx-auto">

      {/* Blurred background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-700/30 rounded-full blur-3xl z-0 animate-fadeInUp" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl z-0 animate-fadeInUp" />
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-xl text-white font-semibold text-sm animate-fadeInUp ${toast.type === 'error' ? 'bg-red-500/90' : 'bg-blue-600/90'}`}>
          {toast.msg}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeInUp">
      <h1 className="text-2xl font-extrabold tracking-tight text-blue-300 drop-shadow-xl glow-orders flex items-center gap-2">
  <span className="inline-block">
    <ClipboardDocumentListIcon className="h-7 w-7 text-blue-400 animate-truck-wiggle drop-shadow" />
  </span>
  Orders
</h1>

<style>{`
  .glow-orders {
    text-shadow:
      0 2px 4px rgba(147, 197, 253, 0.25),
      0 4px 8px rgba(96, 165, 250, 0.15),
      0 8px 16px rgba(59, 130, 246, 0.1);
  }
`}</style>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2 px-4 py-2 bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/50 rounded-lg shadow-blue-400/20 shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
          onClick={() => {
            setSelectedOrder(null);
            setFormData({ clientName: '', deliveryAddress: '', status: 'UnAssigned' });
            setIsModalOpen(true);
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <PlusIcon className="h-5 w-5 group-hover:text-blue-300 transition-colors duration-200" /> 
          <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-200">New Order</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-4 shadow animate-fadeInUp">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Status</label>
          <select
            className="bg-gray-900 text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="UnAssigned">UnAssigned</option>
            <option value="Assigned">Assigned</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">Client Name</label>
          <input
            type="text"
            className="w-full bg-gray-900 text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by client name..."
            value={searchClient}
            onChange={e => setSearchClient(e.target.value)}
          />
        </div>
      </div>

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
            className="bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl px-6 py-1.5 w-full max-w-md shadow-xl relative overflow-hidden max-h-[70vh] flex flex-col"
            >
            {/* Magical background elements */}
            <motion.div 
              initial={{ x: -100, y: -100, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" 
            />
            <motion.div 
              initial={{ x: 100, y: 100, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" 
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
                  className="p-2 rounded-lg bg-blue-500/10 border border-blue-400/30"
                >
                  <ClipboardDocumentListIcon className="h-6 w-6 text-blue-400" />
                </motion.div>
                <h2 className="text-xl font-semibold text-gray-100">
                  {selectedOrder ? 'Edit Order' : 'Create New Order'}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedOrder(null);
                  setFormData({
                    clientName: '',
                    deliveryAddress: '',
                    orderDate: '',
                    status: 'UnAssigned',
                    createdAt: new Date().toISOString()
                  });
                }}
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </motion.div>

            <motion.form 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              onSubmit={handleSubmit} 
              className="space-y-4 relative z-10"
            >
              {['clientName', 'deliveryAddress', 'orderDate',].map((field, index) => (
                <motion.div 
                  key={field}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.1 + index * 0.05,
                    duration: 0.2,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="group"
                >
                  <label className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-blue-400 transition-colors duration-200">
                    {field === 'clientName' ? 'Client Name' : 
                     field === 'deliveryAddress' ? 'Delivery Address' : 
                     field === 'orderDate' ? 'Order Date' : 'Status'}
                  </label>
                  {field === 'deliveryAddress' ? (
                    <textarea
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-400/50"
                      required
                      rows="1"
                    />
                  ) : field === 'status' ? (
                    <select
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-400/50"
                    >
                      <option value="UnAssigned">UnAssigned</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Out For Delivery">Out For Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <input
                      type={field === 'orderDate' ? 'date' : 'text'}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-400/50"
                      required
                    />
                  )}
                </motion.div>
              ))}

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.3,
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="flex justify-end gap-3 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedOrder(null);
                    setFormData({
                      clientName: '',
                      deliveryAddress: '',
                      orderDate: '',
                      status: 'UnAssigned',
                      createdAt: new Date().toISOString()
                    });
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-gray-100 transition-colors duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="group relative flex items-center gap-2 px-4 py-2 bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/50 rounded-lg shadow-blue-400/20 shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-200">{selectedOrder ? 'Update' : 'Create Order'}</span>
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeInUp">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Delete Order</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete order #{selectedOrder.id} for {selectedOrder.clientName}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 text-gray-300 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedOrder.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeInUp">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Cancel Order</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel order #{selectedOrder.id} for {selectedOrder.clientName}?
            </p>
            {cancelError && (
              <div className="mb-2 text-sm text-red-400 bg-red-500/10 rounded px-2 py-1">{cancelError}</div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 text-gray-300 hover:text-gray-200"
                disabled={cancelLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200"
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-lg animate-fadeInUp">
          <span className="text-6xl mb-4 animate-truck-wiggle"><ClipboardDocumentListIcon className="h-7 w-7 text-blue-400 animate-truck-wiggle drop-shadow" /></span>
          <p className="text-gray-400 text-lg mb-4">No orders found.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-2 px-4 py-2 bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 border border-blue-400/30 rounded-lg shadow-blue-400/20 shadow-lg transition-all duration-300 hover:scale-105"
          >
            <PlusIcon className="h-5 w-5 group-hover:text-blue-300 transition-colors duration-200" /> Create your first order
          </button>
        </div>
      ) : (
        <div className="bg-white/10 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-lg overflow-hidden animate-fadeInUp">
         <div className="overflow-x-auto max-h-[400px] overflow-y-auto transition-all duration-300 ease-in-out">
  <table className="min-w-full divide-y divide-gray-700 rounded-xl overflow-hidden">

              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody ref={tableBodyRef} className="divide-y divide-gray-700">
                {filteredOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-700/40 transition-colors duration-150 animate-fadeInUp"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="max-w-xs truncate">{order.deliveryAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(order.orderDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full relative ${getStatusColor(order.status)}`}>{order.status && typeof order.status === 'string' ? order.status : 'Unknown'}
                        {order.status && order.status.toLowerCase() === 'unassigned' && (
                          <span className="absolute top-1 right-1 h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(order)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-400 hover:text-blue-200 bg-blue-500/10 rounded transition transform hover:scale-105 focus:ring-2 focus:ring-blue-500"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDeleteModalOpen(true);
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-200 bg-red-500/10 rounded transition transform hover:scale-105 focus:ring-2 focus:ring-red-500"
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
      `}</style>
    </div>
  );
};

export default Orders;
