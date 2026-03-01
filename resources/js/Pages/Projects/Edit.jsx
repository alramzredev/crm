import React from 'react';
import Helmet from 'react-helmet';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import TrashedMessage from '@/Shared/TrashedMessage';
import ProjectForm from '@/Shared/Projects/ProjectForm';
import { useTranslation } from 'react-i18next';

const Edit = () => {
  const { project = {}, owners = [], cities = [], municipalities = [], neighborhoods = [], projectTypes = [], projectStatuses = [] } = usePage().props;
  const { data, setData, errors, put, processing } = useForm({
    project_code: project.project_code || '',
    name: project.name || '',
    reservation_period_days: project.reservation_period_days || '30',
    owner_id: project.owner?.id || '',
    city_id: project.city?.id || '',
    municipality_id: project.municipality?.id || '',
    neighborhood_id: project.neighborhood?.id || '',
    project_type_id: project.project_type?.id || '',
    status_id: project.status?.id || '',
    location: project.location || '',
    budget: project.budget || '',
    no_of_floors: project.no_of_floors || '',
    number_of_units: project.number_of_units || '',
    warranty: project.warranty ? '1' : '0',
    status_reason: project.status_reason || '',
    land_area: project.land_area || '',
    built_up_area: project.built_up_area || '',
    selling_space: project.selling_space || '',
    sellable_area_factor: project.sellable_area_factor || '',
    floor_area_ratio: project.floor_area_ratio || '',
  });
  const { t } = useTranslation();

  function handleSubmit(e) {
    e.preventDefault();
    put(route('projects.update', project.id));
  }

  function destroy() {
    if (confirm('Are you sure you want to delete this project?')) {
      router.delete(route('projects.destroy', project.id));
    }
  }

  function restore() {
    if (confirm('Are you sure you want to restore this project?')) {
      router.put(route('projects.restore', project.id));
    }
  }

  return (
    <div>
      <Helmet title={project.name || t('edit_project')} />
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('projects')} className="text-indigo-600 hover:text-indigo-700">
          {t('projects')}
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        <Link href={route('projects.show', project.id)} className="text-indigo-600 hover:text-indigo-700">
          {project.name || `${t('project')} #${project.id}`}
        </Link>
      </h1>
      {project.deleted_at && (
        <TrashedMessage onRestore={restore}>
          {t('project_deleted')}
        </TrashedMessage>
      )}
      <div className="max-w-4xl overflow-hidden bg-white rounded shadow">
        <ProjectForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel={t('update_project')}
          owners={owners}
          cities={cities}
          municipalities={municipalities}
          neighborhoods={neighborhoods}
          projectTypes={projectTypes}
          projectStatuses={projectStatuses}
        />
        <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
          {!project.deleted_at && (
            <DeleteButton onDelete={destroy}>
              {t('delete_project')}
            </DeleteButton>
          )}
        </div>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
