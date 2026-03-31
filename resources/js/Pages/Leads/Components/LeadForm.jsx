import React from 'react';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import { useTranslation } from 'react-i18next';
import ApiSearchableSelectInput from '@/Shared/ApiSearchableSelectInput';

const LeadForm = ({
  data,
  setData,
  errors,
  processing,
  onSubmit,
  submitLabel,
  leadSources = [],
  leadStatuses = [],
}) => {
  const { t } = useTranslation();
  const handleChange = (name, value) => setData(name, value);

  return (
    <form onSubmit={onSubmit}>
      {/* Identifiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b">
        <TextInput
          className="w-full"
          label={t('title')}
          name="title"
          errors={errors.title}
          value={data.title}
          onChange={e => handleChange('title', e.target.value)}
        />
        <TextInput
          className="w-full"
          label={t('national_id')}
          name="national_id"
          errors={errors.national_id}
          value={data.national_id}
          onChange={e => handleChange('national_id', e.target.value)}
        />
        <ApiSearchableSelectInput
          className="w-full"
          label={t('project')}
          name="project_id"
          value={data.project_id}
          onChange={e => handleChange('project_id', e.target.value)}
          errors={errors.project_id}
          apiUrl={route('search.projects')}
          placeholder={t('search_project')}
          fetchOnMount={true}
        />
        <SelectInput
          className="w-full"
          label={t('lead_source')}
          name="lead_source_id"
          errors={errors.lead_source_id}
          value={data.lead_source_id}
          onChange={e => handleChange('lead_source_id', e.target.value)}
        >
          <option value=""></option>
          {leadSources.map(ls => <option key={ls.id} value={ls.id}>{ls.name}</option>)}
        </SelectInput>
        <SelectInput
          className="w-full"
          label={t('status')}
          name="status_id"
          errors={errors.status_id}
          value={data.status_id}
          onChange={e => handleChange('status_id', e.target.value)}
        >
          <option value=""></option>
          {leadStatuses.map(ls => <option key={ls.id} value={ls.id}>{ls.name}</option>)}
        </SelectInput>
      </div>

      {/* Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b">
        <TextInput
          className="w-full"
          label={t('first_name')}
          name="first_name"
          errors={errors.first_name}
          value={data.first_name}
          onChange={e => handleChange('first_name', e.target.value)}
        />
        <TextInput
          className="w-full"
          label={t('last_name')}
          name="last_name"
          errors={errors.last_name}
          value={data.last_name}
          onChange={e => handleChange('last_name', e.target.value)}
        />
        <TextInput
          className="w-full"
          label={t('email')}
          name="email"
          type="email"
          errors={errors.email}
          value={data.email}
          onChange={e => handleChange('email', e.target.value)}
        />
        <TextInput
          className="w-full"
          label={t('phone')}
          name="phone"
          type="text"
          errors={errors.phone}
          value={data.phone}
          onChange={e => handleChange('phone', e.target.value)}
        />
      </div>

      {/* Files (if needed, can be added here) */}

      <div className="flex items-center justify-end px-6 py-4 bg-gray-100 border-t">
        <button
          type="submit"
          className="btn-indigo"
          disabled={processing}
        >
          {t(submitLabel)}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
