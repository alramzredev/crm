import React, { useState, useEffect, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import { usePrevious } from 'react-use';
import SelectInput from '@/Shared/SelectInput';
import pickBy from 'lodash/pickBy';
import logo from '../../images/logo-white-2-1-1.svg';
import { useTranslation } from 'react-i18next';

export default () => {
  const { filters, availableRoles = [] } = usePage().props;
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation();

  const [values, setValues] = useState({
    role: filters.role || '', // role is used only on users page
    search: filters.search || '',
    trashed: filters.trashed || ''
  });

  const prevValues = usePrevious(values);

  function reset() {
    setValues({
      role: '',
      search: '',
      trashed: ''
    });
  }

  useEffect(() => {
    // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
    if (prevValues) {
      const query = Object.keys(pickBy(values)).length
        ? pickBy(values)
        : { remember: 'forget' };
      router.get(route(route().current()), query, {
        replace: true,
        preserveState: true
      });
    }
  }, [values]);

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;

    setValues(values => ({
      ...values,
      [key]: value
    }));

    if (opened) setOpened(false);
  }

  return (
    <div className="flex items-center w-full max-w-md mr-4">
      <div className="relative flex w-full bg-white rounded shadow">
        <div
          style={{ top: '100%' }}
          className={`absolute ${opened ? '' : 'hidden'}`}
        >
          <div
            onClick={() => setOpened(false)}
            className="fixed inset-0 z-20 bg-black opacity-25"
          ></div>
          <div className="relative z-30 w-64 px-4 py-6 mt-2 bg-white rounded shadow-lg">
            {filters.hasOwnProperty('role') && (
              <SelectInput
                className="mb-4"
                label={t('role')}
                name="role"
                value={values.role}
                onChange={handleChange}
              >
                <option value=""></option>
                {availableRoles.map(role => (
                  <option key={role.name} value={role.name}>
                    {role.label || role.name}
                  </option>
                ))}
              </SelectInput>
            )}
            <SelectInput
              label={t('trashed')}
              name="trashed"
              value={values.trashed}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="with">{t('with_trashed')}</option>
              <option value="only">{t('only_trashed')}</option>
            </SelectInput>
          </div>
        </div>
        <button
          onClick={() => setOpened(true)}
          className="px-4 border-r rounded-l md:px-6 hover:bg-gray-100 focus:outline-none focus:border-white focus:ring-2 focus:ring-indigo-400 focus:z-10"
        >
          <div className="flex items-baseline">
            <span className="hidden text-gray-700 md:inline">{t('filter')}</span>
            <svg
              className="w-2 h-2 text-gray-700 fill-current md:ml-2"
              xmlns={logo}
              viewBox="0 0 961.243 599.998"
            >
              <path d="M239.998 239.999L0 0h961.243L721.246 240c-131.999 132-240.28 240-240.624 239.999-.345-.001-108.625-108.001-240.624-240z" />
            </svg>
          </div>
        </button>
        <input
          className="relative w-full px-6 py-3 rounded-r focus:outline-none focus:ring-2 focus:ring-indigo-400"
          autoComplete="off"
          type="text"
          name="search"
          value={values.search}
          onChange={handleChange}
          placeholder={t('search_placeholder')}
        />
      </div>
      <button
        onClick={reset}
        className="m-3 text-sm text-gray-600 hover:text-gray-700 focus:text-indigo-700 focus:outline-none"
        type="button"
      >
        {t('reset')}
      </button>
    </div>
  );
};
