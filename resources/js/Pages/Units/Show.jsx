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
  const neighborhoodLabel = unit.neighborhood?.name || '—';

  const featureItems = [
    ['Balcony', unit.has_balcony],
    ['Basement', unit.has_basement],
    ['Basement Parking', unit.has_basement_parking],
    ['Big Housh', unit.has_big_housh],
    ['Small Housh', unit.has_small_housh],
    ['Housh', unit.has_housh],
    ['Big Roof', unit.has_big_roof],
    ['Small Roof', unit.has_small_roof],
    ['Roof', unit.has_roof],
    ['Rooftop', unit.has_rooftop],
    ['Pool', unit.has_pool],
    ['Pool View', unit.has_pool_view],
    ['Tennis View', unit.has_tennis_view],
    ['Golf View', unit.has_golf_view],
    ['Caffe View', unit.has_caffe_view],
    ['Waterfall', unit.has_waterfall],
    ['Elevator', unit.has_elevator],
    ['Private Entrance', unit.has_private_entrance],
    ['Two Interfaces', unit.has_two_interfaces],
    ['Security System', unit.has_security_system],
    ['Internet', unit.has_internet],
    ['Kitchen', unit.has_kitchen],
    ['Laundry Room', unit.has_laundry_room],
    ['Internal Store', unit.has_internal_store],
    ['Warehouse', unit.has_warehouse],
    ['Living Room', unit.has_living_room],
    ['Family Lounge', unit.has_family_lounge],
    ['Big Lounge', unit.has_big_lounge],
    ['Food Area', unit.has_food_area],
    ['Council', unit.has_council],
    ['Diwaniyah', unit.has_diwaniyah],
    ['Diwan 1', unit.has_diwan1],
    ["Men's Council", unit.has_mens_council],
    ["Women's Council", unit.has_womens_council],
    ['Family Council', unit.has_family_council],
    ['Maids Room', unit.has_maids_room],
    ['Drivers Room', unit.has_drivers_room],
    ['Terrace', unit.has_terrace],
    ['Outdoor', unit.has_outdoor],
  ];

  const enabledFeatures = featureItems.filter(([, enabled]) => !!enabled);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          <Link href={route('units')} className="text-indigo-600 hover:text-indigo-700">
            Units
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {unit.unit_code || `Unit #${unit.id}`}
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
          {/* Basic Information */}
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
            <div>
              <div className="text-sm font-semibold text-gray-600">Unit Code</div>
              <div className="mt-1">{unit.unit_code || '—'}</div>
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
              <div className="mt-1">{neighborhoodLabel}</div>
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
            {unit.exchange_rate && (
              <div>
                <div className="text-sm font-semibold text-gray-600">Exchange Rate</div>
                <div className="mt-1">{unit.exchange_rate}</div>
              </div>
            )}
            {unit.model && (
              <div>
                <div className="text-sm font-semibold text-gray-600">Model</div>
                <div className="mt-1">{unit.model}</div>
              </div>
            )}
          </div>

          {/* Financial Information */}
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Financial Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
            <div>
              <div className="text-sm font-semibold text-gray-600">Currency</div>
              <div className="mt-1">{unit.currency || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Exchange Rate</div>
              <div className="mt-1">{unit.exchange_rate || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Model</div>
              <div className="mt-1">{unit.model || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Purpose</div>
              <div className="mt-1">{unit.purpose || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Unit Type</div>
              <div className="mt-1">{unit.unit_type || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Owner</div>
              <div className="mt-1">{unit.owner || '—'}</div>
            </div>
          </div>

          {/* Legal / Document Information */}
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Legal / Document Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
            <div>
              <div className="text-sm font-semibold text-gray-600">Instrument No</div>
              <div className="mt-1">{unit.instrument_no || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Instrument Hijri Date</div>
              <div className="mt-1">{unit.instrument_hijri_date || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Instrument No (After Sales)</div>
              <div className="mt-1">{unit.instrument_no_after_sales || '—'}</div>
            </div>
          </div>

          {/* Features */}
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Features</h3>
          {enabledFeatures.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {enabledFeatures.map(([label]) => (
                <div key={label} className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span> {label}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 mb-8">No features enabled.</div>
          )}

          {/* Additional Information */}
          {(unit.unit_description_en || unit.national_address || unit.water_meter_no) && (
            <>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Additional Information</h3>
              <div className="grid grid-cols-1 gap-6 mb-8">
                {unit.unit_description_en && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600">Description</div>
                    <div className="mt-1">{unit.unit_description_en}</div>
                  </div>
                )}
                {unit.national_address && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600">National Address</div>
                    <div className="mt-1">{unit.national_address}</div>
                  </div>
                )}
                {unit.water_meter_no && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600">Water Meter No</div>
                    <div className="mt-1">{unit.water_meter_no}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {unit.status_reason && (
            <div className="sm:col-span-2">
              <div className="text-sm font-semibold text-gray-600">Status Reason</div>
              <div className="mt-1">{unit.status_reason}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Show.layout = page => <Layout title="Unit" children={page} />;

export default Show;
