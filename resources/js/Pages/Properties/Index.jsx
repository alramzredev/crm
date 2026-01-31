import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Pagination from '@/Shared/Pagination';
import PropertyList from '@/Shared/PropertyList';

const Index = () => {
  const { properties } = usePage().props;
  const { data, meta: { links } } = properties;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Properties</h1>
      <div className="flex items-center justify-between mb-6">
        <Link className="btn-indigo" href={route('properties.create')}>Create Property</Link>
      </div>
      <PropertyList properties={data} showButton={true} />
      <Pagination links={links} />
    </div>
  );
};

Index.layout = page => <Layout title="Properties" children={page} />;

export default Index;
