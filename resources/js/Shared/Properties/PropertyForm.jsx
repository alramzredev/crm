import React, { useMemo } from 'react';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import CityMunicipalityNeighborhoodSelector from '@/Shared/CityMunicipalityNeighborhoodSelector';

const PropertyForm = ({
  data,
  setData,
  errors,
  processing,
  onSubmit,
  submitLabel,
  owners = [],
  projects = [],
  cities = [],
  municipalities = [],
  neighborhoods = [],
  propertyStatuses = [],
  propertyTypes = [],
  propertyClasses = [],
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-wrap p-8 -mb-8 -mr-6">
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label="Property Code"
          name="property_code"
          errors={errors.property_code}
          value={data.property_code}
          onChange={e => setData('property_code', e.target.value)}
        />
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label="Property No"
          name="property_no"
          errors={errors.property_no}
          value={data.property_no}
          onChange={e => setData('property_no', String(e.target.value))}
          maxLength={150}
        />
        <SelectInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label="Project"
          name="project_id"
          errors={errors.project_id}
          value={data.project_id}
          onChange={e => setData('project_id', e.target.value)}
        >
          <option value=""></option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </SelectInput>

        <SelectInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="Owner"
          name="owner_id"
          errors={errors.owner_id}
          value={data.owner_id}
          onChange={e => setData('owner_id', e.target.value)}
        >
          <option value=""></option>
          {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
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

        <CityMunicipalityNeighborhoodSelector
          data={data}
          setData={setData}
          errors={errors}
          cities={cities}
          municipalities={municipalities}
          neighborhoods={neighborhoods}
          showCity={true}
          showMunicipality={true}
          showNeighborhood={true}
        />

        <SelectInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label="Type"
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
          label="Class"
          name="property_class_id"
          errors={errors.property_class_id}
          value={data.property_class_id}
          onChange={e => setData('property_class_id', e.target.value)}
        >
          <option value=""></option>
          {propertyClasses.map(pc => <option key={pc.id} value={pc.id}>{pc.name}</option>)}
        </SelectInput>

        <TextInput className="w-full pb-8 pr-6 lg:w-1/4" label="Diagram #" name="diagram_number" errors={errors.diagram_number} value={data.diagram_number} onChange={e => setData('diagram_number', e.target.value)} />
        <TextInput className="w-full pb-8 pr-6 lg:w-1/4" label="Instrument #" name="instrument_no" errors={errors.instrument_no} value={data.instrument_no} onChange={e => setData('instrument_no', e.target.value)} />
        <TextInput className="w-full pb-8 pr-6 lg:w-1/4" label="License #" name="license_no" errors={errors.license_no} value={data.license_no} onChange={e => setData('license_no', e.target.value)} />
        <TextInput className="w-full pb-8 pr-6 lg:w-1/4" label="Lot #" name="lot_no" errors={errors.lot_no} value={data.lot_no} onChange={e => setData('lot_no', e.target.value)} />

        <TextInput className="w-full pb-8 pr-6 lg:w-1/3" label="Total Sq. Meter" name="total_square_meter" errors={errors.total_square_meter} value={data.total_square_meter} onChange={e => setData('total_square_meter', e.target.value)} />
        <TextInput className="w-full pb-8 pr-6 lg:w-1/3" label="Total Units" name="total_units" errors={errors.total_units} value={data.total_units} onChange={e => setData('total_units', e.target.value)} />
        <TextInput className="w-full pb-8 pr-6 lg:w-1/3" label="Available Count" name="count_available" errors={errors.count_available} value={data.count_available} onChange={e => setData('count_available', e.target.value)} />

        <TextInput className="w-full pb-8 pr-6" label="Notes" name="notes" errors={errors.notes} value={data.notes} onChange={e => setData('notes', e.target.value)} />
      </div>

      <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
        <LoadingButton loading={processing} type="submit" className="btn-indigo">
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  );
};

export default PropertyForm;
