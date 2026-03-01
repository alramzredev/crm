import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Pagination from '@/Shared/Pagination';
import BatchProjectsList from '@/Pages/ImportBatches/Components/BatchProjectsList';
import BatchPropertiesList from '@/Pages/ImportBatches/Components/BatchPropertiesList';
import BatchUnitsList from '@/Pages/ImportBatches/Components/BatchUnitsList';
import { useTranslation } from 'react-i18next';

const EmptyState = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center text-gray-500 py-12">{t('no_rows_found')}</div>
  );
};

const Show = () => {
  const { t } = useTranslation();
  const { batch, stagingRows } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = stagingRows || {};
  const [selectedRows, setSelectedRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const typeLabel = batch.import_type === 'properties'
    ? t('properties')
    : batch.import_type === 'units'
      ? t('units')
      : t('projects');

  const counts = {
    error: data.filter(r => r.import_status === 'error').length,
    valid: data.filter(r => r.import_status === 'valid').length,
    imported: data.filter(r => r.import_status === 'imported').length,
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map(r => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (rowId, e) => {
    if (e.target.checked) {
      setSelectedRows([...selectedRows, rowId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    }
  };

  const handleBulkValidate = async () => {
    if (!confirm('Validate all rows in this batch?')) return;
    setIsProcessing(true);
    router.post(route('import-batches.bulk-validate', batch.batch_uuid), {}, {
      onFinish: () => setIsProcessing(false)
    });
  };

  const handleBulkImport = async () => {
    if (!confirm('Import all valid rows in this batch?')) return;
    setIsProcessing(true);
    router.post(route('import-batches.bulk-import', batch.batch_uuid), {}, {
      onFinish: () => setIsProcessing(false)
    });
  };

  const handleBulkValidateSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row');
      return;
    }
    if (!confirm(`Validate ${selectedRows.length} selected rows?`)) return;
    setIsProcessing(true);
    router.post(route('import-batches.bulk-validate-rows', batch.batch_uuid), 
      { row_ids: selectedRows }, 
      { onFinish: () => setIsProcessing(false) }
    );
  };

  const handleBulkImportSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row');
      return;
    }
    if (!confirm(`Import ${selectedRows.length} selected valid rows?`)) return;
    setIsProcessing(true);
    router.post(route('import-batches.bulk-import-rows', batch.batch_uuid), 
      { row_ids: selectedRows }, 
      { onFinish: () => setIsProcessing(false) }
    );
  };

  const handleRetryFailed = async () => {
    if (counts.error === 0) {
      alert('No failed rows to retry');
      return;
    }
    if (!confirm(`Retry ${counts.error} failed rows?`)) return;
    setIsProcessing(true);
    router.post(route('import-batches.retry-failed', batch.batch_uuid), {}, {
      onFinish: () => setIsProcessing(false)
    });
  };

  const handleClearErrors = async () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row');
      return;
    }
    if (!confirm(`Clear errors for ${selectedRows.length} selected rows?`)) return;
    setIsProcessing(true);
    router.post(route('import-batches.clear-errors', batch.batch_uuid), 
      { row_ids: selectedRows }, 
      { onFinish: () => setIsProcessing(false) }
    );
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('import-batches')} className="text-indigo-600 hover:text-indigo-700">
          {t('import_batches')}
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {t('batch')} {batch.batch_uuid?.slice(0, 8)}
      </h1>

      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">{t('type')}</div>
            <div className="text-lg font-semibold">{typeLabel}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded p-3 text-center">
              <div className="text-xs text-red-600">{t('error')}</div>
              <div className="text-xl font-bold text-red-700">{counts.error}</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
              <div className="text-xs text-green-600">{t('valid')}</div>
              <div className="text-xl font-bold text-green-700">{counts.valid}</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
              <div className="text-xs text-blue-600">{t('imported')}</div>
              <div className="text-xl font-bold text-blue-700">{counts.imported}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            {selectedRows.length > 0 && `${selectedRows.length} ${t('row')}(s) ${t('selected') || 'selected'}`}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleBulkValidate}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {isProcessing ? t('processing') : t('validate_all')}
            </button>
            <button
              onClick={handleBulkImport}
              disabled={isProcessing || counts.valid === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
            >
              {isProcessing ? t('processing') : t('import_all_valid')}
            </button>
            {selectedRows.length > 0 && (
              <>
                <button
                  onClick={handleBulkValidateSelected}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
                >
                  {t('validate_selected')}
                </button>
                <button
                  onClick={handleBulkImportSelected}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
                >
                  {t('import_selected')}
                </button>
                <button
                  onClick={handleClearErrors}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 text-sm font-medium"
                >
                  {t('clear_errors')}
                </button>
              </>
            )}
            {counts.error > 0 && (
              <button
                onClick={handleRetryFailed}
                disabled={isProcessing}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 text-sm font-medium"
              >
                {t('retry_failed')}
              </button>
            )}
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState />
      ) : batch.import_type === 'properties' ? (
        <BatchPropertiesList 
          data={data} 
          selectedRows={selectedRows}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
        />
      ) : batch.import_type === 'units' ? (
        <BatchUnitsList 
          data={data} 
          selectedRows={selectedRows}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
        />
      ) : (
        <BatchProjectsList 
          data={data} 
          selectedRows={selectedRows}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
        />
      )}

      <Pagination links={links} />
    </div>
  );
};

// Fix: Do NOT use hooks in layout assignment, only use them inside components
Show.layout = page => <Layout title="Import Batch" children={page} />;

export default Show;
