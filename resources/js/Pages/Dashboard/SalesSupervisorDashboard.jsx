import React from 'react';
import { usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import KPICard from './Components/KPICard';
import AlertCard from './Components/AlertCard';

const SalesSupervisorDashboard = () => {
  const { kpis, teamPerformance, inventory, alerts } = usePage().props;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Sales Supervisor Dashboard</h1>

      {/* Sales KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Total Leads" value={kpis.total_leads} icon="users" color="indigo" />
        <KPICard title="New Leads Today" value={kpis.new_leads_today} icon="dashboard" color="green" />
        <KPICard title="Active Reservations" value={kpis.active_reservations} icon="book" color="yellow" />
      </div>

      {/* Alerts */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sales Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AlertCard 
            title="Expiring Reservations (3 days)" 
            count={alerts.expiring_reservations} 
            severity="warning"
          />
          <AlertCard 
            title="Unassigned Leads" 
            count={alerts.unassigned_leads} 
            severity="error"
          />
        </div>
      </div>

      {/* Team Performance */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Leads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">This Month</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teamPerformance.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{member.first_name} {member.last_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{member.leads_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{member.leads_this_month_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Snapshot */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Inventory Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KPICard title="Available Units" value={inventory.available_units} icon="store-front" color="green" />
          <KPICard title="Reserved Today" value={inventory.reserved_today} icon="shopping-cart" color="yellow" />
        </div>
      </div>
    </div>
  );
};

SalesSupervisorDashboard.layout = page => <Layout title="Dashboard" children={page} />;

export default SalesSupervisorDashboard;
