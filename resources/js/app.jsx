import React from 'react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createInertiaApp, router } from '@inertiajs/react'  // 👈 import router
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/browser';
import '../css/app.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const lang = localStorage.getItem('lang');
if (lang && i18n.language !== lang) {
  i18n.changeLanguage(lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

// 👇 Add your global header here — runs before every Inertia request
router.on('before', (event) => {
  console.log('Setting X-App-Locale header to:', localStorage.getItem('lang') ?? 'en');
   event.detail.visit.headers['X-App-Locale'] = localStorage.getItem('lang') ?? 'en';
});

createInertiaApp({
  id: 'app',
  progress: {
    color: '#ED8936',
  },
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <I18nextProvider i18n={i18n}>
        <App {...props} />
      </I18nextProvider>
    );
  },
})

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_LARAVEL_DSN
});