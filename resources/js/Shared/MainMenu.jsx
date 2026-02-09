import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Shared/Icon';

export default ({ className }) => {
  const { auth } = usePage().props;

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <Link
          href={route('dashboard')}
          className="block px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded"
        >
          Dashboard
        </Link>
      </div>

      {/* Projects Section */}
      {can('projects.view') && (
        <div className="mb-4">
          <Link
            href={route('projects')}
            className="block px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded"
          >
            Projects
          </Link>
        </div>
      )}

      {/* Data Imports */}
      {can('projects.import') && (
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
      )}

      {/* Properties */}
      {can('properties.view') && (
        <div className="mb-4">
          <Link
            href={route('properties')}
            className="block px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded"
          >
            Properties
          </Link>
        </div>
      )}

      {/* Units */}
      {can('units.view') && (
        <div className="mb-4">
          <Link
            href={route('units')}
            className="block px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded"
          >
            Units
          </Link>
        </div>
      )}

      {/* Leads */}
      {can('leads.view') && (
        <div className="mb-4">
          <Link
            href={route('leads')}
            className="block px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded"
          >
            Leads
          </Link>
        </div>
      )}

      {/* Reservations */}
      {can('reservations.view') && (
        <div className="mb-4">
          <Link
            href={route('reservations')}
            className="block px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded"
          >
            Reservations
          </Link>
        </div>
      )}

      {/* Owners */}
      {can('owners.view') && (
        <div className="mb-4">
          <Link
            href={route('owners')}
            className="block px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded"
          >
            Owners
          </Link>
        </div>
      )}

      {/* Users */}
      {can('users.view') && (
        <div className="mb-4">
          <Link
            href={route('users')}
            className="block px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded"
          >
            Users
          </Link>
        </div>
      )}

      {/* Employees */}
      <div className="mb-4">
        <Link
          href={route('employees')}
          className="block px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded"
        >
          My Sales Team
        </Link>
      </div>

      {/* Reports */}
      {can('reports.view') && (
        <div className="mb-4">
          <Link
            href={route('reports')}
            className="block px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded"
          >
            Reports
          </Link>
        </div>
      )}
    </div>
  );
};
