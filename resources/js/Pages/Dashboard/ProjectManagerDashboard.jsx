import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import AlertCard from './Components/AlertCard';

const ProjectManagerDashboard = () => {
  const { inventory, alerts } = usePage().props;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Project Admin Dashboard</h1>

      {/* Alerts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Operational Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AlertCard 
            title="Units Without Price" 
            count={alerts.units_without_price} 
            severity="warning"
          />
          <AlertCard 
            title="Properties Under Maintenance" 
            count={alerts.properties_under_maintenance} 
            severity="info"
          />
        </div>
      </div>

      {/* Project Inventory Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Project Inventory</h2>
        <div className="grid grid-cols-1 gap-6">
          {inventory.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <Link 
                  href={route('projects.show', project.id)} 
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  View Project →
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Properties</p>
                  <p className="text-2xl font-semibold text-gray-900">{project.properties_count}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Total Units</p>
                  <p className="text-2xl font-semibold text-gray-900">{project.units_count}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-sm text-green-600">Available</p>
                  <p className="text-2xl font-semibold text-green-700">{project.available_units}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded">
                  <p className="text-sm text-yellow-600">Reserved</p>
                  <p className="text-2xl font-semibold text-yellow-700">{project.reserved_units}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-600">Sold</p>
                  <p className="text-2xl font-semibold text-blue-700">{project.sold_units}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ProjectManagerDashboard.layout = page => <Layout title="Dashboard" children={page} />;

export default ProjectManagerDashboard;
