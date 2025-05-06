import React, { useEffect, useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import authFetch from '../utils/authFetch';
import {
  ClipboardDocumentListIcon,
  TruckIcon,
  UserGroupIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';



const Dashboard = () => {
  console.log("🧠 Dashboard component mounted");
  const [stats, setStats] = useState({
    totalOrders: 0,
    unassignedOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalAssignments: 0,
    activeAssignments: 0,
    totalDeliveryPersons: 0,
    availableDeliveryPersons: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 


  useEffect(() => {
    
    const fetchStats = async () => {
      try {
        const [ordersRes, assignmentsRes, deliveryPersonsRes, unassignedRes, completedRes, cancelledRes, activeAssignmentsRes, availablePersonsRes, recentAssignmentsRes] = await Promise.all([
          authFetch('/api/orders/count'),
          authFetch('/api/assignments/count'),
          authFetch('/api/delivery-persons/count'),
          authFetch('/api/orders/status/UnAssigned'),
          authFetch('/api/orders/status/Completed'),
          authFetch('/api/orders/status/Cancelled'),
          authFetch('/api/assignments/status/Out For Delivery'),
          authFetch('/api/delivery-persons/available'),
          authFetch('/api/assignments'),
        ]);

        if ([ordersRes, assignmentsRes, deliveryPersonsRes, unassignedRes, completedRes, cancelledRes, activeAssignmentsRes, availablePersonsRes, recentAssignmentsRes].some(res => !res.ok)) {
          console.log("Responses:", {
            ordersRes: ordersRes.ok,
            assignmentsRes: assignmentsRes.ok,
            deliveryPersonsRes: deliveryPersonsRes.ok,
            unassignedRes: unassignedRes.ok,
            completedRes: completedRes.ok,
            cancelledRes: cancelledRes.ok,
            activeAssignmentsRes: activeAssignmentsRes.ok,
            availablePersonsRes: availablePersonsRes.ok,
            recentAssignmentsRes: recentAssignmentsRes.ok,
          });
          
          throw new Error('Failed to fetch statistics');
        }

        const [ordersCount, assignmentsCount, deliveryPersonsCount, unassignedOrders, completedOrders, cancelledOrders, activeAssignments, availablePersons, allAssignments] = await Promise.all([
          ordersRes.json(),
          assignmentsRes.json(),
          deliveryPersonsRes.json(),
          unassignedRes.json(),
          completedRes.json(),
          cancelledRes.json(),
          activeAssignmentsRes.json(),
          availablePersonsRes.json(),
          recentAssignmentsRes.json(),
        ]);

        setStats({
          totalOrders: ordersCount,
          unassignedOrders: unassignedOrders.length,
          completedOrders: completedOrders.length,
          cancelledOrders: cancelledOrders.length,
          totalAssignments: assignmentsCount,
          activeAssignments: activeAssignments.length,
          totalDeliveryPersons: deliveryPersonsCount,
          availableDeliveryPersons: availablePersons.length,
        });
        setRecentAssignments(
          allAssignments
            .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))
            .slice(0, 5)
        );
        setLoading(false);
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError(err.message);
        setLoading(false);
      }
      
    };
    fetchStats();
  }, []);

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

  const StatCard = ({ title, value, icon: Icon, color, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`backdrop-blur-lg bg-white/10 dark:bg-gray-800/60 border border-gray-700 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl ${color}`}
      style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-1">{title}</p>
          <p className="text-3xl font-extrabold text-gray-100 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-gradient-to-br from-blue-900/60 to-blue-700/40 shadow-lg">
          <Icon className="h-7 w-7 text-yellow-400 drop-shadow animate-truck-wiggle" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 mb-2 mt-8 animate-fadeInUp relative z-10">
        <div className="p-2 bg-yellow-500/10 border border-yellow-400/20 rounded-xl shadow-yellow-400/30 shadow-lg animate-pulse">
          <ChartBarIcon className="h-8 w-8 text-yellow-400 drop-shadow-md" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-yellow-300 drop-shadow-xl glow-soft">
          Dashboard Overview
        </h1>
      </div>
  
      <style>{`
        .glow-soft {
          text-shadow:
            0 2px 4px rgba(255, 235, 135, 0.25),
            0 4px 8px rgba(255, 215, 100, 0.15),
            0 8px 16px rgba(255, 200, 50, 0.1);
        }
      `}</style>
  
  


      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ClipboardDocumentListIcon} color="" index={0} />
        <StatCard title="Unassigned Orders" value={stats.unassignedOrders} icon={ArrowPathIcon} color="" index={1} />
        <StatCard title="Active Assignments" value={stats.activeAssignments} icon={TruckIcon} color="" index={2} />
        <StatCard title="Completed Orders" value={stats.completedOrders} icon={CheckCircleIcon} color="" index={3} />
        <StatCard title="Cancelled Orders" value={stats.cancelledOrders} icon={XCircleIcon} color="" index={4} />
        <StatCard title="Available Delivery Persons" value={stats.availableDeliveryPersons} icon={UserIcon} color="" index={5} />
        <StatCard title="Total Delivery Persons" value={stats.totalDeliveryPersons} icon={UserGroupIcon} color="" index={6} />
        <StatCard title="Total Assignments" value={stats.totalAssignments} icon={TruckIcon} color="" index={7} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mt-4 animate-fadeInUp">
        <Link 
          to="/orders" 
          state={{ openNew: true }} 
          className="group relative flex items-center gap-2 px-4 py-2 bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 hover:text-blue-300 border border-blue-400/30 rounded-lg shadow-blue-400/20 shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <PlusIcon className="h-5 w-5 group-hover:text-blue-300 transition-colors duration-200" /> 
          <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-200">New Order</span>
        </Link>
        
        <Link 
          to="/assignments" 
          state={{ openNew: true }} 
          className="group relative flex items-center gap-2 px-4 py-2 bg-green-400/10 hover:bg-green-400/20 text-green-400 hover:text-green-300 border border-green-400/30 rounded-lg shadow-green-400/20 shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <PlusIcon className="h-5 w-5 group-hover:text-green-300 transition-colors duration-200" /> 
          <span className="relative z-10 group-hover:text-green-300 transition-colors duration-200">New Assignment</span>
        </Link>
        
        <Link 
          to="/delivery-persons" 
          state={{ openNew: true }} 
          className="group relative flex items-center gap-2 px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 hover:text-orange-300 border border-orange-400/30 rounded-lg shadow-orange-400/20 shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <PlusIcon className="h-5 w-5 group-hover:text-orange-300 transition-colors duration-200" /> 
          <span className="relative z-10 group-hover:text-orange-300 transition-colors duration-200">New Delivery Person</span>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/60 border border-gray-700 rounded-2xl shadow-xl p-6 mt-6 animate-fadeInUp" style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)' }}>
        <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
          <ArrowPathIcon className="h-6 w-6 text-blue-400 animate-spin-slow" /> Recent Assignments
        </h2>
        {recentAssignments.length === 0 ? (
          <div className="text-gray-400">No recent assignments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 rounded-xl overflow-hidden">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Delivery Person</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assigned At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentAssignments.map(a => (
                  <tr key={a.id} className="hover:bg-gray-700/40 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm text-gray-300">#{a.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{a.order?.clientName || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{a.deliveryPerson?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-2 text-xs font-medium rounded-full ${
                        a.status === 'Delivered'
                          ? 'bg-green-500/10 text-green-500'
                          : a.status === 'OUT FOR DELIVERY'
                          ? 'bg-green-500/10 text-green-500'
                          : a.status === 'Cancelled'
                          ? 'bg-red-500/10 text-red-500'
                          : a.status === 'Pending'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-gray-500/10 text-gray-500'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{a.assignedAt ? new Date(a.assignedAt).toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
        .animate-spin-slow {
          animation: spin 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
  