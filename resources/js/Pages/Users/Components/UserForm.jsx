import React, { useMemo } from 'react';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
// import FileInput from '@/Shared/FileInput';
import { useTranslation } from 'react-i18next';

const UserForm = ({
  data,
  setData,
  errors,
  processing,
  onSubmit,
  submitLabel,
  roles = [],
  supervisors = [],
  projects = [],
}) => {
  const { t } = useTranslation();

  const selectedRole = useMemo(() => {
    return roles.find(r => r.id == data.role);
  }, [data.role, roles]);

  const isSalesEmployee = selectedRole?.name === 'sales_employee';
  const isSalesSupervisor = selectedRole?.name === 'sales_supervisor';
  const isProjectManager = selectedRole?.name === 'project_admin';

  function handleSupervisorChange(supervisorId) {
    setData('supervisor_ids', 
      data.supervisor_ids.includes(supervisorId)
        ? data.supervisor_ids.filter(id => id !== supervisorId)
        : [...data.supervisor_ids, supervisorId]
    );
  }

  function handleProjectChange(projectId) {
    setData('project_ids', 
      data.project_ids.includes(projectId)
        ? data.project_ids.filter(id => id !== projectId)
        : [...data.project_ids, projectId]
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-wrap p-8 -mb-8 -mr-6">
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label={t('first_name')}
          name="first_name"
          errors={errors.first_name}
          value={data.first_name}
          onChange={e => setData('first_name', e.target.value)}
        />
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label={t('last_name')}
          name="last_name"
          errors={errors.last_name}
          value={data.last_name}
          onChange={e => setData('last_name', e.target.value)}
        />
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label={t('email')}
          name="email"
          type="email"
          errors={errors.email}
          value={data.email}
          onChange={e => setData('email', e.target.value)}
        />
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label={t('phone')}
          name="phone"
          type="text"
          errors={errors.phone}
          value={data.phone}
          onChange={e => setData('phone', e.target.value)}
        />
        <TextInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label={t('password')}
          name="password"
          type="password"
          errors={errors.password}
          value={data.password}
          onChange={e => setData('password', e.target.value)}
        />
        <SelectInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label={t('role')}
          name="role"
          errors={errors.role}
          value={data.role}
          onChange={e => setData('role', e.target.value)}
        >
          <option value="">{t('select_role')}</option>
          {roles.map(r => <option key={r.id} value={r.id}>{r.label || r.name}</option>)}
        </SelectInput>

        {/* <FileInput
          className="w-full pb-8 pr-6 lg:w-1/2"
          label={t('photo')}
          name="photo"
          accept="image/*"
          errors={errors.photo}
          value={data.photo}
          onChange={photo => setData('photo', photo)}
        /> */}

        {/* Sales Employee: Lead Capacity */}
        {isSalesEmployee && (
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label={t('lead_capacity')}
            name="lead_capacity"
            type="number"
            min="0"
            errors={errors.lead_capacity}
            value={data.lead_capacity}
            onChange={e => setData('lead_capacity', e.target.value)}
          />
        )}

        {/* Sales Employee: Assign Supervisors */}
        {isSalesEmployee && (
          <div className="w-full pb-8 pr-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('assign_supervisors')}
            </label>
            {errors.supervisor_ids && (
              <div className="text-sm text-red-500 mb-3">{errors.supervisor_ids}</div>
            )}
            <div className="space-y-2 bg-gray-50 p-4 rounded border border-gray-200">
              {supervisors.length === 0 ? (
                <p className="text-sm text-gray-500">{t('no_supervisors_available')}</p>
              ) : (
                supervisors.map(supervisor => (
                  <label key={supervisor.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.supervisor_ids.includes(supervisor.id)}
                      onChange={() => handleSupervisorChange(supervisor.id)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {supervisor.first_name} {supervisor.last_name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* Sales Supervisor: Assign Projects */}
        {isSalesSupervisor && (
          <div className="w-full pb-8 pr-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('assign_projects')}
            </label>
            {errors.project_ids && (
              <div className="text-sm text-red-500 mb-3">{errors.project_ids}</div>
            )}
            <div className="space-y-2 bg-gray-50 p-4 rounded border border-gray-200 max-h-60 overflow-y-auto">
              {projects.length === 0 ? (
                <p className="text-sm text-gray-500">{t('no_projects_available')}</p>
              ) : (
                projects.map(project => (
                  <label key={project.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.project_ids.includes(project.id)}
                      onChange={() => handleProjectChange(project.id)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 mr-2 text-sm text-gray-700">
                      {project.name} <span className="text-gray-400">({project.project_code})</span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* Project Admin: Assign Projects */}
        {isProjectManager && (
          <div className="w-full pb-8 pr-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('assign_projects')}
            </label>
            {errors.project_ids && (
              <div className="text-sm text-red-500 mb-3">{errors.project_ids}</div>
            )}
            <div className="space-y-2 bg-gray-50 p-4 rounded border border-gray-200 max-h-60 overflow-y-auto">
              {projects.length === 0 ? (
                <p className="text-sm text-gray-500">{t('no_projects_available')}</p>
              ) : (
                projects.map(project => (
                  <label key={project.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.project_ids.includes(project.id)}
                      onChange={() => handleProjectChange(project.id)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 mr-2 text-sm text-gray-700">
                      {project.name} <span className="text-gray-400">({project.project_code})</span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
        <LoadingButton
          loading={processing}
          type="submit"
          className="btn-indigo"
        >
          {t(submitLabel)}
        </LoadingButton>
      </div>
    </form>
  );
};

export default UserForm;
