import React from 'react';
import TranslationsTabs from '@/Shared/TranslationsTabs';
import { useTranslation } from 'react-i18next';

const CountryForm = ({
  data,
  setData,
  errors,
  processing,
  onSubmit,
  submitLabel,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="bg-white rounded shadow p-8 max-w-xl">
      <TranslationsTabs
        value={{ name: data.name }}
        onChange={translations => setData('name', translations.name)}
        errors={errors}
        fields={[{ name: 'name', label: t('name') }]}
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('code')}</label>
        <input
          type="text"
          className="form-input w-full"
          value={data.iso_code}
          onChange={e => setData('iso_code', e.target.value)}
          name="iso_code"
        />
        {errors.iso_code && <div className="text-xs text-red-500 mt-1">{errors.iso_code}</div>}
      </div>
      <div className="flex items-center justify-end">
        <button type="submit" className="btn-indigo" disabled={processing}>
          {t(submitLabel)}
        </button>
      </div>
    </form>
  );
};

export default CountryForm;
