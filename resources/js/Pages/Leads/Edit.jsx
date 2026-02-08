import React from 'react';
import Helmet from 'react-helmet';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import TrashedMessage from '@/Shared/TrashedMessage';
import FileInput from '@/Shared/FileInput';

const Edit = () => {
  const { lead, leadSources = [], leadStatuses = [], brokers = [], projects = [], auth } = usePage().props;
  const { data, setData, errors, put, processing } = useForm({
    title: lead.title || '',
    first_name: lead.first_name || '',
    last_name: lead.last_name || '',
    national_id: lead.national_id || '',
    project_id: lead.project_id || '',
    lead_source_id: lead.lead_source_id || '',
    status_id: lead.status_id || '',
    employee_id: lead.active_assignment?.employee_id || '',
    email: lead.email || '',
    phone: lead.phone || '',
    national_address_file: '',
    national_id_file: '',
    address: lead.address || '',
    city: lead.city || '',
    region: lead.region || '',
    country: lead.country || '',
    postal_code: lead.postal_code || ''
  });

  const employeeLabel = b => b.name || [b.first_name, b.last_name].filter(Boolean).join(' ') || '—';

  function handleSubmit(e) {
    e.preventDefault();
    put(route('leads.update', lead.id));
  }

  function destroy() {
    if (confirm('Are you sure you want to delete this lead?')) {
      router.delete(route('leads.destroy', lead.id));
    }
  }

  function restore() {
    if (confirm('Are you sure you want to restore this lead?')) {
      router.put(route('leads.restore', lead.id));
    }
  }

  return (
    <div>
      <Helmet title={`${data.first_name} ${data.last_name}`} />
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('leads')} className="text-indigo-600 hover:text-indigo-700">Leads</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {data.first_name} {data.last_name}
      </h1>

      {lead.deleted_at && (
        <TrashedMessage onRestore={restore}>
          This lead has been deleted.
        </TrashedMessage>
      )}

      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <form onSubmit={handleSubmit}>
          {/* Identifiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b">
            <TextInput className="w-full" label="Title" name="title" errors={errors.title} value={data.title} onChange={e => setData('title', e.target.value)} />
            <TextInput className="w-full" label="National ID" name="national_id" errors={errors.national_id} value={data.national_id} onChange={e => setData('national_id', e.target.value)} />
            <SelectInput className="w-full" label="Project" name="project_id" errors={errors.project_id} value={data.project_id} onChange={e => setData('project_id', e.target.value)}>
              <option value=""></option>
              {projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </SelectInput>
            <SelectInput className="w-full" label="Lead Source" name="lead_source_id" errors={errors.lead_source_id} value={data.lead_source_id} onChange={e => setData('lead_source_id', e.target.value)}>
              <option value=""></option>
              {leadSources.map(ls => <option key={ls.id} value={ls.id}>{ls.name}</option>)}
            </SelectInput>
            <SelectInput className="w-full" label="Status" name="status_id" errors={errors.status_id} value={data.status_id} onChange={e => setData('status_id', e.target.value)}>
              <option value=""></option>
              {leadStatuses.map(ls => <option key={ls.id} value={ls.id}>{ls.name}</option>)}
            </SelectInput>
            {!auth.user.roles?.includes('sales_employee') && (
              <SelectInput className="w-full" label="Sales Employee" name="employee_id" errors={errors.employee_id} value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}>
                <option value=""></option>
                {brokers.map(b => <option key={b.id} value={b.id}>{employeeLabel(b)}</option>)}
              </SelectInput>
            )}
          </div>

          {/* Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b">
            <TextInput className="w-full" label="First Name" name="first_name" errors={errors.first_name} value={data.first_name} onChange={e => setData('first_name', e.target.value)} />
            <TextInput className="w-full" label="Last Name" name="last_name" errors={errors.last_name} value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
            <TextInput className="w-full" label="Email" name="email" type="email" errors={errors.email} value={data.email} onChange={e => setData('email', e.target.value)} />
            <TextInput className="w-full" label="Phone" name="phone" type="text" errors={errors.phone} value={data.phone} onChange={e => setData('phone', e.target.value)} />
          </div>

          {/* Files */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileInput className="w-full" label="National Address File" name="national_address_file" accept="image/*,application/pdf" errors={errors.national_address_file} value={data.national_address_file} onChange={file => setData('national_address_file', file)} />
              <FileInput className="w-full" label="National ID File" name="national_id_file" accept="image/*,application/pdf" errors={errors.national_id_file} value={data.national_id_file} onChange={file => setData('national_id_file', file)} />
            </div>
          </div>

          <div className="flex items-center px-6 py-4 bg-gray-100 border-t">
            {!lead.deleted_at && <DeleteButton onDelete={destroy}>Delete Lead</DeleteButton>}
            <LoadingButton loading={processing} type="submit" className="ml-auto btn-indigo">Update Lead</LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
