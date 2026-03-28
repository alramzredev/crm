import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import { useTranslation } from 'react-i18next';
import ReservationForm from './Components/ReservationForm';

const Edit = () => {
  const { reservation } = usePage().props;
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('reservations')} className="text-indigo-600 hover:text-indigo-700">
          {t('reservations')}
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {reservation.reservation_code || t('edit')}
      </h1>
      <ReservationForm mode="edit" reservation={reservation} />
    </div>
  );
};

Edit.layout = page => <Layout title="Edit Reservation" children={page} />;

export default Edit;
