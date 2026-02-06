import React, { useRef, useState } from 'react';
import { filesize } from '@/utils';

const Button = ({ text, onClick }) => (
  <button
    type="button"
    className="px-4 py-1 text-xs font-medium text-white bg-gray-600 rounded-sm focus:outline-none hover:bg-gray-700"
    onClick={onClick}
  >
    {text}
  </button>
);

export default ({ className, name, label, accept, errors = [], onChange }) => {
  const fileInput = useRef();
  const [files, setFiles] = useState([]);

  function browse() {
    if (fileInput.current) fileInput.current.value = '';
    fileInput.current?.click();
  }

  function remove(index) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onChange?.(next);
    if (fileInput.current && next.length === 0) {
      fileInput.current.value = '';
    }
  }

  function mergeFiles(existing, incoming) {
    const map = new Map();
    [...existing, ...incoming].forEach(file => {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      map.set(key, file);
    });
    return Array.from(map.values());
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    const next = mergeFiles(files, selected);
    setFiles(next);
    onChange?.(next);
    if (fileInput.current) fileInput.current.value = '';
  }

  return (
    <div className={className}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}:
        </label>
      )}
      <div className={`form-input p-0 ${errors.length && 'error'}`}>
        <input
          id={name}
          ref={fileInput}
          accept={accept}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        {files.length === 0 && (
          <div className="p-2">
            <Button text="Browse" onClick={browse} />
          </div>
        )}
        {files.length > 0 && (
          <div className="p-2 space-y-2">
            {files.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="flex items-center justify-between">
                <div className="flex-1 pr-2">
                  {file.name}
                  <span className="ml-1 text-xs text-gray-600">
                    ({filesize(file.size)})
                  </span>
                </div>
                <Button text="Remove" onClick={() => remove(idx)} />
              </div>
            ))}
            <div>
              <Button text="Change" onClick={browse} />
            </div>
          </div>
        )}
      </div>
      {errors.length > 0 && <div className="form-error">{errors}</div>}
    </div>
  );
};
