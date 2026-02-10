import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Pagination from '@/Shared/Pagination';
import BatchProjectsList from '@/Pages/ImportBatches/Components/BatchProjectsList';
import BatchPropertiesList from '@/Pages/ImportBatches/Components/BatchPropertiesList';
import BatchUnitsList from '@/Pages/ImportBatches/Components/BatchUnitsList';

const EmptyState = () => (
  <div className="text-center text-gray-500 py-12">No rows found.</div>
);

const Show = () => {
  const { batch, stagingRows } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = stagingRows || {};

  const typeLabel = batch.import_type === 'properties'
    ? 'Properties'
    : batch.import_type === 'units'
      ? 'Units'
      : 'Projects';

  const counts = {
    error: data.filter(r => r.import_status === 'error').length,
    valid: data.filter(r => r.import_status === 'valid').length,
    imported: data.filter(r => r.import_status === 'imported').length,
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('import-batches')} className="text-indigo-600 hover:text-indigo-700">
          Import Batches
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        Batch {batch.batch_uuid?.slice(0, 8)}
      </h1>

      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">Type</div>
            <div className="text-lg font-semibold">{typeLabel}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded p-3 text-center">
              <div className="text-xs text-red-600">Errors</div>
              <div className="text-xl font-bold text-red-700">{counts.error}</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
              <div className="text-xs text-green-600">Valid</div>
              <div className="text-xl font-bold text-green-700">{counts.valid}</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
              <div className="text-xs text-blue-600">Imported</div>
              <div className="text-xl font-bold text-blue-700">{counts.imported}</div>
            </div>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState />
      ) : batch.import_type === 'properties' ? (
        <BatchPropertiesList data={data} />
      ) : batch.import_type === 'units' ? (
        <BatchUnitsList data={data} />
      ) : (
        <BatchProjectsList data={data} />
      )}

      <Pagination links={links} />
    </div>
  );
};

Show.layout = page => <Layout title="Batch Details" children={page} />;

export default Show;
