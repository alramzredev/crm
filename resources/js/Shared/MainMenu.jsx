import React from 'react';
import { usePage } from '@inertiajs/react';
import MainMenuItem from '@/Shared/MainMenuItem';

export default ({ className }) => {
  const { auth } = usePage().props;

  const can = (permission) => {
    if (!auth.user || !auth.user.permissions) return false;
    return auth.user.permissions.includes(permission);
  };

  console.log(auth.user.roles);


  return (
    <nav className={className}>
      <div className="mb-12 flex flex-col">
        {can('dashboard.view') && (
          <MainMenuItem
            text="Dashboard"
            link="dashboard"
            icon="dashboard"
          />
        )}

        {can('users.view') && (
          <MainMenuItem
            text="Users"
            link="users"
            icon="users"
          />
        )}

        {can('projects.view') && (
          <MainMenuItem
            text="Projects"
            link="projects"
            icon="office"
          />
        )}

        {/* {can('properties.view') && (
          <MainMenuItem
            text="Properties"
            link="properties"
            icon="office"
          />
        )} */}

        {/* {can('units.view') && (
          <MainMenuItem
            text="Units"
            link="units"
            icon="office"
          />
        )} */}

        {can('owners.view') && (
          <MainMenuItem
            text="Owners"
            link="owners"
            icon="users"
          />
        )}

        {can('leads.view') && (
          <MainMenuItem
            text="Leads"
            link="leads"
            icon="users"
          />
        )}

{auth.user?.roles?.includes('sales_supervisor') && (
  <MainMenuItem
    text="Team"
    link="employees"
    icon="users"
  />
)}

        {can('reservations.view') && (
          <MainMenuItem
            text="Reservations"
            link="reservations"
            icon="office"
          />
        )}

        {can('reports.view') && (
          <MainMenuItem
            text="Reports"
            link="reports"
            icon="book"
          />
        )}
      </div>
    </nav>
  );
};
