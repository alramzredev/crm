import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';

export default function ApiSearchableSelectInput({
  label,
  name,
  className,
  errors = [],
  placeholder = 'Search...',
  value,
  onChange,
  disabled = false,
  apiUrl,
  searchParam = 'search',
  minChars = 0,
  initialOptions = [],
  fetchOnMount = true,
  ...props
}) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState(initialOptions);
  const [loading, setLoading] = useState(false);

  const fetchData = (searchQuery) => {
    if (!apiUrl) {
      setOptions(initialOptions);
      setLoading(false);
      return;
    }

    if (searchQuery.length > 0 && searchQuery.length < minChars) {
      setOptions(initialOptions);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(apiUrl, {
        params: { [searchParam]: searchQuery },
      })
      .then((response) => {
        setOptions(response.data || []);
      })
      .catch((error) => {
        console.error('Search error:', error);
        setOptions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const debouncedSearch = useDebouncedCallback(fetchData, 300);

  useEffect(() => {
    if (fetchOnMount && apiUrl) {
      fetchData('');
    }
  }, [apiUrl, fetchOnMount]);

  useEffect(() => {
    if (query.length === 0 && !fetchOnMount) {
      setOptions(initialOptions);
      return;
    }
    debouncedSearch(query);
  }, [query]);

  return (
    <div className={className}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}:
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          className="form-input mb-2"
          placeholder={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={disabled}
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
        className={`form-select ${errors.length ? 'error' : ''}`}
      >
        <option value="">Select an option</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {errors && <div className="form-error">{errors}</div>}
    </div>
  );
}
