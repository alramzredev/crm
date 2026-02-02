import React from 'react';
import Helmet from 'react-helmet';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import TrashedMessage from '@/Shared/TrashedMessage';
import UnitForm from '@/Shared/Units/UnitForm';

const Edit = () => {
  const { unit = {}, projects = [], properties = [], propertyTypes = [], propertyStatuses = [] } = usePage().props;
  const { data, setData, errors, put, processing } = useForm({
    project_id: unit.project?.id || '',
    property_id: unit.property?.id || '',
    unit_code: unit.unit_code || '',
    unit_number: unit.unit_number || '',
    unit_external_id: unit.unit_external_id || '',
    property_type_id: unit.property_type?.id || '',
    status_id: unit.status?.id || '',
    neighborhood: unit.neighborhood || '',
    status_reason: unit.status_reason || '',
    floor: unit.floor || '',
    area: unit.area || '',
    building_surface_area: unit.building_surface_area || '',
    housh_area: unit.housh_area || '',
    rooms: unit.rooms || '',
    wc_number: unit.wc_number || '',
  });

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
          Units
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        <Link href={route('units.show', unit.id)} className="text-indigo-600 hover:text-indigo-700">
          {unit.unit_code || unit.unit_number || `Unit #${unit.id}`}
        </Link>
      </h1>
      {unit.deleted_at && (
        <TrashedMessage onRestore={restore}>
          This unit has been deleted.
        </TrashedMessage>
      )}
      <div className="max-w-4xl overflow-hidden bg-white rounded shadow">
        <form onSubmit={handleSubmit}>
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
          />
          <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
            {!unit.deleted_at && (
              <DeleteButton onDelete={destroy}>
                Delete Unit
              </DeleteButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
