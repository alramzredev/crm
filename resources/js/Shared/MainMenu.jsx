import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Shared/Icon';
import MainMenuItem from '@/Shared/MainMenuItem';

export default ({ className }) => {
  const { auth } = usePage().props;

  // console.log(auth.user?.permissions);

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  const hasRole = (role) => {
    return auth.user?.roles?.some(r => r.name === role) || false;
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <MainMenuItem text="Dashboard" link="dashboard" icon="dashboard" />
      </div>

      {/* Projects Section */}
      {can('projects.view') && (
        <div className="mb-4">
          <MainMenuItem text="Projects" link="projects" icon="office" />
        </div>
      )}


        {/* Projects Section */}
      {can('projects.import') && (
        <div className="mb-4">
          <MainMenuItem text="Import Batches" link="import-batches" icon="office" />
        </div>
      )}

      {/* Data Imports */}
  
      {/* {can('projects.import') && (
        <div className="mb-4">
          <div className="px-4 py-2 text-xs uppercase tracking-wide text-indigo-200">
            Data Imports
          </div>
          
          <Link
            href={route('import-batches')}
            className="block px-4 py-2 pl-8 text-sm text-indigo-200 hover:bg-indigo-700 rounded"
          >
            Import Batches
          </Link>
          <Link
            href={route('staging-projects')}
            className="block px-4 py-2 pl-8 text-sm text-indigo-200 hover:bg-indigo-700 rounded"
          >
            Staging Projects
          </Link>
          <Link
            href={route('staging-properties')}
            className="block px-4 py-2 pl-8 text-sm text-indigo-200 hover:bg-indigo-700 rounded"
          >
            Staging Properties
          </Link>
          <Link
            href={route('staging-units')}
            className="block px-4 py-2 pl-8 text-sm text-indigo-200 hover:bg-indigo-700 rounded"
          >
            Staging Units
          </Link>
        </div>
      )} */}


      {/* Properties */}
      {/* {can('properties.view') && (
        <div className="mb-4">
          <MainMenuItem text="Properties" link="properties" icon="location" />
        </div>
      )} */}

      {/* Units */}
      {/* {can('units.view') && (
        <div className="mb-4">
          <MainMenuItem text="Units" link="units" icon="store-front" />
        </div>
      )} */}

      {/* Leads */}
      {can('leads.view') && (
        <div className="mb-4">
          <MainMenuItem text="Leads" link="leads" icon="users" />
        </div>
      )}

      {/* Reservations */}
      {can('reservations.view') && (
        <div className="mb-4">
          <MainMenuItem text="Reservations" link="reservations" icon="book" />
        </div>
      )}

      {/* Owners */}
      {can('owners.view') && (
        <div className="mb-4">
          <MainMenuItem text="Owners" link="owners" icon="users" />
        </div>
      )}

      {/* Users - Only for Super Admin */}
      {can('users.view') && (
        <div className="mb-4">
          <MainMenuItem text="Users" link="users" icon="users" />
        </div>
      )}

      {/* Employees - Only for Sales Supervisor */}
      {auth.user.roles.includes('sales_supervisor') && (
        <div className="mb-4">
          <MainMenuItem text="Team" link="employees" icon="users" />
        </div>
      )}

      {/* Reports */}
      {/* {can('reports.view') && (
        <div className="mb-4">
          <MainMenuItem text="Reports" link="reports" icon="printer" />
        </div>
      )} */}
    </div>
  );
};
