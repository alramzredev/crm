import React from 'react';
import SelectInput from '@/Shared/SelectInput';

const UnitSelectionStep = ({ data, handleChange, projects, properties, units, selectedUnit }) => {
  return (
    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
      <SelectInput
        className="w-full pb-8 pr-6 lg:w-1/3"
        label="Project"
        name="project_id"
        value={data.project_id}
        onChange={e => handleChange('project_id', e.target.value)}
      >
        <option value="">Select Project</option>
        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </SelectInput>

      <SelectInput
        className="w-full pb-8 pr-6 lg:w-1/3"
        label="Property"
        name="property_id"
        value={data.property_id}
        onChange={e => handleChange('property_id', e.target.value)}
        disabled={!data.project_id}
      >
        <option value="">Select Property</option>
        {properties.map(p => <option key={p.id} value={p.id}>{p.property_code}</option>)}
      </SelectInput>

      <SelectInput
        className="w-full pb-8 pr-6 lg:w-1/3"
        label="Unit"
        name="unit_id"
        value={data.unit_id}
        onChange={e => handleChange('unit_id', e.target.value)}
        disabled={!data.property_id}
      >
        <option value="">Select Unit</option>
        {units.map(u => <option key={u.id} value={u.id}>{u.unit_code} - {u.unit_number}</option>)}
      </SelectInput>
    </div>
  );
};

export default UnitSelectionStep;
