import React from 'react';
import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import axios from 'axios';

// get lang
const lang = localStorage.getItem('lang') || i18n.language;

// set initial direction
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

// set axios header
axios.defaults.headers.common['lang'] = lang;
  
// update on language change
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
   axios.defaults.headers.common['lang'] = lng;
   document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    return pages[`./Pages/${name}.jsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <I18nextProvider i18n={i18n}>
        <App {...props} />
      </I18nextProvider>
    );
  },
});