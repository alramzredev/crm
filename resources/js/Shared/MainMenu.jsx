import React from 'react';
import MainMenuItem from '@/Shared/MainMenuItem';

export default ({ className }) => {
  return (
    <div className={className}>
      <MainMenuItem text="Dashboard" link="dashboard" icon="dashboard" />
      <MainMenuItem text="Projects" link="projects" icon="office" />
      <MainMenuItem text="Properties" link="properties" icon="office" />
      <MainMenuItem text="Units" link="units" icon="office" />
      <MainMenuItem text="Leads" link="leads" icon="users" />
      <MainMenuItem text="Owners" link="owners" icon="users" />
      <MainMenuItem text="Reports" link="reports" icon="printer" />
    </div>
  );
};
