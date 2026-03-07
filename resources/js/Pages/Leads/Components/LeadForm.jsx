import React from 'react';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';

const LeadForm = ({
  data,
  setData,
  errors,
  processing,
  onSubmit,
  submitLabel,
  projects = [],
  leadSources = [],
  leadStatuses = [],
}) => {
  const handleChange = (name, value) => setData(name, value);

  return (
    <form onSubmit={onSubmit}>
      {/* Identifiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b">
        <TextInput
          className="w-full"
          label="Title"
          name="title"
          errors={errors.title}
          value={data.title}
          onChange={e => handleChange('title', e.target.value)}
        />
        <TextInput
          className="w-full"
          label="National ID"
          name="national_id"
          errors={errors.national_id}
          value={data.national_id}
          onChange={e => handleChange('national_id', e.target.value)}
        />
        <SelectInput
          className="w-full"
          label="Project"
          name="project_id"
          errors={errors.project_id}
          value={data.project_id}
          onChange={e => handleChange('project_id', e.target.value)}
        >
          <option value=""></option>
          {projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </SelectInput>
        <SelectInput
          className="w-full"
          label="Lead Source"
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
          label="Status"
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
          label="First Name"
          name="first_name"
          errors={errors.first_name}
          value={data.first_name}
          onChange={e => handleChange('first_name', e.target.value)}
        />
        <TextInput
          className="w-full"
          label="Last Name"
          name="last_name"
          errors={errors.last_name}
          value={data.last_name}
          onChange={e => handleChange('last_name', e.target.value)}
        />
        <TextInput
          className="w-full"
          label="Email"
          name="email"
          type="email"
          errors={errors.email}
          value={data.email}
          onChange={e => handleChange('email', e.target.value)}
        />
        <TextInput
          className="w-full"
          label="Phone"
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
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
