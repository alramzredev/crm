import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import PropertyForm from '@/Shared/Properties/PropertyForm';

const Create = () => {
  const { projects = [], owners = [], municipalities = [], neighborhoods = [], propertyStatuses = [], propertyTypes = [], propertyClasses = [], defaults = {} } = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    project_id: defaults.project_id || '',
    owner_id: defaults.owner_id || '',
    property_code: '',
    property_no: '',
    municipality_id: defaults.municipality_id || '',
    neighborhood_id: defaults.neighborhood_id || '',
    property_type_id: '',
    property_class_id: '',
    status_id: defaults.status_id || '',
    diagram_number: '',
    instrument_no: '',
    license_no: '',
    lot_no: '',
    total_square_meter: '',
    total_units: '',
    count_available: '',
    notes: ''
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('properties.store'));
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('properties')} className="text-indigo-600 hover:text-indigo-700">
          Properties
        </Link>
        <span className="font-medium text-indigo-600"> /</span> Create
      </h1>
      <div className="max-w-4xl bg-white rounded shadow">
        <PropertyForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel="Create Property"
          owners={owners}
          projects={projects}
          municipalities={municipalities}
          neighborhoods={neighborhoods}
          propertyStatuses={propertyStatuses}
          propertyTypes={propertyTypes}
          propertyClasses={propertyClasses}
        />
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create Property" children={page} />;

export default Create;
