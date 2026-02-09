import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Pagination from '@/Shared/Pagination';

const Index = () => {
  const { batches } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = batches || {};
  const [filter, setFilter] = useState('all');

  function deleteBatch(batchId) {
    if (confirm('Delete this batch and all rows?')) {
      router.delete(route('import-batches.destroy', batchId));
    }
  }

  function retryBatch(batchId) {
    if (confirm('Revalidate failed rows in this batch?')) {
      router.post(route('import-batches.retry', batchId));
    }
  }

  const filteredData = filter === 'all' 
    ? data 
    : data.filter(b => b.status === filter);

  const getStatusBadge = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'processing': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'projects': '📊 Projects',
      'properties': '🏢 Properties',
      'units': '🏠 Units',
    };
    return labels[type] || type;
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Import Batches</h1>
          <p className="text-gray-600 mt-2">Monitor, debug, and retry data imports.</p>
        </div>
        <div className="space-x-2">
          <Link href={route('imports.projects')} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">
            + Import Projects
          </Link>
          <Link href={route('imports.properties')} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">
            + Import Properties
          </Link>
          <Link href={route('imports.units')} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">
            + Import Units
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {['all', 'completed', 'processing', 'pending', 'failed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              filter === status
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Batch Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left bg-gray-50 border-b">
              <th className="px-6 pt-5 pb-4">Batch ID</th>
              <th className="px-6 pt-5 pb-4">Type</th>
              <th className="px-6 pt-5 pb-4">File</th>
              <th className="px-6 pt-5 pb-4">Status</th>
              <th className="px-6 pt-5 pb-4 text-right">Total / Failed</th>
              <th className="px-6 pt-5 pb-4">Created By</th>
              <th className="px-6 pt-5 pb-4">Created At</th>
              <th className="px-6 pt-5 pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(batch => (
              <tr key={batch.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm text-gray-600">{batch.batch_uuid?.slice(0, 8)}</td>
                <td className="px-6 py-4">{getTypeLabel(batch.import_type)}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{batch.file_name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(batch.status)}`}>
                    {batch.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm">
                    {batch.total_rows} / <span className={batch.failed_rows > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                      {batch.failed_rows}
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{batch.created_by}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(batch.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Link
                    href={route('import-batches.show', batch.batch_uuid)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View
                  </Link>
                  {batch.failed_rows > 0 && batch.status !== 'processing' && (
                    <button
                      onClick={() => retryBatch(batch.batch_uuid)}
                      className="text-yellow-600 hover:text-yellow-800 font-medium"
                    >
                      Retry
                    </button>
                  )}
                  <button
                    onClick={() => deleteBatch(batch.batch_uuid)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan="8">
                  No batches found.
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

Index.layout = page => <Layout title="Import Batches" children={page} />;

export default Index;
