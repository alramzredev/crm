import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import { useTranslation } from 'react-i18next';
import ReservationForm from './Components/ReservationForm';

const CreateReservation = () => {
  const { t } = useTranslation();
  const { lead } = usePage().props;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          <Link href={route('leads')} className="text-indigo-600 hover:text-indigo-700">
            {t('leads')}
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {t('create_reservation')}
        </h1>
        <p className="text-gray-600 text-sm mt-2">
          {t('create_a_new_reservation_for')} {lead?.first_name} {lead?.last_name}
        </p>
      </div>
      <ReservationForm mode="create" />
    </div>
  );
};

CreateReservation.layout = page => <Layout children={page} />;

export default CreateReservation;
