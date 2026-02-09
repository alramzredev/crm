import React from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import LoadingButton from '@/Shared/LoadingButton';

const EditRowModal = ({ row, onClose, onSave }) => {
  const { data, setData, post, processing, errors } = useForm({
    project_code: row.project_code || '',
    name: row.name || '',
    owner_name: row.owner_name || '',
    city_name: row.city_name || '',
    project_type_name: row.project_type_name || '',
    status_name: row.status_name || '',
    neighborhood: row.neighborhood || '',
    reservation_period_days: row.reservation_period_days || '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('staging-projects.update', row.id), {
      onSuccess: onSave,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Fix Row #{row.row_number}</h2>
              <p className="text-sm text-gray-600">Batch ID: {row.import_batch_id?.slice(0, 8)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {row.error_message && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-800">Error:</p>
            <p className="text-sm text-red-700 mt-1">{row.error_message}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <TextInput
            label="Project Code"
            value={data.project_code}
            onChange={e => setData('project_code', e.target.value)}
            errors={errors.project_code}
          />
          <TextInput
            label="Project Name"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            errors={errors.name}
          />
          <TextInput
            label="Owner Name"
            value={data.owner_name}
            onChange={e => setData('owner_name', e.target.value)}
            errors={errors.owner_name}
          />
          <TextInput
            label="City"
            value={data.city_name}
            onChange={e => setData('city_name', e.target.value)}
            errors={errors.city_name}
          />
          <TextInput
            label="Neighborhood"
            value={data.neighborhood}
            onChange={e => setData('neighborhood', e.target.value)}
            errors={errors.neighborhood}
          />
          <TextInput
            label="Project Type"
            value={data.project_type_name}
            onChange={e => setData('project_type_name', e.target.value)}
            errors={errors.project_type_name}
          />
          <TextInput
            label="Status"
            value={data.status_name}
            onChange={e => setData('status_name', e.target.value)}
            errors={errors.status_name}
          />
          <TextInput
            label="Reservation Period (Days)"
            type="number"
            value={data.reservation_period_days}
            onChange={e => setData('reservation_period_days', e.target.value)}
            errors={errors.reservation_period_days}
          />

          {/* Original Values */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Original Excel Values</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Code: {row.project_code || '—'}</div>
              <div>Name: {row.name || '—'}</div>
              <div>Owner: {row.owner_name || '—'}</div>
              <div>City: {row.city_name || '—'}</div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <LoadingButton
            loading={processing}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
            }}
            className="btn-indigo"
          >
            Save & Revalidate
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default EditRowModal;
