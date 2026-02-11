import React from 'react';
import { usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Pagination from '@/Shared/Pagination';

const Index = () => {
  const { stagingProperties } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = stagingProperties || {};

  function revalidateRow(id) {
    router.post(route('staging-properties.revalidate', id), {}, { preserveScroll: true });
  }

  function importRow(id) {
    router.post(route('staging-properties.import-row', id), {}, { preserveScroll: true });
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Staging Properties</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap text-sm">
          <thead>
            <tr className="font-bold text-left bg-gray-50">
              <th className="px-6 pt-5 pb-4">Row #</th>
              <th className="px-6 pt-5 pb-4">Batch ID</th>
              <th className="px-6 pt-5 pb-4">Property Code</th>
              <th className="px-6 pt-5 pb-4">Project</th>
              <th className="px-6 pt-5 pb-4">Owner</th>
              <th className="px-6 pt-5 pb-4">City</th>
              <th className="px-6 pt-5 pb-4">Status</th>
              <th className="px-6 pt-5 pb-4">Error</th>
              <th className="px-6 pt-5 pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{row.row_number}</td>
                <td className="px-6 py-4 font-mono text-xs">{row.import_batch_id?.slice(0, 8)}</td>
                <td className="px-6 py-4">{row.property_code || '—'}</td>
                <td className="px-6 py-4">{row.project_code || '—'}</td>
                <td className="px-6 py-4">{row.owner_name || '—'}</td>
                <td className="px-6 py-4">{row.city_name || '—'}</td>
                <td className="px-6 py-4">{row.import_status}</td>
                <td className="px-6 py-4 text-red-600">{row.error_message || '—'}</td>
                <td className="px-6 py-4 space-x-2">
                  {row.import_status !== 'imported' && (
                    <button onClick={() => revalidateRow(row.id)} className="text-blue-600 hover:text-blue-800">
                      Revalidate
                    </button>
                  )}
                  {row.import_status === 'valid' && (
                    <button onClick={() => importRow(row.id)} className="text-green-600 hover:text-green-800">
                      Import
                    </button>
                  )}
                  {row.import_status === 'imported' && (
                    <span className="text-green-700 font-medium">✓ Imported</span>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t text-center text-gray-500" colSpan="9">
                  No staging rows found.
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

Index.layout = page => <Layout title="Staging Properties" children={page} />;

export default Index;
