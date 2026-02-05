import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import UnitList from '@/Shared/UnitList';

const Index = () => {
  const { units, auth } = usePage().props;

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Units</h1>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center"></div>
        {can('units.create') && (
          <Link className="btn-indigo" href={route('units.create')}>
            <span>Create</span>
            <span className="hidden md:inline"> Unit</span>
          </Link>
        )}
      </div>
      <UnitList units={units} showButton={true} />
    </div>
  );
};

Index.layout = page => <Layout title="Units" children={page} />;

export default Index;
