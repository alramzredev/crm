import React from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import CountryForm from './Components/CountryForm';
import { useTranslation } from 'react-i18next';


const Edit = () => {
    
  const { country } = usePage().props;
  const { t } = useTranslation();
  const { data, setData, errors, put, processing } = useForm({
    name: country.name_translations || { en: '', ar: '' },
    iso_code: country.iso_code || '',
  });
  

  function handleSubmit(e) {
    e.preventDefault();
    put(route('countries.update', country.id));
  } 

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{t('edit_country')}</h1>
      <CountryForm
        data={data}
        setData={setData}
        errors={errors}
        processing={processing}
        onSubmit={handleSubmit}
        submitLabel={t('save')}
      />
    </div>
  );
};

Edit.layout = page => {
  const { t } = useTranslation();
  return <Layout title={t('edit_country')} children={page} />;
};
export default Edit;
