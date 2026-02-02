import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';

const Create = () => {
  const { owners = [], cities = [], projectTypes = [], projectOwnerships = [], projectStatuses = [] } = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    project_code: '',
    name: '',
    owner_id: '',
    city_id: '',
    project_type_id: '',
    project_ownership_id: '',
    status_id: '',
    neighborhood: '',
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
      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <TextInput
              className="w-full pb-8 pr-6"
              label="Project Code"
              name="project_code"
              errors={errors.project_code}
              value={data.project_code}
              onChange={e => setData('project_code', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6"
              label="Name"
              name="name"
              errors={errors.name}
              value={data.name}
              onChange={e => setData('name', e.target.value)}
            />
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Owner"
              name="owner_id"
              errors={errors.owner_id}
              value={data.owner_id}
              onChange={e => setData('owner_id', e.target.value)}
            >
              <option value=""></option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </SelectInput>
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="City"
              name="city_id"
              errors={errors.city_id}
              value={data.city_id}
              onChange={e => setData('city_id', e.target.value)}
            >
              <option value=""></option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </SelectInput>
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Type"
              name="project_type_id"
              errors={errors.project_type_id}
              value={data.project_type_id}
              onChange={e => setData('project_type_id', e.target.value)}
            >
              <option value=""></option>
              {projectTypes.map(pt => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
            </SelectInput>
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Ownership"
              name="project_ownership_id"
              errors={errors.project_ownership_id}
              value={data.project_ownership_id}
              onChange={e => setData('project_ownership_id', e.target.value)}
            >
              <option value=""></option>
              {projectOwnerships.map(po => <option key={po.id} value={po.id}>{po.name}</option>)}
            </SelectInput>
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Status"
              name="status_id"
              errors={errors.status_id}
              value={data.status_id}
              onChange={e => setData('status_id', e.target.value)}
            >
              <option value=""></option>
              {projectStatuses.map(ps => <option key={ps.id} value={ps.id}>{ps.name}</option>)}
            </SelectInput>

            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Budget"
              name="budget"
              errors={errors.budget}
              value={data.budget}
              onChange={e => setData('budget', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Floors"
              name="no_of_floors"
              errors={errors.no_of_floors}
              value={data.no_of_floors}
              onChange={e => setData('no_of_floors', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Units"
              name="number_of_units"
              errors={errors.number_of_units}
              value={data.number_of_units}
              onChange={e => setData('number_of_units', e.target.value)}
            />

            <TextInput
              className="w-full pb-8 pr-6"
              label="Neighborhood"
              name="neighborhood"
              errors={errors.neighborhood}
              value={data.neighborhood}
              onChange={e => setData('neighborhood', e.target.value)}
            />

            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Warranty"
              name="warranty"
              errors={errors.warranty}
              value={data.warranty}
              onChange={e => setData('warranty', e.target.value)}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </SelectInput>

            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Status Reason"
              name="status_reason"
              errors={errors.status_reason}
              value={data.status_reason}
              onChange={e => setData('status_reason', e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
            <LoadingButton
              loading={processing}
              type="submit"
              className="btn-indigo"
            >
              Create Project
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create Project" children={page} />;

export default Create;
