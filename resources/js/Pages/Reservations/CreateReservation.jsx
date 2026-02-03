import React, { useState, useMemo } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import {
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import FileInput from '@/Shared/FileInput';

const CreateReservation = () => {
  const { lead, projects = [], properties = [], units = [] } = usePage().props;
  const [activeStep, setActiveStep] = useState(0);
  const { data, setData, post, processing } = useForm({
    lead_id: lead?.id || '',
    first_name: lead?.first_name || '',
    last_name: lead?.last_name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    national_id: lead?.national_id || '',
    national_address_file: '',
    national_id_file: '',
    project_id: '',
    property_id: '',
    unit_id: '',
    payment_method: '',
    down_payment: '',
    payment_plan: 'installment',
    terms_accepted: false,
    privacy_accepted: false,
  });

  const steps = ['Lead Information', 'Select Unit', 'Payment Information', 'Contract & Sign'];

  // Filter properties by selected project
  const filteredProperties = useMemo(() => {
    if (!data.project_id) return [];
    return properties.filter(p => String(p.project_id) === String(data.project_id));
  }, [data.project_id, properties]);

  // Filter units by selected property
  const filteredUnits = useMemo(() => {
    if (!data.property_id) return [];
    return units.filter(u => String(u.property_id) === String(data.property_id));
  }, [data.property_id, units]);

  const selectedUnit = useMemo(() => {
    return units.find(u => String(u.id) === String(data.unit_id));
  }, [data.unit_id, units]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field, value) => {
    setData(field, value);

    if (field === 'project_id') {
      setData('property_id', '');
      setData('unit_id', '');
    } else if (field === 'property_id') {
      setData('unit_id', '');
    }
  };

  const handleCheckboxChange = (field) => {
    setData(field, !data[field]);
  };

  function handleSubmit(e) {
    e.preventDefault();
    post(route('reservations.store'), { forceFormData: true });
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
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

      case 1:
        return (
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Project"
              name="project_id"
              value={data.project_id}
              onChange={e => handleChange('project_id', e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </SelectInput>

            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Property"
              name="property_id"
              value={data.property_id}
              onChange={e => handleChange('property_id', e.target.value)}
              disabled={!data.project_id}
            >
              <option value="">Select Property</option>
              {filteredProperties.map(p => <option key={p.id} value={p.id}>{p.property_code}</option>)}
            </SelectInput>

            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Unit"
              name="unit_id"
              value={data.unit_id}
              onChange={e => handleChange('unit_id', e.target.value)}
              disabled={!data.property_id}
            >
              <option value="">Select Unit</option>
              {filteredUnits.map(u => <option key={u.id} value={u.id}>{u.unit_code} - {u.unit_number}</option>)}
            </SelectInput>

            {selectedUnit && (
              <div className="w-full pb-8 pr-6">
                <div className="bg-indigo-50 rounded border border-indigo-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Unit Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Unit Code</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.unit_code}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Unit Number</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.unit_number}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Floor</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.floor || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Area (sqm)</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.area || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Rooms</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.rooms || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                      <p className="text-sm font-semibold text-green-600 mt-1">{selectedUnit.status?.name || '—'}</p>
                    </div>
                    {selectedUnit.building_surface_area && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Building Area (sqm)</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.building_surface_area}</p>
                      </div>
                    )}
                    {selectedUnit.wc_number && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">WC Number</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.wc_number}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Payment Method"
              name="payment_method"
              value={data.payment_method}
              onChange={e => handleChange('payment_method', e.target.value)}
            >
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="check">Check</option>
            </SelectInput>

            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Down Payment"
              name="down_payment"
              type="number"
              value={data.down_payment}
              onChange={e => handleChange('down_payment', e.target.value)}
            />

            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Payment Plan"
              name="payment_plan"
              value={data.payment_plan}
              onChange={e => handleChange('payment_plan', e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="installment">Installment</option>
              <option value="mortgage">Mortgage</option>
            </SelectInput>

            <div className="w-full pb-8 pr-6 lg:w-1/2">
              <div className="bg-gray-50 rounded border border-gray-200 p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Down Payment</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">${data.down_payment || '0.00'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Payment Plan</p>
                    <p className="text-lg font-bold text-gray-900 mt-2 capitalize">{data.payment_plan}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <div className="w-full pb-8 pr-6">
              <div className="bg-gray-50 rounded border border-gray-200 p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Reservation Agreement</h4>
                <p className="text-sm text-gray-600 mb-3">
                  By signing this contract, you agree to reserve the selected unit under the terms and conditions specified. 
                  The down payment is non-refundable unless otherwise specified in the payment plan agreement.
                </p>
                <h4 className="font-semibold text-gray-900 mb-2">Payment Terms</h4>
                <p className="text-sm text-gray-600">
                  Payment must be made according to the schedule outlined in the payment plan. 
                  Failure to meet payment obligations may result in cancellation of the reservation.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.terms_accepted}
                    onChange={() => handleCheckboxChange('terms_accepted')}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">I agree to the terms and conditions</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.privacy_accepted}
                    onChange={() => handleCheckboxChange('privacy_accepted')}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">I agree to the privacy policy</span>
                </label>
              </div>

              <div className="bg-green-50 rounded border border-green-200 p-4">
                <p className="text-sm text-green-800 font-medium">
                  ✓ All information has been verified. Please review the details above before submitting.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return data.first_name && data.last_name && data.email && data.phone;
      case 1:
        return data.unit_id;
      case 2:
        return data.payment_method && data.down_payment;
      case 3:
        return data.terms_accepted && data.privacy_accepted;
      default:
        return false;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          <Link href={route('leads')} className="text-indigo-600 hover:text-indigo-700">
            Leads
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          Create Reservation
        </h1>
        <p className="text-gray-600 text-sm mt-2">Create a new reservation for {lead?.first_name} {lead?.last_name}</p>
      </div>

      <div className="max-w-4xl overflow-hidden bg-white rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="p-8 border-b border-gray-200">
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    },
                    '& .MuiStepIcon-root': {
                      color: '#bdbdbd', // default (inactive)
                    },
                    '& .MuiStepIcon-root.Mui-active': {
                      color: '#1976d2', // active step
                    },
                    '& .MuiStepIcon-root.Mui-completed': {
                      color: '#2e7d32', // completed steps
                    },
                  }}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>

          {renderStepContent()}

          <div className="flex items-center justify-between px-8 py-4 bg-gray-100 border-t border-gray-200">
            <button
              type="button"
              disabled={activeStep === 0}
              onClick={handleBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              <Link href={route('leads')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Cancel
              </Link>

              <button
                type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                onClick={activeStep === steps.length - 1 ? undefined : handleNext}
                disabled={!isStepValid() || processing}
                className={`px-4 py-2 text-sm font-medium text-white rounded ${
                  isStepValid()
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

CreateReservation.layout = page => <Layout children={page} />;

export default CreateReservation;
