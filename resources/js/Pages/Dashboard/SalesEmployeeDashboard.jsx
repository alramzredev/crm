import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import KPICard from './Components/KPICard';

const SalesEmployeeDashboard = () => {
  const { myWork, reminders, performance, inventory } = usePage().props;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">My Dashboard</h1>

      {/* Personal Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <KPICard title="Reservations This Month" value={performance.reservations_this_month} icon="book" color="green" />
        <KPICard title="Conversion Rate" value={`${performance.conversion_rate}%`} icon="dashboard" color="indigo" />
      </div>

      {/* My Work */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">My Assigned Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assigned Leads */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">My Leads</h3>
              <Link href={route('leads')} className="text-indigo-600 hover:text-indigo-800 text-sm">
                View All →
              </Link>
            </div>
            <p className="text-3xl font-bold text-gray-900">{myWork.assigned_leads.length}</p>
            <p className="text-sm text-gray-600 mt-2">Assigned leads</p>
          </div>

          {/* Active Reservations */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Active Reservations</h3>
              <Link href={route('reservations')} className="text-indigo-600 hover:text-indigo-800 text-sm">
                View All →
              </Link>
            </div>
            <p className="text-3xl font-bold text-gray-900">{myWork.active_reservations.length}</p>
            <p className="text-sm text-gray-600 mt-2">In progress</p>
          </div>
        </div>
      </div>

      {/* Available Inventory */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Units</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rooms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{unit.unit_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{unit.property?.property_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{unit.project?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{unit.rooms}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{unit.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

SalesEmployeeDashboard.layout = page => <Layout title="Dashboard" children={page} />;

export default SalesEmployeeDashboard;
