import React from 'react';
import { usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import KPICard from './Components/KPICard';
import AlertCard from './Components/AlertCard';

const AdminDashboard = () => {
  const { kpis, charts, userStats, alerts } = usePage().props;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Projects" value={kpis.total_projects} icon="project" color="indigo" />
        <KPICard title="Total Properties" value={kpis.total_properties} icon="property" color="blue" />
        <KPICard title="Total Units" value={kpis.total_units} icon="dashboard" color="purple" />
        <KPICard title="Available Units" value={kpis.available_units} icon="store-front" color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Sold Units" value={kpis.sold_units} icon="shopping-cart" color="green" />
        <KPICard title="Active Reservations" value={kpis.active_reservations} icon="book" color="yellow" />
        <KPICard title="Total Leads" value={kpis.total_leads} icon="users" color="indigo" />
      </div>

      {/* Alerts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-black">Alerts & Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AlertCard 
            title="Expired Reservations" 
            count={alerts.expired_reservations} 
            severity="error"
            link={route('reservations', { status: 'expired' })}
          />
          <AlertCard 
            title="Low Availability Projects" 
            count={alerts.low_availability_projects} 
            severity="warning"
            link={route('projects')}
          />
        </div>
      </div>

      {/* User Stats Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">User Overview</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Users by Role */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b pb-2">Users by Role</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Super Admins</span>
                  <span className="font-bold text-purple-700">{userStats.super_admins}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Project Admins</span>
                  <span className="font-bold text-blue-700">{userStats.project_admins}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Sales Supervisors</span>
                  <span className="font-bold text-indigo-700">{userStats.sales_supervisors}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Sales Employees</span>
                  <span className="font-bold text-green-700">{userStats.sales_employees}</span>
                </div>
              </div>
            </div>

            {/* User Status */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b pb-2">User Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Active Users</span>
                  <span className="font-bold text-green-700">{userStats.active_users}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <span className="text-gray-700 font-medium">Inactive Users</span>
                  <span className="font-bold text-gray-500">{userStats.inactive_users}</span>
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b pb-2">Summary</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-indigo-700">
                    {userStats.active_users + userStats.inactive_users}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-xs text-gray-600 mb-1">Active Rate</p>
                  <p className="text-lg font-semibold text-yellow-700">
                    {userStats.active_users + userStats.inactive_users > 0 
                      ? Math.round((userStats.active_users / (userStats.active_users + userStats.inactive_users)) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AdminDashboard.layout = page => <Layout title="Dashboard" children={page} />;

export default AdminDashboard;
