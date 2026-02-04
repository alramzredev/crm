import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import TrashedMessage from '@/Shared/TrashedMessage';

const Show = () => {
  const { unit, auth } = usePage().props;

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  const projectLabel = unit.project?.name || '—';
  const propertyLabel = unit.property?.property_code || '—';
  const propertyTypeLabel = unit.property_type?.name || '—';
  const statusLabel = unit.status?.name || '—';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          <Link href={route('units')} className="text-indigo-600 hover:text-indigo-700">
            Units
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {unit.unit_code || unit.unit_number || `Unit #${unit.id}`}
        </h1>
        {can('units.edit') && (
          <Link className="btn-indigo" href={route('units.edit', unit.id)}>
            Edit
          </Link>
        )}
      </div>

      {unit.deleted_at && (
        <TrashedMessage>This unit has been deleted.</TrashedMessage>
      )}

      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <div className="p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-gray-600">Unit Code</div>
              <div className="mt-1">{unit.unit_code || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Unit Number</div>
              <div className="mt-1">{unit.unit_number || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">External ID</div>
              <div className="mt-1">{unit.unit_external_id || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Status</div>
              <div className="mt-1">{statusLabel}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Project</div>
              <div className="mt-1">
                {unit.project ? (
                  <Link href={route('projects.show', unit.project.id)} className="text-indigo-600 hover:text-indigo-800">
                    {projectLabel}
                  </Link>
                ) : '—'}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Property</div>
              <div className="mt-1">
                {unit.property ? (
                  <Link href={route('properties.show', unit.property.id)} className="text-indigo-600 hover:text-indigo-800">
                    {propertyLabel}
                  </Link>
                ) : '—'}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Property Type</div>
              <div className="mt-1">{propertyTypeLabel}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Neighborhood</div>
              <div className="mt-1">{unit.neighborhood || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Floor</div>
              <div className="mt-1">{unit.floor || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Area (sqm)</div>
              <div className="mt-1">{unit.area || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Building Surface Area</div>
              <div className="mt-1">{unit.building_surface_area || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Housh Area</div>
              <div className="mt-1">{unit.housh_area || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Rooms</div>
              <div className="mt-1">{unit.rooms || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">WC Number</div>
              <div className="mt-1">{unit.wc_number || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Price</div>
              <div className="mt-1">{unit.price ? `SAR ${parseFloat(unit.price).toFixed(2)}` : '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Price Base</div>
              <div className="mt-1">{unit.price_base ? `SAR ${parseFloat(unit.price_base).toFixed(2)}` : '—'}</div>
            </div>
            {unit.status_reason && (
              <div className="sm:col-span-2">
                <div className="text-sm font-semibold text-gray-600">Status Reason</div>
                <div className="mt-1">{unit.status_reason}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Show.layout = page => <Layout title="Unit" children={page} />;

export default Show;
