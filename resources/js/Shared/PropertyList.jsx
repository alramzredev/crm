import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Pagination from '@/Shared/Pagination';

const PropertyList = ({ properties, showButton = true, inTab = false }) => {
  const { auth } = usePage().props;

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  // Handle both paginated and non-paginated data
  const propertyData = properties?.data || properties || [];
  const paginationLinks = properties?.meta?.links || properties?.links || null;

  if (!propertyData || propertyData.length === 0) {
    return <p>No properties found.</p>;
  }

  function destroy(id) {
    if (confirm('Are you sure you want to delete this property?')) {
      router.delete(route('properties.destroy', id), { preserveScroll: true });
    }
  }

  return (
    <>
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
            {propertyData.map(p => (
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
      {paginationLinks && (
        <Pagination
          links={paginationLinks}
          preserveScroll={inTab}
          preserveState={inTab}
          showSinglePage={false}
        />
      )}
    </>
  );
};

export default PropertyList;
