import React from 'react';
import Helmet from 'react-helmet';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import TrashedMessage from '@/Shared/TrashedMessage';
import DeleteButton from '@/Shared/TableActions/DeleteButton';
import { useTranslation } from 'react-i18next';

const Edit = () => {
  const { owner = {}, ownerTypes = [] } = usePage().props;
  const { t } = useTranslation();
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
    if (confirm(t('delete_owner') || 'Delete owner?')) {
      router.delete(route('owners.destroy', owner.id));
    }
  }

  function restore() {
    if (confirm(t('restore_owner') || 'Restore owner?')) {
      router.put(route('owners.restore', owner.id));
    }
  }

  return (
    <div>
      <Helmet title={data.name} />
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('owners')} className="text-indigo-600">{t('owners')}</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {data.name}
      </h1>

      {owner.deleted_at && <TrashedMessage onRestore={restore}>{t('owner_deleted')}</TrashedMessage>}

      <div className="max-w-3xl bg-white rounded shadow">
        <form onSubmit={submit} className="p-8">
          <TextInput
            label={t('name')}
            name="name"
            value={data.name}
            errors={errors.name}
            onChange={e => setData('name', e.target.value)}
          />
          <SelectInput
            label={t('owner_type')}
            name="owner_type_id"
            errors={errors.owner_type_id}
            value={data.owner_type_id}
            onChange={e => setData('owner_type_id', e.target.value)}
          >
            <option value=""></option>
            {ownerTypes.map(ot => <option key={ot.id} value={ot.id}>{ot.name}</option>)}
          </SelectInput>

          <TextInput
            label={t('phone')}
            name="phone"
            value={data.phone}
            errors={errors.phone}
            onChange={e => setData('phone', e.target.value)}
          />
          <TextInput
            label={t('email')}
            name="email"
            type="email"
            value={data.email}
            errors={errors.email}
            onChange={e => setData('email', e.target.value)}
          />

      <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
            
            <LoadingButton loading={processing} type="submit" className="btn-indigo">
              {t('update_owner')}
            </LoadingButton>
          </div>


        <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
            {!owner.deleted_at && (
              <DeleteButton onDelete={destroy} className="mr-4">
                {t('delete_owner')}
              </DeleteButton>
            )} 
          </div>

        </form>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
