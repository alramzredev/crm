import React, { useMemo } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import UserForm from './Components/UserForm';

const Create = () => {
  const { roles = [], supervisors = [], projects = [] } = usePage().props;
  
  const { data, setData, errors, post, processing } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    photo: '',
    supervisor_ids: [],
    project_ids: [],
    lead_capacity: 0, // Add lead_capacity to form state
  });

  const selectedRole = useMemo(() => {
    return roles.find(r => r.id == data.role);
  }, [data.role, roles]);

  const isSalesEmployee = selectedRole?.name === 'sales_employee';
  const isSalesSupervisor = selectedRole?.name === 'sales_supervisor';
  const isProjectManager = selectedRole?.name === 'project_admin';

  function handleSubmit(e) {
    e.preventDefault();
    post(route('users.store'));
  }

  return (
    <div>
      <div>
        <h1 className="mb-8 text-3xl font-bold">
          <Link
            href={route('users')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Users
          </Link>
          <span className="font-medium text-indigo-600"> /</span> Create
        </h1>
      </div>
      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <UserForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel="Create User"
          roles={roles}
          supervisors={supervisors}
          projects={projects}
        />
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create User" children={page} />;

export default Create;
