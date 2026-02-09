import React from 'react';
import { usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Pagination from '@/Shared/Pagination';

const Index = () => {
  const { stagingProjects } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = stagingProjects || {};

  function revalidateRow(id) {
    router.post(route('staging-projects.revalidate', id), {}, { preserveScroll: true });
  }

  function importRow(id) {
    router.post(route('staging-projects.import-row', id), {}, { preserveScroll: true });
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Staging Projects</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap text-sm">
          <thead>
            <tr className="font-bold text-left bg-gray-50">
              <th className="px-6 pt-5 pb-4">Row #</th>
              <th className="px-6 pt-5 pb-4">Project Code</th>
              <th className="px-6 pt-5 pb-4">Name</th>
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
                <td className="px-6 py-4">{row.project_code || '—'}</td>
                <td className="px-6 py-4">{row.name || '—'}</td>
                <td className="px-6 py-4">{row.owner_name || '—'}</td>
                <td className="px-6 py-4">{row.city_name || '—'}</td>
                <td className="px-6 py-4">{row.import_status}</td>
                <td className="px-6 py-4 text-red-600">{row.error_message || '—'}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => revalidateRow(row.id)} className="text-blue-600 hover:text-blue-800">
                    Revalidate
                  </button>
                  {row.import_status === 'valid' && (
                    <button onClick={() => importRow(row.id)} className="text-green-600 hover:text-green-800">
                      Import
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t text-center text-gray-500" colSpan="8">
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

Index.layout = page => <Layout title="Staging Projects" children={page} />;

export default Index;
