import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import TranslationsTabs from '@/Shared/TranslationsTabs';
import TrashedMessage from '@/Shared/TrashedMessage';
import { useTranslation } from 'react-i18next';

const Edit = () => {
  const { municipality, city, country } = usePage().props;
  const { t } = useTranslation();

  const { data, setData, errors, put, processing } = useForm({
    name: municipality.name_translations || { en: '', ar: '' },
  });

  function handleSubmit(e) {
    e.preventDefault();
    put(route('countries.cities.municipalities.update', [country.id, city.id, municipality.id]));
  }

  function restore() {
    if (confirm(t('restore_municipality') || 'Restore municipality?')) {
      router.put(route('countries.cities.municipalities.restore', [country.id, city.id, municipality.id]));
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('countries.show', country.id)} className="text-indigo-600 hover:text-indigo-700">{country.name}</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        <Link href={route('countries.cities.show', [country.id, city.id])} className="text-indigo-600 hover:text-indigo-700">{city.name}</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {t('edit')} {t('municipality')}
      </h1>
      {municipality.deleted_at && (
        <TrashedMessage onRestore={restore}>
          {t('municipality_deleted')}
        </TrashedMessage>
      )}
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

Edit.layout = page => <Layout title="Edit Municipality" children={page} />;

export default Edit;
