import React, { useMemo } from 'react';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';

const UnitForm = ({
  data,
  setData,
  errors,
  processing,
  onSubmit,
  submitLabel,
  projects = [],
  properties = [],
  propertyTypes = [],
  propertyStatuses = [],
}) => {
  const filteredProperties = useMemo(() => {
    if (!data.project_id) return properties;
    return properties.filter(p => String(p.project_id) === String(data.project_id));
  }, [data.project_id, properties]);

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-wrap p-8 -mb-8 -mr-6">
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label="Unit Code"
          name="unit_code"
          errors={errors.unit_code}
          value={data.unit_code}
          onChange={e => setData('unit_code', e.target.value)}
        />
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label="Unit Number"
          name="unit_number"
          errors={errors.unit_number}
          value={data.unit_number}
          onChange={e => setData('unit_number', e.target.value)}
        />
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label="External ID"
          name="unit_external_id"
          errors={errors.unit_external_id}
          value={data.unit_external_id}
          onChange={e => setData('unit_external_id', e.target.value)}
        />

        <SelectInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="Project"
          name="project_id"
          errors={errors.project_id}
          value={data.project_id}
          onChange={e => {
            setData('project_id', e.target.value);
            setData('property_id', '');
          }}
        >
          <option value=""></option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </SelectInput>

        <SelectInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="Property"
          name="property_id"
          errors={errors.property_id}
          value={data.property_id}
          onChange={e => setData('property_id', e.target.value)}
        >
          <option value=""></option>
          {filteredProperties.map(p => <option key={p.id} value={p.id}>{p.property_code}</option>)}
        </SelectInput>

        <SelectInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="Property Type"
          name="property_type_id"
          errors={errors.property_type_id}
          value={data.property_type_id}
          onChange={e => setData('property_type_id', e.target.value)}
        >
          <option value=""></option>
          {propertyTypes.map(pt => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
        </SelectInput>

        <SelectInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="Status"
          name="status_id"
          errors={errors.status_id}
          value={data.status_id}
          onChange={e => setData('status_id', e.target.value)}
        >
          <option value=""></option>
          {propertyStatuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </SelectInput>

        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="Neighborhood"
          name="neighborhood"
          errors={errors.neighborhood}
          value={data.neighborhood}
          onChange={e => setData('neighborhood', e.target.value)}
        />

        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="Floor"
          name="floor"
          errors={errors.floor}
          value={data.floor}
          onChange={e => setData('floor', e.target.value)}
        />

        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label="Area (sqm)"
          name="area"
          errors={errors.area}
          value={data.area}
          onChange={e => setData('area', e.target.value)}
        />
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label="Building Surface Area"
          name="building_surface_area"
          errors={errors.building_surface_area}
          value={data.building_surface_area}
          onChange={e => setData('building_surface_area', e.target.value)}
        />
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label="Housh Area"
          name="housh_area"
          errors={errors.housh_area}
          value={data.housh_area}
          onChange={e => setData('housh_area', e.target.value)}
        />

        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="Rooms"
          name="rooms"
          errors={errors.rooms}
          value={data.rooms}
          onChange={e => setData('rooms', e.target.value)}
        />
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="WC Number"
          name="wc_number"
          errors={errors.wc_number}
          value={data.wc_number}
          onChange={e => setData('wc_number', e.target.value)}
        />

        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="Price"
          name="price"
          type="number"
          step="0.01"
          errors={errors.price}
          value={data.price}
          onChange={e => setData('price', e.target.value)}
        />
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="Price Base"
          name="price_base"
          type="number"
          step="0.01"
          errors={errors.price_base}
          value={data.price_base}
          onChange={e => setData('price_base', e.target.value)}
        />

        <TextInput
          className="w-full pb-8 pr-6"
          label="Status Reason"
          name="status_reason"
          errors={errors.status_reason}
          value={data.status_reason}
          onChange={e => setData('status_reason', e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
        <LoadingButton loading={processing} type="submit" className="btn-indigo">
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  );
};

export default UnitForm;
