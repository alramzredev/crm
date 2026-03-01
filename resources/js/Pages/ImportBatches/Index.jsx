import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Pagination from '@/Shared/Pagination';
import { useTranslation } from 'react-i18next';
import ShowButton from '@/Shared/TableActions/ShowButton';
import DeleteButton from '@/Shared/TableActions/DeleteButton';
import EditButton from '@/Shared/TableActions/EditButton';

const Index = () => {
  const { batches } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = batches || {};
  const [filter, setFilter] = useState('all');
  const { t } = useTranslation();

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
      'projects': t('projects_label'),
      'properties': t('properties_label'),
      'units': t('units_label'),
    };
    return labels[type] || type;
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('import_batches')}</h1>
          <p className="text-gray-600 mt-2">{t('monitor_debug_retry')}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Link
            href={route('imports.projects')}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            + {t('import_projects')}
          </Link>
          <Link
            href={route('imports.properties')}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            + {t('import_properties')}
          </Link>
          <Link
            href={route('imports.units')}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            + {t('import_units')}
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
            {t(status)}
          </button>
        ))}
      </div>

      {/* Batch Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left bg-gray-50 border-b">
              <th className="px-6 pt-5 pb-4">{t('batch_id')}</th>
              <th className="px-6 pt-5 pb-4">{t('type')}</th>
              <th className="px-6 pt-5 pb-4">{t('file')}</th>
              <th className="px-6 pt-5 pb-4">{t('status')}</th>
              <th className="px-6 pt-5 pb-4 text-right">{t('total_failed')}</th>
              <th className="px-6 pt-5 pb-4">{t('created_by')}</th>
              <th className="px-6 pt-5 pb-4">{t('created_at')}</th>
              <th className="px-6 pt-5 pb-4">{t('actions')}</th>
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
                  <div className="flex gap-2">
                    <ShowButton onClick={() => router.visit(route('import-batches.show', batch.batch_uuid))} label={t('view')} />
                    {batch.failed_rows > 0 && batch.status !== 'processing' && (
                      <EditButton onClick={() => retryBatch(batch.batch_uuid)} label={t('retry')} />
                    )}
                    <DeleteButton onClick={() => deleteBatch(batch.batch_uuid)} label={t('delete')} />
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan="8">
                  {t('no_batches_found')}
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
