import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  
];

export default function TranslationsTabs({ value = {}, onChange, errors = {}, fields }) {
  const { t } = useTranslation();
  const [activeLang, setActiveLang] = useState(LANGS[0].code);

  return (
    <div className="mb-6">
      <div className="flex border-b border-gray-200 mb-4">
        {LANGS.map(lang => (
          <button
            key={lang.code}
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 focus:outline-none transition ${
              activeLang === lang.code
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveLang(lang.code)}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <div>
        {fields.map(field => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t(field.label)} {LANGS.length > 1 && <span className="text-xs text-gray-400">({activeLang})</span>}
            </label>
            <input
              type="text"
              className={`form-input w-full ${errors?.[`${field.name}.${activeLang}`] ? 'border-red-500' : ''}`}
              value={value?.[activeLang]?.[field.name] ?? value?.[field.name]?.[activeLang] ?? ''}
              onChange={e => {
                const v = e.target.value;
                onChange({
                  ...value,
                  [field.name]: {
                    ...(value?.[field.name] || {}),
                    [activeLang]: v
                  }
                });
              }}
              name={`${field.name}.${activeLang}`}
            />
            {errors?.[`${field.name}.${activeLang}`] && (
              <div className="text-xs text-red-500 mt-1">{errors[`${field.name}.${activeLang}`]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
