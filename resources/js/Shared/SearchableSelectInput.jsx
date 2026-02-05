import React, { useMemo, useState } from 'react';

export default function SearchableSelectInput({
  label,
  name,
  className,
  errors = [],
  options = [],
  placeholder = 'Search...',
  value,
  onChange,
  disabled = false,
  ...props
}) {
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(o => String(o.label).toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div className={className}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}:
        </label>
      )}
      <input
        type="text"
        className="form-input mb-2"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        disabled={disabled}
      />
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
        {filteredOptions.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {errors && <div className="form-error">{errors}</div>}
    </div>
  );
}
