import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';

const Index = () => {
  const { properties, auth } = usePage().props;
  const {
    data,
    meta: { links }
  } = properties;

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  function destroy(id) {
    if (confirm('Are you sure you want to delete this property?')) {
      router.delete(route('properties.destroy', id), { preserveScroll: true });
    }
  }

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
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Code</th>
              <th className="px-6 pt-5 pb-4">Project</th>
              <th className="px-6 pt-5 pb-4">Owner</th>
              <th className="px-6 pt-5 pb-4">Status</th>
              <th className="px-6 pt-5 pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(p => (
              <tr key={p.id} className="hover:bg-gray-100 focus-within:bg-gray-100">
                <td className="border-t px-6 py-4">{p.property_code}</td>
                <td className="border-t px-6 py-4">{p.project?.name || '—'}</td>
                <td className="border-t px-6 py-4">{p.owner?.name || '—'}</td>
                <td className="border-t px-6 py-4">{p.status?.name || '—'}</td>
                <td className="border-t px-6 py-4">
                  {can('properties.edit') && (
                    <Link href={route('properties.edit', p.id)} className="text-indigo-600 hover:text-indigo-800 mr-4">
                      Edit
                    </Link>
                  )}
                  {!p.deleted_at && can('properties.delete') && (
                    <button type="button" onClick={() => destroy(p.id)} className="text-red-600 hover:text-red-800 mr-4">
                      Delete
                    </button>
                  )}
                  <Link href={route('properties.show', p.id)} className="text-indigo-600 hover:text-indigo-800">
                    Show
                  </Link>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="5">
                  No properties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination links={links} />
    </div>
  );
};

Index.layout = page => <Layout title="Properties" children={page} />;

export default Index;
