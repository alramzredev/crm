import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import UnitForm from '@/Shared/Units/UnitForm';

const Create = () => {
  const { projects = [], properties = [], propertyTypes = [], propertyStatuses = [], defaults = {} } = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    project_id: defaults.project_id || '',
    property_id: defaults.property_id || '',
    unit_code: '',
    unit_number: '',
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
        />
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create Unit" children={page} />;

export default Create;
