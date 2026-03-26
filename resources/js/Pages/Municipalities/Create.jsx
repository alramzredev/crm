import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import TranslationsTabs from '@/Shared/TranslationsTabs';
import { useTranslation } from 'react-i18next';

const Create = () => {
  const { city } = usePage().props;
  const { t } = useTranslation();

  // Get country from city resource
  const country = city.country;

  const { data, setData, errors, post, processing } = useForm({
    name: { en: '', ar: '' },
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('countries.cities.municipalities.store', [country.id, city.id]));
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('countries.show', country.id)} className="text-indigo-600 hover:text-indigo-700">{country.name}</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        <Link href={route('countries.cities.show', [country.id, city.id])} className="text-indigo-600 hover:text-indigo-700">{city.name}</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {t('create')} {t('municipality')}
      </h1>
      <div className="max-w-2xl bg-white rounded shadow p-8">
        <form onSubmit={handleSubmit}>
          <TranslationsTabs
            value={{ name: data.name }}
            onChange={translations => setData('name', translations.name)}
            errors={errors}
            fields={[
              { name: 'name', label: t('name') }
            ]}
          />
          <div className="flex items-center justify-end mt-6">
            <button
              type="submit"
              className="btn-indigo"
              disabled={processing}
            >
              {t('create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create Municipality" children={page} />;


export default Create;
