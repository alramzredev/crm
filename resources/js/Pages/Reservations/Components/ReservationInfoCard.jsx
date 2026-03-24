import React from 'react';
import StatusPill from '@/Shared/StatusPill';
import { useTranslation } from 'react-i18next';

const ReservationInfoCard = ({ reservation }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl bg-white rounded shadow mb-8">
      <div className="p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <strong>{t('status')}:</strong>
            <div className="mt-2">
              <StatusPill status={reservation.status} />
            </div>
          </div>
        </div>
        <div><strong>{t('started_at')}:</strong> {reservation.started_at ? new Date(reservation.started_at).toLocaleString() : '-'}</div>
        <div><strong>{t('expires_at')}:</strong> {reservation.expires_at ? new Date(reservation.expires_at).toLocaleString() : '-'}</div>
        <div><strong>{t('lead')}:</strong> {reservation.lead ? `${reservation.lead.first_name} ${reservation.lead.last_name}` : '-'}</div>
        <div><strong>{t('unit')}:</strong> {reservation.unit?.unit_code || '-'}</div>
        <div>
          <strong>{t('base_price')}:</strong> {reservation.currency || t('sar')} {reservation.base_price || reservation.total_price || '-'}
        </div>
        <div>
          <strong>{t('discount')}:</strong>{' '}
          {reservation.approved_discount_amount
            ? `${reservation.currency || t('sar')} ${reservation.approved_discount_amount} (${reservation.approved_discount_percentage || 0}%)`
            : '-'}
        </div>
        <div>
          <strong>{t('total_after_discount')}:</strong> {reservation.currency || t('sar')} {reservation.total_price || '-'}
        </div>
        <div>
          <strong>{t('down_payment')}:</strong> {reservation.currency || t('sar')} {reservation.down_payment || '-'}
        </div>
        <div>
          <strong>{t('remaining_amount')}:</strong> {reservation.currency || t('sar')} {reservation.remaining_amount || '-'}
        </div>
        <div><strong>{t('notes')}:</strong> {reservation.notes || '-'}</div>
        <div><strong>{t('payment_method')}:</strong> {reservation.payment_method || '-'}</div>
        <div><strong>{t('payment_plan')}:</strong> {reservation.payment_plan || '-'}</div>
      </div>
    </div>
  );
};

export default ReservationInfoCard;
