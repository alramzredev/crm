import React from 'react';
import TextInput from '@/Shared/TextInput';
import LoadingButton from '@/Shared/LoadingButton';
import TranslationsTabs from '@/Shared/TranslationsTabs';
import { useTranslation } from 'react-i18next';

const CityForm = ({ data, setData, errors, processing, onSubmit, submitLabel }) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <div className="p-8">
        <TranslationsTabs
          value={{ name: data.name }}
          onChange={translations => setData('name', translations.name)}
          errors={errors}
          fields={[
            { name: 'name', label: t('name') }
          ]}
        />
      </div>
      <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
        <LoadingButton loading={processing} type="submit" className="btn-indigo">
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  );
};

export default CityForm;
