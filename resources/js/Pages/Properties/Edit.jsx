import React from 'react';
import Helmet from 'react-helmet';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import PropertyForm from '@/Shared/Properties/PropertyForm';
import TrashedMessage from '@/Shared/TrashedMessage';

const Edit = () => {
  const { property, projects = [], owners = [], municipalities = [], neighborhoods = [], propertyStatuses = [], propertyTypes = [], propertyClasses = [] } = usePage().props;
  const { data, setData, errors, put, processing } = useForm({
    project_id: property.project_id || '',
    owner_id: property.owner_id || '',
    property_code: property.property_code || '',
    property_no: property.property_no || '',
    municipality_id: property.neighborhood?.municipality_id || '',
    neighborhood_id: property.neighborhood_id || '',
    property_type_id: property.property_type_id || '',
    property_class_id: property.property_class_id || '',
    status_id: property.status_id || '',
    diagram_number: property.diagram_number || '',
    instrument_no: property.instrument_no || '',
    license_no: property.license_no || '',
    lot_no: property.lot_no || '',
    total_square_meter: property.total_square_meter || '',
    total_units: property.total_units || '',
    count_available: property.count_available || '',
    notes: property.notes || ''
  });

  function handleSubmit(e) {
    e.preventDefault();
    put(route('properties.update', property.id));
  }

  function destroy() {
    if (confirm('Are you sure you want to delete this property?')) {
      router.delete(route('properties.destroy', property.id));
    }
  }

  function restore() {
    if (confirm('Are you sure you want to restore this property?')) {
      router.put(route('properties.restore', property.id));
    }
  }

  return (
    <div>
      <Helmet title={data.property_code} />
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('properties')} className="text-indigo-600 hover:text-indigo-700">
          Properties
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {data.property_code}
      </h1>
      {property.deleted_at && (
        <TrashedMessage onRestore={restore}>
          This property has been deleted.
        </TrashedMessage>
      )}
      <div className="max-w-4xl bg-white rounded shadow">
        <PropertyForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel="Update Property"
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

Edit.layout = page => <Layout children={page} />;

export default Edit;
