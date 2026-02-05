import React from 'react';
import ApiSearchableSelectInput from '@/Shared/ApiSearchableSelectInput';

const UnitSelectionStep = ({ data, handleChange, projects, properties, units, selectedUnit }) => {
  return (
    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
      <ApiSearchableSelectInput
        className="w-full pb-8 pr-6 lg:w-1/3"
        label="Project"
        name="project_id"
        value={data.project_id}
        onChange={e => handleChange('project_id', e.target.value)}
        apiUrl={route('search.projects')}
        placeholder="Search project..."
      />

      <ApiSearchableSelectInput
        className="w-full pb-8 pr-6 lg:w-1/3"
        label="Property"
        name="property_id"
        value={data.property_id}
        onChange={e => handleChange('property_id', e.target.value)}
        disabled={!data.project_id}
        apiUrl={route('search.properties') + `?project_id=${data.project_id}`}
        placeholder="Search property..."
      />

      <ApiSearchableSelectInput
        className="w-full pb-8 pr-6 lg:w-1/3"
        label="Unit"
        name="unit_id"
        value={data.unit_id}
        onChange={e => handleChange('unit_id', e.target.value)}
        disabled={!data.property_id}
        apiUrl={route('search.units') + `?property_id=${data.property_id}`}
        placeholder="Search unit..."
      />
    </div>
  );
};

export default UnitSelectionStep;
