import React from 'react';
import Helmet from 'react-helmet';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import TrashedMessage from '@/Shared/TrashedMessage';
import Icon from '@/Shared/Icon';

const Edit = () => {
  const { project, owners = [], cities = [], projectTypes = [], projectOwnerships = [], projectStatuses = [], countries = [] } = usePage().props;
  const { data, setData, errors, put, processing } = useForm({
    project_code: project.project_code || '',
    name: project.name || '',
    owner_id: project.owner?.id || project.owner_id || '',
    city_id: project.city?.id || project.city_id || '',
    project_type_id: project.project_type?.id || project.project_type_id || '',
    project_ownership_id: project.project_ownership?.id || project.project_ownership_id || '',
    status_id: project.status?.id || project.status_id || '',
    neighborhood: project.neighborhood || '',
    location: project.location || '',
    budget: project.budget || '',
    no_of_floors: project.no_of_floors || '',
    number_of_units: project.number_of_units || '',
    warranty: project.warranty || false,
    email: project.email || '',
    phone: project.phone || '',
    address: project.address || '',
    region: project.region || '',
    country: project.country || '',
    postal_code: project.postal_code || ''
  });

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
      <Helmet title={data.name} />
      <h1 className="mb-8 text-3xl font-bold">
        <Link
          href={route('projects')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Projects
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        <Link
          href={route('projects.show', project.id)}
          className="text-indigo-600 hover:text-indigo-700"
        >
          {data.name}
        </Link>
      </h1>
      {project.deleted_at && (
        <TrashedMessage onRestore={restore}>
          This project has been deleted.
        </TrashedMessage>
      )}
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
              label="Address"
              name="address"
              errors={errors.address}
              value={data.address}
              onChange={e => setData('address', e.target.value)}
            />
          </div>
          <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
            {!project.deleted_at && (
              <DeleteButton onDelete={destroy}>
                Delete Project
              </DeleteButton>
            )}
            <LoadingButton
              loading={processing}
              type="submit"
              className="ml-auto btn-indigo"
            >
              Update Project
            </LoadingButton>
          </div>
        </form>
      </div>
      <h2 className="mt-12 text-2xl font-bold">Contacts</h2>
      <div className="mt-6 overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Name</th>
              <th className="px-6 pt-5 pb-4">City</th>
              <th className="px-6 pt-5 pb-4" colSpan="2">
                Phone
              </th>
            </tr>
          </thead>
          <tbody>
            {project.contacts.map(
              ({ id, name, phone, city, deleted_at }) => {
                return (
                  <tr
                    key={id}
                    className="hover:bg-gray-100 focus-within:bg-gray-100"
                  >
                    <td className="bordeßr-t">
                      <Link
                        href={route('contacts.edit', id)}
                        className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                      >
                        {name}
                        {deleted_at && (
                          <Icon
                            name="trash"
                            className="flex-shrink-0 w-3 h-3 ml-2 text-gray-400 fill-current"
                          />
                        )}
                      </Link>
                    </td>
                    <td className="border-t">
                      <Link
                        tabIndex="-1"
                        href={route('contacts.edit', id)}
                        className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                      >
                        {city}
                      </Link>
                    </td>
                    <td className="border-t">
                      <Link
                        tabIndex="-1"
                        href={route('contacts.edit', id)}
                        className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                      >
                        {phone}
                      </Link>
                    </td>
                    <td className="w-px border-t">
                      <Link
                        tabIndex="-1"
                        href={route('contacts.edit', id)}
                        className="flex items-center px-4"
                      >
                        <Icon
                          name="cheveron-right"
                          className="block w-6 h-6 text-gray-400 fill-current"
                        />
                      </Link>
                    </td>
                  </tr>
                );
              }
            )}
            {project.contacts.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="4">
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
