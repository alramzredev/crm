import React, { useMemo } from 'react';
import Helmet from 'react-helmet';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import FileInput from '@/Shared/FileInput';
import TrashedMessage from '@/Shared/TrashedMessage';

const Edit = () => {
  const { user, roles = [], supervisors = [], projects = [], auth } = usePage().props;
  
  const userRoleId = user?.roles && user.roles.length > 0 ? user.roles[0].id : '';
  const userSupervisorIds = user?.supervisor ? user.supervisor.map(s => s.id) : [];
  const userProjectIds = user?.projects ? user.projects.map(p => p.id) : [];
  
  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  const { data, setData, errors, post, processing } = useForm({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    password: '',
    role: userRoleId,
    photo: '',
    supervisor_ids: userSupervisorIds,
    project_ids: userProjectIds,
    _method: 'PUT'
  });

  const selectedRole = useMemo(() => {
    return roles.find(r => r.id == data.role);
  }, [data.role, roles]);

  const isSalesEmployee = selectedRole?.name === 'sales_employee';
  const isSalesSupervisor = selectedRole?.name === 'sales_supervisor';
  const isProjectManager = selectedRole?.name === 'project_manager';

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

  function handleSubmit(e) {
    e.preventDefault();
    post(route('users.update', user.id));
  }

  function destroy() {
    if (confirm('Are you sure you want to delete this user?')) {
      router.delete(route('users.destroy', user.id));
    }
  }

  function restore() {
    if (confirm('Are you sure you want to restore this user?')) {
      router.put(route('users.restore', user.id));
    }
  }

  return (
    <div>
      <Helmet title={`${data.first_name} ${data.last_name}`} />
      <div className="flex justify-start max-w-lg mb-8">
        <h1 className="text-3xl font-bold">
          <Link
            href={route('users')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Users
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {data.first_name} {data.last_name}
        </h1>
        {user.photo && (
          <img className="block w-8 h-8 ml-4 rounded-full" src={user.photo} />
        )}
      </div>
      {user.deleted_at && can('users.restore') && (
        <TrashedMessage onRestore={restore}>
          This user has been deleted.
        </TrashedMessage>
      )}
      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="First Name"
              name="first_name"
              errors={errors.first_name}
              value={data.first_name}
              onChange={e => setData('first_name', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Last Name"
              name="last_name"
              errors={errors.last_name}
              value={data.last_name}
              onChange={e => setData('last_name', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Email"
              name="email"
              type="email"
              errors={errors.email}
              value={data.email}
              onChange={e => setData('email', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Phone"
              name="phone"
              type="text"
              errors={errors.phone}
              value={data.phone}
              onChange={e => setData('phone', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Password"
              name="password"
              type="password"
              errors={errors.password}
              value={data.password}
              onChange={e => setData('password', e.target.value)}
            />
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Role"
              name="role"
              errors={errors.role}
              value={data.role}
              onChange={e => setData('role', e.target.value)}
            >
              <option value="">Select a role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.label || r.name}</option>)}
            </SelectInput>
            <FileInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Photo"
              name="photo"
              accept="image/*"
              errors={errors.photo}
              value={data.photo}
              onChange={photo => setData('photo', photo)}
            />

            {/* Sales Employee: Assign Supervisors */}
            {isSalesEmployee && (
              <div className="w-full pb-8 pr-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Assign Supervisors
                </label>
                {errors.supervisor_ids && (
                  <div className="text-sm text-red-500 mb-3">{errors.supervisor_ids}</div>
                )}
                <div className="space-y-2 bg-gray-50 p-4 rounded border border-gray-200">
                  {supervisors.length === 0 ? (
                    <p className="text-sm text-gray-500">No supervisors available</p>
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
                  Assign Projects
                </label>
                {errors.project_ids && (
                  <div className="text-sm text-red-500 mb-3">{errors.project_ids}</div>
                )}
                <div className="space-y-2 bg-gray-50 p-4 rounded border border-gray-200 max-h-60 overflow-y-auto">
                  {projects.length === 0 ? (
                    <p className="text-sm text-gray-500">No projects available</p>
                  ) : (
                    projects.map(project => (
                      <label key={project.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.project_ids.includes(project.id)}
                          onChange={() => handleProjectChange(project.id)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {project.name} <span className="text-gray-400">({project.project_code})</span>
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Project Manager: Assign Projects */}
            {isProjectManager && (
              <div className="w-full pb-8 pr-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Assign Projects
                </label>
                {errors.project_ids && (
                  <div className="text-sm text-red-500 mb-3">{errors.project_ids}</div>
                )}
                <div className="space-y-2 bg-gray-50 p-4 rounded border border-gray-200 max-h-60 overflow-y-auto">
                  {projects.length === 0 ? (
                    <p className="text-sm text-gray-500">No projects available</p>
                  ) : (
                    projects.map(project => (
                      <label key={project.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.project_ids.includes(project.id)}
                          onChange={() => handleProjectChange(project.id)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {project.name} <span className="text-gray-400">({project.project_code})</span>
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
            {!user.deleted_at && can('users.delete') && (
              <DeleteButton onDelete={destroy}>Delete User</DeleteButton>
            )}
            {can('users.edit') && (
              <LoadingButton
                loading={processing}
                type="submit"
                className="ml-auto btn-indigo"
              >
                Update User
              </LoadingButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
