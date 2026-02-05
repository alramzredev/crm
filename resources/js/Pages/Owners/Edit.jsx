import React from 'react';
import Helmet from 'react-helmet';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import TrashedMessage from '@/Shared/TrashedMessage';

const Edit = () => {
  const { owner = {}, ownerTypes = [] } = usePage().props;
  const { data, setData, errors, put, processing } = useForm({
    name: owner.name || '',
    phone: owner.phone || '',
    email: owner.email || '',
    owner_type_id: owner.owner_type?.id || owner.owner_type_id || '',
  });

  function submit(e) {
    e.preventDefault();
    put(route('owners.update', owner.id));
  }

  function destroy() {
    if (confirm('Delete owner?')) {
      router.delete(route('owners.destroy', owner.id));
    }
  }

  function restore() {
    if (confirm('Restore owner?')) {
      router.put(route('owners.restore', owner.id));
    }
  }

  return (
    <div>
      <Helmet title={data.name} />
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('owners')} className="text-indigo-600">Owners</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {data.name}
      </h1>

      {owner.deleted_at && <TrashedMessage onRestore={restore}>This owner has been deleted.</TrashedMessage>}

      <div className="max-w-3xl bg-white rounded shadow">
        <form onSubmit={submit} className="p-8">
          <TextInput
            label="Name"
            name="name"
            value={data.name}
            errors={errors.name}
            onChange={e => setData('name', e.target.value)}
          />
          <SelectInput
            label="Owner Type"
            name="owner_type_id"
            errors={errors.owner_type_id}
            value={data.owner_type_id}
            onChange={e => setData('owner_type_id', e.target.value)}
          >
            <option value=""></option>
            {ownerTypes.map(ot => <option key={ot.id} value={ot.id}>{ot.name}</option>)}
          </SelectInput>

          <TextInput
            label="Phone"
            name="phone"
            value={data.phone}
            errors={errors.phone}
            onChange={e => setData('phone', e.target.value)}
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={data.email}
            errors={errors.email}
            onChange={e => setData('email', e.target.value)}
          />

          <div className="flex items-center mt-4">
            {!owner.deleted_at && <button type="button" onClick={destroy} className="text-red-600 mr-4">Delete</button>}
            <LoadingButton loading={processing} type="submit" className="btn-indigo ml-auto">Update Owner</LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
