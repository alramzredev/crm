import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';

const PropertyList = ({ properties, showButton = true }) => {
  const { auth } = usePage().props;

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  if (!properties || properties.length === 0) {
    return <p>No properties found.</p>;
  }

  function destroy(id) {
    if (confirm('Are you sure you want to delete this property?')) {
      router.delete(route('properties.destroy', id), { preserveScroll: true });
    }
  }

  return (
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
          {properties.map(p => (
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
                {showButton && can('properties.view') && (
                  <Link href={route('properties.show', p.id)} className="text-indigo-600 hover:text-indigo-800">
                    Show
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyList;
