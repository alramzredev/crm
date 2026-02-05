import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import SearchFilter from '@/Shared/SearchFilter';
import PropertyList from '@/Shared/PropertyList';

const Index = () => {
  const { properties, auth } = usePage().props;

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Properties</h1>
      <div className="flex items-center justify-between mb-6">
        <SearchFilter />
        {can('properties.create') && (
          <Link
            className="btn-indigo focus:outline-none"
            href={route('properties.create')}
          >
            <span>Create</span>
            <span className="hidden md:inline"> Property</span>
          </Link>
        )}
      </div>
      <PropertyList properties={properties} showButton={true} />
    </div>
  );
};

Index.layout = page => <Layout title="Properties" children={page} />;

export default Index;
