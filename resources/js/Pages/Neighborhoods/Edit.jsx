import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import TranslationsTabs from '@/Shared/TranslationsTabs';
import TrashedMessage from '@/Shared/TrashedMessage';
import { useTranslation } from 'react-i18next';

const Edit = () => {
  const { neighborhood } = usePage().props;
  const { t } = useTranslation();

  // Get municipality, city, country from neighborhood resource
  const municipality = neighborhood.municipality;
  const city = municipality?.city;
  const country = city?.country;

  const { data, setData, errors, put, processing } = useForm({
    name: neighborhood.name_translations || { en: '', ar: '' },
  });

  function handleSubmit(e) {
    e.preventDefault();
    put(
      route('countries.cities.municipalities.neighborhoods.update', [
        country.id,
        city.id,
        municipality.id,
        neighborhood.id,
      ])
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('countries.show', country.id)} className="text-indigo-600 hover:text-indigo-700">{country.name}</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        <Link href={route('countries.cities.show', [country.id, city.id])} className="text-indigo-600 hover:text-indigo-700">{city.name}</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        <Link href={route('countries.cities.municipalities.show', [country.id, city.id, municipality.id])} className="text-indigo-600 hover:text-indigo-700">{municipality.name}</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {t('edit')} {t('neighborhood')}
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
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout title="Edit Neighborhood" children={page} />;

export default Edit;
