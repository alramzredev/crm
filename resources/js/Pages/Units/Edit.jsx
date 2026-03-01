import React from 'react';
import Helmet from 'react-helmet';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import TrashedMessage from '@/Shared/TrashedMessage';
import UnitForm from '@/Shared/Units/UnitForm';
import { useTranslation } from 'react-i18next';

const Edit = () => {
  const { unit = {}, projects = [], properties = [], propertyTypes = [], propertyStatuses = [], unitTypes = [], cities = [], municipalities = [], neighborhoods = [] } = usePage().props;
  const { data, setData, errors, put, processing } = useForm({
    project_id: unit.project?.id || '',
    property_id: unit.property?.id || '',
    unit_code: unit.unit_code || '',
    unit_external_id: unit.unit_external_id || '',
    property_type_id: unit.property_type?.id || '',
    status_id: unit.status?.id || '',
    neighborhood_id: unit.neighborhood?.id || '',
    status_reason: unit.status_reason || '',
    floor: unit.floor || '',
    area: unit.area || '',
    building_surface_area: unit.building_surface_area || '',
    housh_area: unit.housh_area || '',
    rooms: unit.rooms || '',
    wc_number: unit.wc_number || '',
    price: unit.price || '',
    price_base: unit.price_base || '',
    currency: unit.currency || 'SAR',
    exchange_rate: unit.exchange_rate || '',
    model: unit.model || '',
    purpose: unit.purpose || '',
    unit_type: unit.unit_type || '',
    owner: unit.owner || '',
    instrument_no: unit.instrument_no || '',
    instrument_hijri_date: unit.instrument_hijri_date || '',
    instrument_no_after_sales: unit.instrument_no_after_sales || '',
    // Boolean features
    has_balcony: unit.has_balcony || false,
    has_basement: unit.has_basement || false,
    has_basement_parking: unit.has_basement_parking || false,
    has_big_housh: unit.has_big_housh || false,
    has_small_housh: unit.has_small_housh || false,
    has_housh: unit.has_housh || false,
    has_big_roof: unit.has_big_roof || false,
    has_small_roof: unit.has_small_roof || false,
    has_roof: unit.has_roof || false,
    has_rooftop: unit.has_rooftop || false,
    has_pool: unit.has_pool || false,
    has_pool_view: unit.has_pool_view || false,
    has_tennis_view: unit.has_tennis_view || false,
    has_golf_view: unit.has_golf_view || false,
    has_caffe_view: unit.has_caffe_view || false,
    has_waterfall: unit.has_waterfall || false,
    has_elevator: unit.has_elevator || false,
    has_private_entrance: unit.has_private_entrance || false,
    has_two_interfaces: unit.has_two_interfaces || false,
    has_security_system: unit.has_security_system || false,
    has_internet: unit.has_internet || false,
    has_kitchen: unit.has_kitchen || false,
    has_laundry_room: unit.has_laundry_room || false,
    has_internal_store: unit.has_internal_store || false,
    has_warehouse: unit.has_warehouse || false,
    has_living_room: unit.has_living_room || false,
    has_family_lounge: unit.has_family_lounge || false,
    has_big_lounge: unit.has_big_lounge || false,
    has_food_area: unit.has_food_area || false,
    has_council: unit.has_council || false,
    has_diwaniyah: unit.has_diwaniyah || false,
    has_diwan1: unit.has_diwan1 || false,
    has_mens_council: unit.has_mens_council || false,
    has_womens_council: unit.has_womens_council || false,
    has_family_council: unit.has_family_council || false,
    has_maids_room: unit.has_maids_room || false,
    has_drivers_room: unit.has_drivers_room || false,
    has_terrace: unit.has_terrace || false,
    has_outdoor: unit.has_outdoor || false,
    unit_description_en: unit.unit_description_en || '',
    national_address: unit.national_address || '',
    water_meter_no: unit.water_meter_no || '',
    city_id: unit.city?.id || unit.city_id || '',
    municipality_id: unit.municipality?.id || unit.municipality_id || '',
  });
  const { t } = useTranslation();

  function handleSubmit(e) {
    e.preventDefault();
    put(route('units.update', unit.id));
  }

  function destroy() {
    if (confirm('Are you sure you want to delete this unit?')) {
      router.delete(route('units.destroy', unit.id));
    }
  }

  function restore() {
    if (confirm('Are you sure you want to restore this unit?')) {
      router.put(route('units.restore', unit.id));
    }
  }

  return (
    <div>
      <Helmet title={unit.unit_code || 'Edit Unit'} />
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('units')} className="text-indigo-600 hover:text-indigo-700">
          {t('units')}
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        <Link href={route('units.show', unit.id)} className="text-indigo-600 hover:text-indigo-700">
          {unit.unit_code || unit.unit_number || `Unit #${unit.id}`}
        </Link>
      </h1>
      {unit.deleted_at && (
        <TrashedMessage onRestore={restore}>
          {t('unit_deleted')}
        </TrashedMessage>
      )}
      <div className="max-w-4xl overflow-hidden bg-white rounded shadow">
        <UnitForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel="Update Unit"
          projects={projects}
          properties={properties}
          propertyTypes={propertyTypes}
          propertyStatuses={propertyStatuses}
          unitTypes={unitTypes}
          cities={cities}
          municipalities={municipalities}
          neighborhoods={neighborhoods}
        />
        <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
          {!unit.deleted_at && (
            <DeleteButton onDelete={destroy}>
              Delete Unit
            </DeleteButton>
          )}
        </div>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
