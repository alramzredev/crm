import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import ProjectForm from '@/Shared/Projects/ProjectForm';

const Create = () => {
  const { owners = [], cities = [], projectTypes = [], projectStatuses = [], municipalities = [], neighborhoods = [] } = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    project_code: '',
    name: '',
    reservation_period_days: '30',
    owner_id: '',
    city_id: '',
    municipality_id: '',
    neighborhood_id: '',
    project_type_id: '',
    status_id: '',
    location: '',
    budget: '',
    no_of_floors: '',
    number_of_units: '',
    warranty: '0',
    status_reason: '',
    land_area: '',
    built_up_area: '',
    selling_space: '',
    sellable_area_factor: '',
    floor_area_ratio: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('projects.store'));
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link
          href={route('projects')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Projects
        </Link>
        <span className="font-medium text-indigo-600"> /</span> Create
      </h1>
      <div className="max-w-4xl bg-white rounded shadow">
        <ProjectForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel="Create Project"
          owners={owners}
          cities={cities}
          municipalities={municipalities}
          neighborhoods={neighborhoods}
          projectTypes={projectTypes}
          projectStatuses={projectStatuses}
        />
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create Project" children={page} />;

export default Create;
