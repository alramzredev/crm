import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Pagination from '@/Shared/Pagination';

const Show = () => {
  const { batch, stagingProjects } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = stagingProjects || {};

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('import-batches')} className="text-indigo-600 hover:text-indigo-700">
          Import Batches
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        Batch {batch.batch_uuid?.slice(0, 8)}
      </h1>

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination links={links} />
    </div>
  );
};

Show.layout = page => <Layout title="Batch Details" children={page} />;

export default Show;
