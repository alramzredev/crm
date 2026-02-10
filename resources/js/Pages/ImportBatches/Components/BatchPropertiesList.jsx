import React from 'react';
import { router } from '@inertiajs/react';

const StatusPill = ({ status }) => {
  const colors = {
    error: 'bg-red-100 text-red-800',
    valid: 'bg-green-100 text-green-800',
    imported: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status || '—'}
    </span>
  );
};

const BatchPropertiesList = ({ data = [] }) => {
  function handleRevalidate(rowId) {
    router.post(route('staging-properties.revalidate', rowId), {}, { preserveScroll: true });
  }

  function handleImport(rowId) {
    if (confirm('Import this property?')) {
      router.post(route('staging-properties.import-row', rowId), {}, { preserveScroll: true });
    }
  }

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full whitespace-nowrap text-sm">
        <thead>
          <tr className="font-bold text-left bg-gray-50 border-b">
            <th className="px-4 py-3">Row</th>
            <th className="px-4 py-3">Property Code</th>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Owner</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Error</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-600">{row.row_number}</td>
              <td className="px-4 py-3 font-mono">{row.property_code || '—'}</td>
              <td className="px-4 py-3">{row.project_code || '—'}</td>
              <td className="px-4 py-3">{row.owner_name || '—'}</td>
              <td className="px-4 py-3">{row.city_name || '—'}</td>
              <td className="px-4 py-3">
                <StatusPill status={row.import_status} />
              </td>
              <td className="px-4 py-3 text-red-600 max-w-xs truncate" title={row.error_message}>
                {row.error_message || '—'}
              </td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => handleRevalidate(row.id)}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  Revalidate
                </button>
                {row.import_status === 'valid' && (
                  <button
                    onClick={() => handleImport(row.id)}
                    className="text-green-600 hover:text-green-800 text-xs font-medium"
                  >
                    Import
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BatchPropertiesList;
