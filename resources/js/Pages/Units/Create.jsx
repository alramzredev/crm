import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import UnitForm from '@/Shared/Units/UnitForm';

const Create = () => {
  const { projects = [], properties = [], propertyTypes = [], propertyStatuses = [], unitTypes = [], defaults = {}, property = null } = usePage().props;

  // Determine if fields should be read-only
  const isPropertyPredefined = Boolean(property);

  const { data, setData, errors, post, processing } = useForm({
    project_id: defaults.project_id || '',
    property_id: defaults.property_id || '',
    unit_code: '',
    unit_external_id: '',
    property_type_id: '',
    status_id: defaults.status_id || '',
    neighborhood: '',
    status_reason: '',
    floor: '',
    area: '',
    building_surface_area: '',
    housh_area: '',
    rooms: '',
    wc_number: '',
    price: '',
    price_base: '',
    currency: 'SAR',
    exchange_rate: '',
    model: '',
    purpose: '',
    unit_type: '',
    owner: '',
    instrument_no: '',
    instrument_hijri_date: '',
    instrument_no_after_sales: '',
    // Boolean features
    has_balcony: false,
    has_basement: false,
    has_basement_parking: false,
    has_big_housh: false,
    has_small_housh: false,
    has_housh: false,
    has_big_roof: false,
    has_small_roof: false,
    has_roof: false,
    has_rooftop: false,
    has_pool: false,
    has_pool_view: false,
    has_tennis_view: false,
    has_golf_view: false,
    has_caffe_view: false,
    has_waterfall: false,
    has_elevator: false,
    has_private_entrance: false,
    has_two_interfaces: false,
    has_security_system: false,
    has_internet: false,
    has_kitchen: false,
    has_laundry_room: false,
    has_internal_store: false,
    has_warehouse: false,
    has_living_room: false,
    has_family_lounge: false,
    has_big_lounge: false,
    has_food_area: false,
    has_council: false,
    has_diwaniyah: false,
    has_diwan1: false,
    has_mens_council: false,
    has_womens_council: false,
    has_family_council: false,
    has_maids_room: false,
    has_drivers_room: false,
    has_terrace: false,
    has_outdoor: false,
    unit_description_en: '',
    national_address: '',
    water_meter_no: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('units.store'));
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('units')} className="text-indigo-600 hover:text-indigo-700">
          Units
        </Link>
        <span className="font-medium text-indigo-600"> /</span> Create
        {property && (
          <>
            <span className="mx-2 font-medium text-gray-400">/</span>
            <span className="text-gray-600">{property.property_code}</span>
          </>
        )}
      </h1>
      <div className="max-w-4xl bg-white rounded shadow">
        <UnitForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel="Create Unit"
          projects={projects}
          properties={properties}
          propertyTypes={propertyTypes}
          propertyStatuses={propertyStatuses}
          unitTypes={unitTypes}
          isPropertyPredefined={isPropertyPredefined}
          predefinedProperty={property}
        />
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create Unit" children={page} />;

export default Create;
