import React, { useState } from 'react';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';

const Show = () => {
  const { employee, availableProjects } = usePage().props;
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const { data, setData, post, delete: destroy, processing } = useForm({
    project_ids: [],
  });

  const assignedProjectIds = employee.projects?.map(p => p.id) || [];
  const unassignedProjects = availableProjects.filter(p => !assignedProjectIds.includes(p.id));

  function handleProjectToggle(projectId) {
    const newProjectIds = data.project_ids.includes(projectId)
      ? data.project_ids.filter(id => id !== projectId)
      : [...data.project_ids, projectId];

    setData('project_ids', newProjectIds);
  }

  function handleAssignProjects() {
    if (data.project_ids.length === 0) return;

    post(route('employees.assign-project', employee.id), {
      onSuccess: () => {
        setData('project_ids', []);
      },
    });
  }

  function handleRemoveProject(projectId) {
    if (confirm('Remove this employee from the project?')) {
      router.delete(route('employees.remove-project', employee.id), {
        data: { project_id: projectId },
        preserveScroll: true,
      });
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('employees')} className="text-indigo-600 hover:text-indigo-700">
          My Sales Team
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {employee.first_name} {employee.last_name}
      </h1>

      {/* Employee Info */}
      <div className="max-w-2xl bg-white rounded shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Employee Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{employee.first_name} {employee.last_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{employee.email}</p>
          </div>
        </div>
      </div>

      {/* Assigned Projects */}
      <div className="max-w-2xl bg-white rounded shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Assigned Projects ({employee.projects?.length || 0})</h2>
        
        {employee.projects && employee.projects.length > 0 ? (
          <div className="space-y-2">
            {employee.projects.map(project => (
              <div key={project.id} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-gray-600">{project.project_code}</p>
                </div>
                <button
                  onClick={() => handleRemoveProject(project.id)}
                  disabled={processing}
                  className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No projects assigned yet.</p>
        )}
      </div>

      {/* Assign Projects */}
      {unassignedProjects.length > 0 && (
        <div className="max-w-2xl bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Assign to Projects</h2>
          
          <div className="space-y-3 mb-6">
            {unassignedProjects.map(project => (
              <label key={project.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.project_ids.includes(project.id)}
                  onChange={() => handleProjectToggle(project.id)}
                  disabled={processing}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
                <span className="ml-3 text-gray-900">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-gray-600">{project.project_code}</p>
                </span>
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <LoadingButton
              loading={processing}
              onClick={handleAssignProjects}
              disabled={data.project_ids.length === 0}
              className="btn-indigo"
            >
              Assign Selected ({data.project_ids.length})
            </LoadingButton>
          </div>
        </div>
      )}
    </div>
  );
};

Show.layout = page => <Layout title="Employee Details" children={page} />;

export default Show;
