import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import LoadingButton from '@/Shared/LoadingButton';

const Create = () => {
  const { ownerTypes = [] } = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    name: '',
    phone: '',
    email: '',
    owner_type_id: '',
  });

  function submit(e) {
    e.preventDefault();
    post(route('owners.store'));
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('owners')} className="text-indigo-600">Owners</Link>
        <span className="font-medium text-indigo-600"> /</span> Create
      </h1>
      <div className="max-w-3xl bg-white rounded shadow">
        <form onSubmit={submit} className="p-8">
          <TextInput label="Name" name="name" value={data.name} errors={errors.name} onChange={e => setData('name', e.target.value)} />
          <SelectInput label="Owner Type" name="owner_type_id" value={data.owner_type_id} errors={errors.owner_type_id} onChange={e => setData('owner_type_id', e.target.value)}>
            <option value=""></option>
            {ownerTypes.map(ot => <option key={ot.id} value={ot.id}>{ot.name}</option>)}
          </SelectInput>
          <TextInput label="Phone" name="phone" value={data.phone} errors={errors.phone} onChange={e => setData('phone', e.target.value)} />
          <TextInput label="Email" name="email" type="email" value={data.email} errors={errors.email} onChange={e => setData('email', e.target.value)} />
          
          <div className="mt-4">
            <LoadingButton loading={processing} type="submit" className="btn-indigo">Create Owner</LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create Owner" children={page} />;

export default Create;
