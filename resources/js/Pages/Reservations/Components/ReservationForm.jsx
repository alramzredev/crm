import React, { useState, useMemo } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import axios from 'axios';
import {
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import LeadInformationStep from './LeadInformationStep';
import UnitSelectionStep from './UnitSelectionStep';
import PaymentInformationStep from './PaymentInformationStep';
import ContractTermsStep from './ContractTermsStep';
import PaymentSummaryCard from './PaymentSummaryCard';
import UnitInformationCard from './UnitInformationCard';
import { useTranslation } from 'react-i18next';

const ReservationForm = ({ mode = 'create', reservation }) => {
  const { t } = useTranslation();
  const { lead } = usePage().props;
  const [activeStep, setActiveStep] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(
    mode === 'edit' && reservation?.unit ? reservation.unit : null
  );

  const { paymentMethods = [], paymentPlans = [] } = usePage().props;

  // Initial form data
  const initialData = mode === 'edit' && reservation
    ? {
        status: reservation.status || '',
        lead_id: reservation.lead_id || '',
        first_name: reservation.customer?.first_name || '',
        last_name: reservation.customer?.last_name || '',
        email: reservation.customer?.email || '',
        phone: reservation.customer?.phone || '',
        national_id: reservation.customer?.national_id || '',
        national_address_file: '',
        national_id_file: '',
        project_id: reservation.project_id || '',
        property_id: reservation.property_id || '',
        unit_id: reservation.unit_id || '',
        payment_method: reservation.payment_method || '',
        payment_method_id: reservation.payment_method_id || '',
        payment_plan: reservation.payment_plan || 'installment',
        payment_plan_id: reservation.payment_plan_id || '',
        down_payment: reservation.down_payment || '',
        total_price: reservation.total_price || '',
        remaining_amount: reservation.remaining_amount || '',
        currency: reservation.currency || 'SAR',
        notes: reservation.notes || '',
        terms_accepted: false,
        privacy_accepted: false,
      }
    : {
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
        payment_method_id: '',
        payment_plan: 'installment',
        payment_plan_id: '',
        down_payment: '',
        total_price: '',
        remaining_amount: '',
        currency: 'SAR',
        notes: '',
        terms_accepted: false,
        privacy_accepted: false,
        status: 'active',
      };

  const { data, setData, post, put, processing, errors } = useForm(initialData);

  const steps = [
    t('lead_information'),
    t('select_unit'),
    t('payment_information'),
    t('contract_and_sign')
  ];

  // Auto-populate total_price and remaining_amount when unit is selected
  useMemo(() => {
    if (selectedUnit && selectedUnit.price) {
      setData(prev => {
        const newData = { ...prev, total_price: selectedUnit.price };
        if (prev.down_payment) {
          const remaining = Math.max(0, parseFloat(selectedUnit.price) - parseFloat(prev.down_payment));
          newData.remaining_amount = remaining.toFixed(2);
        } else {
          newData.remaining_amount = selectedUnit.price;
        }
        return newData;
      });
    }
    // eslint-disable-next-line
  }, [selectedUnit?.id]);

  const handleNext = () => {
    if (activeStep === 2 && mode === 'create') {
      post(route('reservations.store'), { forceFormData: true });
      return;
    }
    if (activeStep === 2 && mode === 'edit') {
      put(route('reservations.update', reservation.id));
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = async (field, value) => {
    setData(field, value);

    if (field === 'project_id') {
      setData('property_id', '');
      setData('unit_id', '');
      setData('total_price', '');
      setData('remaining_amount', '');
      setSelectedUnit(null);
    } else if (field === 'property_id') {
      setData('unit_id', '');
      setData('total_price', '');
      setData('remaining_amount', '');
      setSelectedUnit(null);
    } else if (field === 'down_payment') {
      if (data.total_price) {
        const remaining = Math.max(0, parseFloat(data.total_price) - parseFloat(value || 0));
        setData('remaining_amount', remaining.toFixed(2));
      }
    } else if (field === 'total_price') {
      const downPayment = parseFloat(data.down_payment || 0);
      const remaining = Math.max(0, parseFloat(value || 0) - downPayment);
      setData('remaining_amount', remaining.toFixed(2));
    } else if (field === 'unit_id' && value) {
      try {
        const response = await axios.get(route('search.unit.show', value));
        const unit = response.data;
        setSelectedUnit(unit);
      } catch (error) {
        console.error('Failed to load unit details', error);
      }
    }
  };

  const handleCheckboxChange = (field) => {
    setData(field, !data[field]);
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === 'create') {
      post(route('reservations.store'), { forceFormData: true });
    } else {
      put(route('reservations.update', reservation.id));
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <LeadInformationStep data={data} handleChange={handleChange} errors={errors} />;
      case 1:
        return (
          <>
            <UnitSelectionStep 
              data={data} 
              handleChange={handleChange}
              errors={errors}
            />
            {selectedUnit && <UnitInformationCard selectedUnit={selectedUnit} />}
          </>
        );
      case 2:
        return (
          <>
            <PaymentInformationStep
              data={data}
              handleChange={handleChange}
              errors={errors}
              paymentMethods={paymentMethods}
              paymentPlans={paymentPlans}
            />
            <PaymentSummaryCard data={data} />
          </>
        );
      case 3:
        return <ContractTermsStep data={data} handleCheckboxChange={handleCheckboxChange} errors={errors} />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return data.first_name && data.last_name && data.national_id;
      case 1:
        return data.unit_id;
      case 2:
          return data.payment_method_id && data.payment_plan_id;
      case 3:
        return data.terms_accepted && data.privacy_accepted;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl overflow-hidden bg-white rounded shadow">
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {t('there_were_errors_with_your_submission')}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  '& .MuiStepLabel-iconContainer': {
                    paddingInlineEnd: '8px',
                  },
                  '& .MuiStepIcon-root': {
                    color: '#bdbdbd',
                  },
                  '& .MuiStepIcon-root.Mui-active': {
                    color: '#1976d2',
                  },
                  '& .MuiStepIcon-root.Mui-completed': {
                    color: '#2e7d32',
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
            {t('back')}
          </button>

          <div className="flex items-center gap-2">
            <Link href={mode === 'edit' ? route('reservations') : route('leads')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
              {t('cancel')}
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
              {activeStep === 2 ? (mode === 'edit' ? t('update_reservation') : t('submit')) : (activeStep === steps.length - 1 ? (mode === 'edit' ? t('update_reservation') : t('submit')) : t('next'))}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
