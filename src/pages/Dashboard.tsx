import React, { useState, useEffect } from 'react';
import { Users, Package, CreditCard, Bell, TrendingUp, AlertCircle } from 'lucide-react';
import { dashboardService } from '../lib/database';

interface DashboardStats {
  totalCustomers: number;
  activeSubscriptions: number;
  totalProducts: number;
  pendingReminders: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeSubscriptions: 0,
    totalProducts: 0,
    pendingReminders: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activityData, renewalsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivity(),
        dashboardService.getUpcomingRenewals()
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData);
      setUpcomingRenewals(renewalsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    { 
      name: 'Total Customers', 
      value: stats.totalCustomers.toString(), 
      icon: Users, 
      color: 'bg-blue-500', 
      change: '+12%' 
    },
    { 
      name: 'Active Subscriptions', 
      value: stats.activeSubscriptions.toString(), 
      icon: CreditCard, 
      color: 'bg-emerald-500', 
      change: '+8%' 
    },
    { 
      name: 'Products', 
      value: stats.totalProducts.toString(), 
      icon: Package, 
      color: 'bg-amber-500', 
      change: '+3%' 
    },
    { 
      name: 'Pending Reminders', 
      value: stats.pendingReminders.toString(), 
      icon: Bell, 
      color: 'bg-red-500', 
      change: '-5%' 
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 animate-pulse">
              <div className="p-5">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening with your subscriptions today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${item.color} rounded-lg p-3`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        item.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="h-4 w-4 flex-shrink-0 mr-1" />
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.customer?.name || 'Unknown Customer'}
                      </p>
                      <p className="text-sm text-gray-500">
                        New subscription - {activity.product?.name || 'Unknown Product'}
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Renewals</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingRenewals.length > 0 ? (
              upcomingRenewals.map((renewal) => (
                <div key={renewal.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {renewal.customer?.name || 'Unknown Customer'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {renewal.product?.name || 'Unknown Product'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${renewal.product?.price || 0}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(renewal.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No upcoming renewals
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {stats.pendingReminders > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Attention Required</h3>
              <p className="mt-1 text-sm text-amber-700">
                You have {stats.pendingReminders} pending reminders. Review and send reminders to ensure continuity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}