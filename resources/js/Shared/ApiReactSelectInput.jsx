import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';

export default function ApiReactSelectInput({
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
  fetchOnMount = false,
}) {
  const [options, setOptions] = useState(initialOptions);
  const [loading, setLoading] = useState(false);

  // Fetch options from API
  const fetchData = (q = '') => {
    if (!apiUrl || (q.length > 0 && q.length < minChars)) {
      setOptions(initialOptions);
      return;
    }
    setLoading(true);
    axios
      .get(apiUrl, { params: { [searchParam]: q } })
      .then(res => setOptions(res.data || []))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  };

  const debouncedFetch = useDebouncedCallback(fetchData, 300);

  // Initial load
  useEffect(() => {
    if (fetchOnMount && apiUrl) fetchData();
  }, [apiUrl]);

  // react-select expects value as the whole option object
  const selectedOption = options.find(o => String(o.value) === String(value)) || null;

  const handleInputChange = (inputValue) => {
    if (inputValue.length === 0 && !fetchOnMount) {
      setOptions(initialOptions);
    } else {
      debouncedFetch(inputValue);
    }
    return inputValue;
  };

  const handleChange = (option) => {
    onChange({ target: { name, value: option ? option.value : '' } });
  };

  const handleClear = () => {
    onChange({ target: { name, value: '' } });
    if (fetchOnMount) fetchData();
  };

  return (
    <div className={className}>
      {label && <label className="form-label" htmlFor={name}>{label}:</label>}
      <Select
        inputId={name}
        isClearable
        isDisabled={disabled}
        isLoading={loading}
        placeholder={placeholder}
        options={options}
        value={selectedOption}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onBlur={() => {}}
        classNamePrefix="react-select"
        noOptionsMessage={() => loading ? 'Loading...' : 'No results found'}
        styles={{
          // You can customize styles here if needed
        }}
      />
      {errors && <div className="form-error">{errors}</div>}
      <input type="hidden" name={name} value={value ?? ''} />
    </div>
  );
}
