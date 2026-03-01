import React from 'react';

export default ({ name, label, checked, onChange, errors = [] }) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
      </div>
      <div className="ml-3 mr-3 text-sm">
        <label htmlFor={name} className="font-medium text-gray-700">
          {label}
        </label>
        {errors.length > 0 && (
          <div className="form-error">{errors[0]}</div>
        )}
      </div>
    </div>
  );
};
