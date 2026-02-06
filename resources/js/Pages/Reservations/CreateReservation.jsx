import React, { useState, useMemo } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import {
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import LeadInformationStep from './Components/LeadInformationStep';
import UnitSelectionStep from './Components/UnitSelectionStep';
import PaymentInformationStep from './Components/PaymentInformationStep';
import ContractTermsStep from './Components/ContractTermsStep';
import PaymentSummaryCard from './Components/PaymentSummaryCard';
import UnitInformationCard from './Components/UnitInformationCard';

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
    total_price: '',
    remaining_amount: '',
    currency: 'SAR',
    notes: '',
    terms_accepted: false,
    privacy_accepted: false,
  });

  const steps = ['Lead Information', 'Select Unit', 'Payment Information', 'Contract & Sign'];

  // Get selected unit from units array
  const selectedUnit = useMemo(() => {
    return units.find(u => String(u.id) === String(data.unit_id));
  }, [data.unit_id, units]);

  // Auto-populate total_price and remaining_amount when unit is selected
  useMemo(() => {
    if (selectedUnit && selectedUnit.price) {
      setData(prev => {
        const newData = { ...prev, total_price: selectedUnit.price };

        // If there's a down_payment, calculate remaining
        if (prev.down_payment) {
          const remaining = Math.max(0, parseFloat(selectedUnit.price) - parseFloat(prev.down_payment));
          newData.remaining_amount = remaining.toFixed(2);
        } else {
          // If no down_payment yet, remaining_amount equals total_price
          newData.remaining_amount = selectedUnit.price;
        }

        return newData;
      });
    }
  }, [selectedUnit?.id]);

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
      setData('total_price', '');
      setData('remaining_amount', '');
    } else if (field === 'property_id') {
      setData('unit_id', '');
      setData('total_price', '');
      setData('remaining_amount', '');
    } else if (field === 'down_payment') {
      // Auto-calculate remaining amount when down_payment changes
      if (data.total_price) {
        const remaining = Math.max(0, parseFloat(data.total_price) - parseFloat(value || 0));
        setData('remaining_amount', remaining.toFixed(2));
      }
    } else if (field === 'total_price') {
      // Auto-calculate remaining amount when total_price changes
      const downPayment = parseFloat(data.down_payment || 0);
      const remaining = Math.max(0, parseFloat(value || 0) - downPayment);
      setData('remaining_amount', remaining.toFixed(2));
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
        return <LeadInformationStep data={data} handleChange={handleChange} />;
      case 1:
        return (
          <>
            <UnitSelectionStep 
              data={data} 
              handleChange={handleChange} 
              selectedUnit={selectedUnit} 
            />
            {selectedUnit && <UnitInformationCard selectedUnit={selectedUnit} />}
          </>
        );
      case 2:
        return (
          <>
            <PaymentInformationStep data={data} handleChange={handleChange} />
            <PaymentSummaryCard data={data} />
          </>
        );
      case 3:
        return <ContractTermsStep data={data} handleCheckboxChange={handleCheckboxChange} />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return data.first_name && data.last_name;
      case 1:
        return data.unit_id;
      case 2:
        return data.payment_method && data.payment_plan;
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
