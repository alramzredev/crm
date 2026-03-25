import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import CityForm from './Form';
import { useTranslation } from 'react-i18next';

const Edit = () => {
  const { city } = usePage().props;
  const { t } = useTranslation();

  const { data, setData, errors, put, processing } = useForm({
    name: city.name_translations || { en: '', ar: '' },
  });

  function handleSubmit(e) {
    e.preventDefault();
    put(route('countries.cities.update', [city.country.id, city.id]));
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('countries.show', city.country.id)} className="text-indigo-600 hover:text-indigo-700">{city.country.name}</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {t('edit')} {t('city')}
      </h1>
      <div className="max-w-2xl bg-white rounded shadow">
        <CityForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel={t('save')}
        />
      </div>
    </div>
  );
};

Edit.layout = page => <Layout title="Edit City" children={page} />;

export default Edit;
