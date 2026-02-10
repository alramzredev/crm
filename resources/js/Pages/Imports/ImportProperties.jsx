import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';

const ImportProperties = () => {
  const [showRules, setShowRules] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    file: null,
    update_existing: false,
    skip_duplicates: true,
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('properties.import'), { forceFormData: true });
  }

  function downloadSample() {
    window.location.href = route('imports.sample', { type: 'properties' });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Import Properties</h1>
        <p className="text-gray-600 mt-2">Upload an Excel file to import properties in bulk.</p>
      </div>

      <div className="max-w-2xl bg-white rounded shadow overflow-hidden">
        {/* Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Important:</strong> Projects must exist before importing properties. Owner and status must also exist in the system.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 border-b border-gray-200">
            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Excel File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition">
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={e => setData('file', e.target.files[0])}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-12-8v12m0 0l-4-4m4 4l4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-indigo-600 hover:text-indigo-500">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">XLSX or CSV up to 10MB</p>
                </label>
              </div>
              {data.file && <p className="mt-2 text-sm text-green-600">✓ {data.file.name}</p>}
              {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
            </div>

            {/* Validation Rules */}
            <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <button
                type="button"
                onClick={() => setShowRules(!showRules)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-medium text-blue-900">Validation Rules</span>
                <svg className={`h-5 w-5 text-blue-500 transition ${showRules ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showRules && (
                <ul className="mt-3 text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Property code is required and must be unique per project</li>
                  <li>Project code is required (must exist)</li>
                  <li>Owner name is required (must exist)</li>
                  <li>Status is required (must exist)</li>
                </ul>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.update_existing}
                  onChange={e => setData('update_existing', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-700">Update existing properties if code matches</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.skip_duplicates}
                  onChange={e => setData('skip_duplicates', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-700">Skip duplicate codes</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-8 py-4 bg-gray-100 border-t border-gray-200">
            <button
              type="button"
              onClick={downloadSample}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              📥 Download Sample Template
            </button>
            <div className="flex gap-3">
              <Link href={route('dashboard')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Cancel
              </Link>
              <LoadingButton
                loading={processing}
                disabled={!data.file}
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                Upload & Import
              </LoadingButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

ImportProperties.layout = page => <Layout title="Import Properties" children={page} />;

export default ImportProperties;
