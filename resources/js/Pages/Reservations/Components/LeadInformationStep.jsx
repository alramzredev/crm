import React from 'react';
import TextInput from '@/Shared/TextInput';
import FileInput from '@/Shared/FileInput';

const LeadInformationStep = ({ data, handleChange }) => {
  return (
    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="First Name"
        name="first_name"
        value={data.first_name}
        onChange={e => handleChange('first_name', e.target.value)}
      />
      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="Last Name"
        name="last_name"
        value={data.last_name}
        onChange={e => handleChange('last_name', e.target.value)}
      />
      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="Email"
        name="email"
        type="email"
        value={data.email}
        onChange={e => handleChange('email', e.target.value)}
      />
      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="Phone"
        name="phone"
        value={data.phone}
        onChange={e => handleChange('phone', e.target.value)}
      />
      <TextInput
        className="w-full pb-8 pr-6"
        label="National ID"
        name="national_id"
        value={data.national_id}
        onChange={e => handleChange('national_id', e.target.value)}
      />
      <FileInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="National Address File"
        name="national_address_file"
        accept="image/*,application/pdf"
        errors={[]}
        value={data.national_address_file}
        onChange={file => handleChange('national_address_file', file)}
      />
      <FileInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="National ID File"
        name="national_id_file"
        accept="image/*,application/pdf"
        errors={[]}
        value={data.national_id_file}
        onChange={file => handleChange('national_id_file', file)}
      />
    </div>
  );
};

export default LeadInformationStep;
