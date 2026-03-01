import React from 'react';
import { useTranslation } from 'react-i18next';

export default function DeleteButton({ onClick, disabled = false, label }) {
  const { t } = useTranslation();
  const buttonLabel = label || t('delete');
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center rounded-lg border border-gray-200 bg-white hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 px-2 py-1 text-xs font-medium text-red-700 disabled:opacity-50 transition"
      aria-label={buttonLabel}
    >
      <svg className="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
      </svg>
      {buttonLabel}
    </button>
  );
}
