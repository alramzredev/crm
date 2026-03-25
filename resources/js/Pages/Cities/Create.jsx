import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import CityForm from './Form';
import { useTranslation } from 'react-i18next';

const Create = () => {
  const { country } = usePage().props;
  const { t } = useTranslation();
  console.log(country);

  const { data, setData, errors, post, processing } = useForm({
    name: { en: '', ar: '' },
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('countries.cities.store', country.id));
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('countries.show', country.id)} className="text-indigo-600 hover:text-indigo-700">{country.name}</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {t('create_city')}
      </h1>
      <div className="max-w-2xl bg-white rounded shadow">
        <CityForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel={t('create')}
        />
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create City" children={page} />;

export default Create;
