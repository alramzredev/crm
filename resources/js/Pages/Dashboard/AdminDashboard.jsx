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
        <KPICard title="Total Projects" value={kpis.total_projects} icon="🏗️" color="indigo" />
        <KPICard title="Total Properties" value={kpis.total_properties} icon="🏢" color="blue" />
        <KPICard title="Total Units" value={kpis.total_units} icon="🏠" color="purple" />
        <KPICard title="Available Units" value={kpis.available_units} icon="✅" color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Sold Units" value={kpis.sold_units} icon="💰" color="green" />
        <KPICard title="Active Reservations" value={kpis.active_reservations} icon="📋" color="yellow" />
        <KPICard title="Total Leads" value={kpis.total_leads} icon="👥" color="indigo" />
      </div>

      {/* Alerts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Alerts & Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AlertCard 
            title="Expired Reservations" 
            count={alerts.expired_reservations} 
            severity="error"
            link={route('reservations', { filter: 'expired' })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Users by Role</h3>
              <div className="space-y-2">
                {userStats.users_by_role.map((role) => (
                  <div key={role.name} className="flex justify-between items-center">
                    <span className="text-gray-700">{role.name}</span>
                    <span className="font-semibold">{role.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">User Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Active Users</span>
                  <span className="font-semibold text-green-600">{userStats.active_users}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Inactive Users</span>
                  <span className="font-semibold text-gray-400">{userStats.inactive_users}</span>
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
