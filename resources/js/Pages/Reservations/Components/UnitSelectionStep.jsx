import React from 'react';
import ApiSearchableSelectInput from '@/Shared/ApiSearchableSelectInput';
import { useTranslation } from 'react-i18next';

const UnitSelectionStep = ({ data, handleChange, errors = {} }) => {
  const { t } = useTranslation();
  const handleProjectChange = (value) => {
    handleChange('project_id', value);
    handleChange('property_id', '');
    handleChange('unit_id', '');
  };

  const handlePropertyChange = (value) => {
    handleChange('property_id', value);
    handleChange('unit_id', '');
  };
  
  return (
    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
      <ApiSearchableSelectInput
        className="w-full pb-8 pr-6 lg:w-1/3"
        label={t('project')}
        name="project_id"
        value={data.project_id}
        onChange={e => handleProjectChange(e.target.value)}
        errors={errors.project_id}
        apiUrl={route('search.projects')}
        placeholder={t('search_project')}
        fetchOnMount={true}
      />

      <ApiSearchableSelectInput
        className="w-full pb-8 pr-6 lg:w-1/3"
        label={t('property')}
        name="property_id"
        value={data.property_id}
        onChange={e => handlePropertyChange(e.target.value)}
        errors={errors.property_id}
        disabled={!data.project_id}
        apiUrl={data.project_id ? route('search.properties') + `?project_id=${data.project_id}` : ''}
        placeholder={t('search_property')}
        key={`property-${data.project_id}`}
        fetchOnMount={true}
      />

      <ApiSearchableSelectInput
        className="w-full pb-8 pr-6 lg:w-1/3"
        label={t('unit')}
        name="unit_id"
        value={data.unit_id}
        onChange={e => handleChange('unit_id', e.target.value)}
        errors={errors.unit_id}
        disabled={!data.property_id}
        apiUrl={data.property_id ? route('search.units') + `?property_id=${data.property_id}` : ''}
        placeholder={t('search_unit')}
        key={`unit-${data.property_id}`}
        fetchOnMount={true}
      />
    </div>
  );
};

export default UnitSelectionStep;
