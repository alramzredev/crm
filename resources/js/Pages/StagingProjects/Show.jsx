import React, { useState, useMemo } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import Pagination from '@/Shared/Pagination';
import EditRowModal from './Components/EditRowModal';

const Show = () => {
  const { batch, stagingProjects, auth } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = stagingProjects || {};
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRow, setEditingRow] = useState(null);

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(row => row.import_status === statusFilter);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(row =>
        row.project_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [data, statusFilter, searchTerm]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'valid': return 'bg-green-100 text-green-800';
      case 'imported': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  function handleImportRow(rowId) {
    if (confirm('Import this row to projects?')) {
      router.post(route('staging-projects.import-row', rowId));
    }
  }

  function handleRevalidateRow(rowId) {
    router.post(route('staging-projects.revalidate', rowId));
  }

  const errorCounts = {
    error: data.filter(r => r.import_status === 'error').length,
    valid: data.filter(r => r.import_status === 'valid').length,
    imported: data.filter(r => r.import_status === 'imported').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            <Link href={route('staging-projects')} className="text-indigo-600 hover:text-indigo-700">
              Import Batches
            </Link>
            <span className="mx-2 font-medium text-indigo-600">/</span>
            Batch {batch.batch_uuid?.slice(0, 8)}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Created {batch.created_at ? new Date(batch.created_at).toLocaleDateString() : '—'} by {batch.created_by || '—'}
          </p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-600 font-medium">Errors</p>
          <p className="text-3xl font-bold text-red-700">{errorCounts.error}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium">Valid</p>
          <p className="text-3xl font-bold text-green-700">{errorCounts.valid}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Imported</p>
          <p className="text-3xl font-bold text-blue-700">{errorCounts.imported}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <SelectInput
            className="w-full md:w-48"
            label="Status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Rows</option>
            <option value="error">Errors Only</option>
            <option value="valid">Valid Only</option>
            <option value="imported">Imported Only</option>
          </SelectInput>
          <TextInput
            className="w-full md:flex-1"
            label="Search"
            placeholder="Project code, name, or owner..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Staging Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap text-sm">
          <thead>
            <tr className="font-bold text-left bg-gray-50 border-b">
              <th className="px-4 py-3">Row</th>
              <th className="px-4 py-3">Project Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(row => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600">{row.row_number}</td>
                <td className="px-4 py-3 font-mono">{row.project_code || '—'}</td>
                <td className="px-4 py-3">{row.name || '—'}</td>
                <td className="px-4 py-3">{row.owner_name || '—'}</td>
                <td className="px-4 py-3">{row.city_name || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(row.import_status)}`}>
                    {row.import_status}
                  </span>
                  {row.error_message && (
                    <p className="text-xs text-red-600 mt-1">{row.error_message}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => setEditingRow(row)}
                    className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                  >
                    Edit
                  </button>
                  {row.import_status !== 'imported' && (
                    <button
                      onClick={() => handleRevalidateRow(row.id)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Revalidate
                    </button>
                  )}
                  {row.import_status === 'valid' && (
                    <button
                      onClick={() => handleImportRow(row.id)}
                      className="text-green-600 hover:text-green-800 text-xs font-medium"
                    >
                      Import
                    </button>
                  )}
                  {row.import_status === 'imported' && (
                    <span className="text-green-700 text-xs font-medium">✓ Imported</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-center text-gray-500" colSpan="7">
                  No rows match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination links={links} />

      {/* Edit Modal */}
      {editingRow && (
        <EditRowModal
          row={editingRow}
          onClose={() => setEditingRow(null)}
          onSave={() => {
            setEditingRow(null);
            router.visit(route('staging-projects.show', batch.batch_uuid));
          }}
        />
      )}
    </div>
  );
};

Show.layout = page => <Layout title="Batch Details" children={page} />;

export default Show;
