import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Pagination from '@/Shared/Pagination';

const Index = () => {
  const { owners, auth } = usePage().props;
  const { data, meta: { links } = { links: [] } } = owners || { data: [], meta: { links: [] } };

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  function destroy(id) {
    if (confirm('Delete owner?')) {
      router.delete(route('owners.destroy', id), { preserveScroll: true });
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Owners</h1>
      <div className="flex items-center justify-between mb-6">
        {can('owners.create') && (
          <Link className="btn-indigo" href={route('owners.create')}>
            Create Owner
          </Link>
        )}
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(o => (
              <tr key={o.id} className="border-t">
                <td className="px-6 py-4">{o.name}</td>
                <td className="px-6 py-4">{o.type}</td>
                <td className="px-6 py-4">{o.phone}</td>
                <td className="px-6 py-4">{o.email}</td>
                <td className="px-6 py-4">
                  {can('owners.edit') && (
                    <Link href={route('owners.edit', o.id)} className="text-indigo-600 mr-4">
                      Edit
                    </Link>
                  )}
                  {can('owners.delete') && (
                    <button onClick={() => destroy(o.id)} className="text-red-600">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4" colSpan="5">
                  No owners found.
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

Index.layout = page => <Layout title="Owners" children={page} />;

export default Index;
