import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  fetchOnMount = false,
}) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState(initialOptions);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState({});

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // ─── Selected label ─────────────────────────────
  const selected = [...options, ...initialOptions].find(
    o => String(o.value) === String(value)
  );

  // ─── Fetch ─────────────────────────────────────
  const fetchData = async (q = '') => {
    if (!apiUrl || (q && q.length < minChars)) {
      setOptions(initialOptions);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(apiUrl, { params: { [searchParam]: q } });
      setOptions(res.data || []);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useDebouncedCallback(fetchData, 300);

  // ─── Effects ───────────────────────────────────

  // initial load
  useEffect(() => {
    if (fetchOnMount) fetchData();
  }, []);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // position dropdown
  useEffect(() => {
    if (!open) return;

    const update = () => {
      const rect = inputRef.current?.getBoundingClientRect();
      if (rect) {
        setStyle({
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
        });
      }
    };

    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  // ─── Handlers ──────────────────────────────────

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    setOpen(true);

    if (!q) {
      setOptions(initialOptions);
    } else {
      debouncedFetch(q);
    }
  };

  const handleSelect = (option) => {
    onChange({ target: { name, value: option.value } });
    setOpen(false);
    setQuery('');
  };

  const handleClear = () => {
    onChange({ target: { name, value: '' } });
    setQuery('');
    setOptions(initialOptions);
  };

  // ─── Render ────────────────────────────────────

  return (
    <div className={className} ref={containerRef}>
      {label && <label className="form-label">{label}:</label>}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          autoComplete="off"
          placeholder={placeholder}
          value={open ? query : (selected?.label || '')}
          onFocus={() => setOpen(true)}
          onChange={handleChange}
          className={`form-input w-full pr-8 ${errors.length ? 'error' : ''}`}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {loading && <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />}
          {value && !disabled && (
            <button onClick={handleClear}>✕</button>
          )}
        </div>
      </div>

      <input type="hidden" name={name} value={value || ''} />

      {open && createPortal(
        <ul style={style} className="bg-white border rounded shadow max-h-56 overflow-y-auto">
          {!loading && options.length === 0 && (
            <li className="px-4 py-2 text-gray-400">No results</li>
          )}

          {options.map(o => (
            <li
              key={o.value}
              onMouseDown={() => handleSelect(o)}
              className={`px-4 py-2 cursor-pointer hover:bg-indigo-50
                ${String(o.value) === String(value) ? 'bg-indigo-50 font-semibold' : ''}`}
            >
              {o.label}
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
}