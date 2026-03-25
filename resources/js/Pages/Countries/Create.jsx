import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import CountryForm from './Components/CountryForm';
import { useTranslation } from 'react-i18next';

const Create = () => {
  const { t } = useTranslation();
  const { data, setData, errors, post, processing } = useForm({
    name: { en: '', ar: '' },
    code: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('countries.store'));
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('countries')} className="text-indigo-600 hover:text-indigo-700">
          {t('countries')}
        </Link>
        <span className="font-medium text-indigo-600"> /</span> {t('create_country')}
      </h1>
      <CountryForm
        data={data}
        setData={setData}
        errors={errors}
        processing={processing}
        onSubmit={handleSubmit}
        submitLabel="create_country"
      />
    </div>
  );
};

Create.layout = page => <Layout title="Create Country" children={page} />;

export default Create;
