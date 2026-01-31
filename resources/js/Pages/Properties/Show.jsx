import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import TrashedMessage from '@/Shared/TrashedMessage';

const Show = () => {
  const { property } = usePage().props;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          <Link href={route('properties')} className="text-indigo-600 hover:text-indigo-700">Properties</Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {property.property_code}
        </h1>
        <Link className="btn-indigo" href={route('properties.edit', property.id)}>Edit</Link>
      </div>

      {property.deleted_at && (
        <TrashedMessage>This property has been deleted.</TrashedMessage>
      )}

      <div className="max-w-4xl overflow-hidden bg-white rounded shadow">
        <div className="p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-gray-600">Project</div>
              <div className="mt-1">{property.project?.name || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Owner</div>
              <div className="mt-1">{property.owner?.name || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Status</div>
              <div className="mt-1">{property.status?.name || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Neighborhood</div>
              <div className="mt-1">{property.neighborhood?.name || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Type</div>
              <div className="mt-1">{property.propertyType?.name || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Class</div>
              <div className="mt-1">{property.propertyClass?.name || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Total Sq. Meter</div>
              <div className="mt-1">{property.total_square_meter || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Total Units</div>
              <div className="mt-1">{property.total_units || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Available Count</div>
              <div className="mt-1">{property.count_available ?? '—'}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-sm font-semibold text-gray-600">Notes</div>
              <div className="mt-1">{property.notes || '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Show.layout = page => <Layout title="Property" children={page} />;

export default Show;
