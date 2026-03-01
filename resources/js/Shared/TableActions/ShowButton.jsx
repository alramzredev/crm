import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ShowButton({ onClick, disabled = false, label }) {
  const { t } = useTranslation();
  const buttonLabel = label || t('view');
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 text-xs font-medium text-blue-700 disabled:opacity-50 transition"
      aria-label={buttonLabel}
    >
      <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 4.5c-7.5 0-9 7.5-9 7.5s1.5 7.5 9 7.5 9-7.5 9-7.5-1.5-7.5-9-7.5zm0 10a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
      </svg>
      {buttonLabel}
    </button>
  );
}
