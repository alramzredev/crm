import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import TrashedMessage from '@/Shared/TrashedMessage';
import ProjectTabs from '@/Shared/ProjectTabs';

const Show = () => {
  const { project } = usePage().props;
  const [activeTab, setActiveTab] = useState('overview');

  const ownerLabel = project.owner?.name || project.owner || '';
  const statusLabel = project.status?.name || project.status || '';
  const typeLabel = project.project_type?.name || project.project_type || '';
  const ownershipLabel = project.project_ownership?.name || project.project_ownership || '';
  const cityLabel = project.city?.name || project.city || '';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          <Link
            href={route('projects')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Projects
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {project.name}
        </h1>
        <Link className="btn-indigo" href={route('projects.edit', project.id)}>
          Edit
        </Link>
      </div>

      {project.deleted_at && (
        <TrashedMessage>This project has been deleted.</TrashedMessage>
      )}

      <ProjectTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <>
          <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
            <div className="p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-semibold text-gray-600">Project Code</div>
                  <div className="mt-1">{project.project_code || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Owner</div>
                  <div className="mt-1">{ownerLabel || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Type</div>
                  <div className="mt-1">{typeLabel || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Ownership</div>
                  <div className="mt-1">{ownershipLabel || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Status</div>
                  <div className="mt-1">{statusLabel || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Budget</div>
                  <div className="mt-1">{project.budget ? `$${project.budget}` : '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">City</div>
                  <div className="mt-1">{cityLabel || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Neighborhood</div>
                  <div className="mt-1">{project.neighborhood || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Location</div>
                  <div className="mt-1">{project.location || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Floors</div>
                  <div className="mt-1">{project.no_of_floors || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Units</div>
                  <div className="mt-1">{project.number_of_units || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Warranty</div>
                  <div className="mt-1">{project.warranty ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'properties' && (
        <div className="max-w-3xl p-8 bg-white rounded shadow">
          <div className="text-sm text-gray-600">No properties to display.</div>
        </div>
      )}
    </div>
  );
};

Show.layout = page => <Layout title="Project" children={page} />;

export default Show;
