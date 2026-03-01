import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import { useTranslation } from 'react-i18next';

const ImportProjects = () => {
  const [showRules, setShowRules] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    file: null,
    update_existing: false,
    skip_duplicates: true,
  });
  const { t } = useTranslation();

  function handleSubmit(e) {
    e.preventDefault();
    post(route('projects.import'), { forceFormData: true });
  }

  function downloadSample() {
    window.location.href = route('imports.template', { type: 'projects_template' });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('import_projects')}</h1>
        <p className="text-gray-600 mt-2">{t('import_projects_desc')}</p>
      </div>

      <div className="max-w-2xl bg-white rounded shadow overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-8 border-b border-gray-200">
            {/* File Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('select_excel_file')}
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
              {data.file && (
                <p className="mt-2 text-sm text-green-600">✓ {data.file.name}</p>
              )}
              {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
            </div>

            {/* Validation Rules */}
            <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <button
                type="button"
                onClick={() => setShowRules(!showRules)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-medium text-blue-900">{t('validation_rules')}</span>
                <svg className={`h-5 w-5 text-blue-500 transition ${showRules ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showRules && (
                <ul className="mt-3 text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li><strong>{t('project_code')}</strong> — {t('required_unique')}</li>
                  <li><strong>{t('name')}</strong> — {t('required_string')}</li>
                  <li><strong>{t('owner_name')}</strong> — {t('required_exist_system')}</li>
                  <li><strong>{t('city_name')}</strong> — {t('required_exist_system')}</li>
                  <li><strong>{t('status_name')}</strong> — {t('required_exist_system')}</li>
                  <li><strong>{t('project_type_name')}</strong> — {t('required_exist_system')}</li>
                  <li><strong>{t('reservation_period_days')}</strong> — {t('optional_1_365_days')}</li>
                </ul>
              )}
            </div>

            {/* Import Options */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.update_existing}
                  onChange={e => setData('update_existing', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="m-2 text-sm text-gray-700">{t('update_existing_projects')}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.skip_duplicates}
                  onChange={e => setData('skip_duplicates', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="m-2 text-sm text-gray-700">{t('skip_duplicate_codes')}</span>
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
              📥 {t('download_sample_template')}
            </button>
            <div className="flex gap-3">
              <Link
                href={route('dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                {t('cancel')}
              </Link>
              <LoadingButton
                loading={processing}
                disabled={!data.file}
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {t('upload_import')}
              </LoadingButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

ImportProjects.layout = page => <Layout title="Import Projects" children={page} />;

export default ImportProjects;
