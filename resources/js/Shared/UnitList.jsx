import React from 'react';
import { Link, router } from '@inertiajs/react';

const UnitList = ({ units, showButton = true }) => {
  if (!units || units.length === 0) {
    return <p>No units found.</p>;
  }

  function destroy(id) {
    if (confirm('Are you sure you want to delete this unit?')) {
      router.delete(route('units.destroy', id), { preserveScroll: true });
    }
  }

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="font-bold text-left">
            <th className="px-6 pt-5 pb-4">Code</th>
            <th className="px-6 pt-5 pb-4">Number</th>
            <th className="px-6 pt-5 pb-4">Property</th>
            <th className="px-6 pt-5 pb-4">Floor</th>
            <th className="px-6 pt-5 pb-4">Area</th>
            <th className="px-6 pt-5 pb-4">Rooms</th>
            <th className="px-6 pt-5 pb-4">Status</th>
            <th className="px-6 pt-5 pb-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {units.map(u => (
            <tr key={u.id} className="hover:bg-gray-100 focus-within:bg-gray-100">
              <td className="border-t px-6 py-4">{u.unit_code || '—'}</td>
              <td className="border-t px-6 py-4">{u.unit_number || '—'}</td>
              <td className="border-t px-6 py-4">{u.property?.property_code || '—'}</td>
              <td className="border-t px-6 py-4">{u.floor || '—'}</td>
              <td className="border-t px-6 py-4">{u.area || '—'}</td>
              <td className="border-t px-6 py-4">{u.rooms || '—'}</td>
              <td className="border-t px-6 py-4">{u.status?.name || '—'}</td>
              <td className="border-t px-6 py-4">
                <Link href={route('units.edit', u.id)} className="text-indigo-600 hover:text-indigo-800 mr-4">Edit</Link>
                {!u.deleted_at && (
                  <button type="button" onClick={() => destroy(u.id)} className="text-red-600 hover:text-red-800 mr-4">Delete</button>
                )}
                {showButton && (
                  <Link href={route('units.show', u.id)} className="text-indigo-600 hover:text-indigo-800">Show</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UnitList;
