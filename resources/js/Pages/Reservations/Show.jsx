import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import PaymentsTable from './Components/PaymentsTable';
import DiscountRequestsTable from './Components/DiscountRequestsTable';
import DiscountRequestModal from './Components/DiscountRequestModal';
import PaymentFormModal from './Components/PaymentFormModal';
import StatusPill from './Components/StatusPill';
import ApprovalModal from './Components/ApprovalModal';
import CustomerDocuments from './Components/CustomerDocuments';

const Show = ({ reservation, cancelReasons, canApprove, discountRequests, customerDocuments = [] }) => {
  const { auth } = usePage().props; 
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('confirm');
  const [selectedReason, setSelectedReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Discount Request Modal State
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [requestedPrice, setRequestedPrice] = useState('');
  const [discountReason, setDiscountReason] = useState('');
  const [discountSubmitting, setDiscountSubmitting] = useState(false);
  const [editingDiscountRequest, setEditingDiscountRequest] = useState(null); // <-- add

  const handleModalClose = () => {
    setShowApprovalModal(false);
    setApprovalNotes('');
    setSelectedReason('');
    setApprovalAction('confirm');
  };

  const isApprovalAllowed = canApprove && reservation.status === 'active';

  // Sales employee can add payments to their own active reservations
  const canAddPayment =
    auth?.roles?.includes('sales_employee')
      ? reservation.created_by === auth.user?.id && reservation.status === 'active'
      : (auth.user?.permissions?.includes('payments.create') || false);

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  // Can request discount based on permissions
  const canRequestDiscount = can('discount-requests.create');

  // Can approve/reject discount requests based on permissions
  const canApproveDiscount = can('discount-requests.approve') || can('discount-requests.reject');

  const canEditPayment = can('payments.edit');
  const canDeletePayment = can('payments.delete');
  const canManagePayments = canAddPayment || canEditPayment || canDeletePayment;
 
  // Open modal for editing
  const handleEditDiscountRequest = (discountRequest) => {
    setEditingDiscountRequest(discountRequest);
    setRequestedPrice(discountRequest.requested_price || '');
    setDiscountReason(discountRequest.reason || '');
    setShowDiscountModal(true);
  };

  // Submit Discount Request (create or update)
  const handleDiscountSubmit = (e) => {
    e.preventDefault();
    setDiscountSubmitting(true);

    if (editingDiscountRequest) {
      // Update existing discount request
      router.put(
        route('discount-requests.update', editingDiscountRequest.id),
        {
          requested_price: requestedPrice,
          reason: discountReason,
        },
        {
          onSuccess: () => {
            setShowDiscountModal(false);
            setRequestedPrice('');
            setDiscountReason('');
            setEditingDiscountRequest(null);
          },
          onFinish: () => setDiscountSubmitting(false),
        }
      );
    } else {
      // Create new discount request
      router.post(
        route('reservations.discount-requests.store', reservation.id),
        {
          requested_price: requestedPrice,
          reason: discountReason,
        },
        {
          onSuccess: () => {
            setShowDiscountModal(false);
            setRequestedPrice('');
            setDiscountReason('');
          },
          onFinish: () => setDiscountSubmitting(false),
        }
      );
    }
  };

  const handleEditPayment = (payment) => {
    if (!canEditPayment) return;
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const handleDeletePayment = (paymentId) => {
    if (!canDeletePayment) return;
    if (confirm('Are you sure you want to delete this payment?')) {
      router.delete(route('payments.destroy', paymentId));
    }
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  // Document validation state
  const [ , setDocErrors] = useState([]);

  // Helper to check if all required documents are uploaded and approved
  const allRequiredDocsValid = customerDocuments
    .filter(doc => doc.is_required)
    .every(doc => doc.media && doc.status === 'approved');

  const handleApprove = () => {
    console.log('Checking documents before approval...', allRequiredDocsValid);
    if (!allRequiredDocsValid) {
      setDocErrors(['All required customer documents must be uploaded and approved before approval.']);
      return;
    }
    setShowApprovalModal(true);
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('reservations')} className="text-indigo-600 hover:text-indigo-700">
          Reservations
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {reservation.reservation_code || 'Reservation'}
      </h1>

      <div className="max-w-3xl bg-white rounded shadow mb-8">
        <div className="p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <strong>Status:</strong>
              <div className="mt-2">
                <StatusPill status={reservation.status} />
              </div>
            </div>
          </div>

          <div><strong>Started At:</strong> {reservation.started_at ? new Date(reservation.started_at).toLocaleString() : '—'}</div>
          <div><strong>Expires At:</strong> {reservation.expires_at ? new Date(reservation.expires_at).toLocaleString() : '—'}</div>
          <div><strong>Lead:</strong> {reservation.lead ? `${reservation.lead.first_name} ${reservation.lead.last_name}` : '—'}</div>
          <div><strong>Unit:</strong> {reservation.unit?.unit_code || '—'}</div>
          <div>
            <strong>Base Price:</strong> {reservation.currency || 'SAR'} {reservation.base_price || reservation.total_price || '—'}
          </div>
          <div>
            <strong>Discount:</strong>{' '}
            {reservation.approved_discount_amount
              ? `${reservation.currency || 'SAR'} ${reservation.approved_discount_amount} (${reservation.approved_discount_percentage || 0}%)`
              : '—'}
          </div>
          <div>
            <strong>Total (After Discount):</strong> {reservation.currency || 'SAR'} {reservation.total_price || '—'}
          </div>
          <div>
            <strong>Down Payment:</strong> {reservation.currency || 'SAR'} {reservation.down_payment || '—'}
          </div>
          <div>
            <strong>Remaining Amount:</strong> {reservation.currency || 'SAR'} {reservation.remaining_amount || '—'}
          </div>
          <div><strong>Notes:</strong> {reservation.notes || '—'}</div>
          <div><strong>Payment Method:</strong> {reservation.payment_method || '—'}</div>
          <div><strong>Payment Plan:</strong> {reservation.payment_plan || '—'}</div>
        </div>
      </div>

      {/* Payments Section */}
      <div className="bg-white rounded shadow overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
        </div>
        <PaymentsTable
          payments={reservation.payments || []}
          onEdit={handleEditPayment}
          onDelete={handleDeletePayment}
          readOnly={!canManagePayments}
        />
        {canAddPayment && (
          <div className="px-8 py-4 bg-gray-50 border-t">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm"
            >
              Record Payment
            </button>
          </div>
        )}
      </div>

      {/* Discount Requests Section */}
      <div className="bg-white rounded shadow overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Discount Requests</h2>
        </div>
        <DiscountRequestsTable
          discountRequests={discountRequests}
          canApprove={canApproveDiscount}
          onEdit={handleEditDiscountRequest}
        />
        {canRequestDiscount && (
          <div className="px-8 py-4 bg-gray-50 border-t">
            <button
              className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium text-sm"
              onClick={() => {
                setEditingDiscountRequest(null);
                setRequestedPrice('');
                setDiscountReason('');
                setShowDiscountModal(true);
              }}
            >
              Request Discount
            </button>
          </div>
        )}
      </div>

      <DiscountRequestModal
        isOpen={showDiscountModal}
        reservation={reservation}
        requestedPrice={requestedPrice}
        setRequestedPrice={setRequestedPrice}
        discountReason={discountReason}
        setDiscountReason={setDiscountReason}
        discountSubmitting={discountSubmitting}
        onSubmit={handleDiscountSubmit}
        onClose={() => {
          setShowDiscountModal(false);
          setEditingDiscountRequest(null);
        }}
        editing={!!editingDiscountRequest}
      />

      <PaymentFormModal
        isOpen={showPaymentModal}
        payment={selectedPayment}
        reservationId={reservation.id}
        onClose={handlePaymentModalClose}
      />

      {/* Customer Documents Section */}
      <CustomerDocuments
        documents={customerDocuments}
        customerId={reservation.customer_id}
        canEdit={true}
      />

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={handleModalClose}
        reservation={reservation}
        cancelReasons={cancelReasons}
        approvalAction={approvalAction}
        setApprovalAction={setApprovalAction}
        selectedReason={selectedReason}
        setSelectedReason={setSelectedReason}
        approvalNotes={approvalNotes}
        setApprovalNotes={setApprovalNotes}
        isSubmitting={isSubmitting}
      />

      {/* Elegant Approval Button at the bottom (not sticky) */}
      {isApprovalAllowed && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleApprove}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full shadow-lg hover:from-indigo-700 hover:to-indigo-800 font-semibold text-lg transition-all duration-200 flex items-center gap-2"
            style={{ minWidth: 200 }}
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4"></path>
            </svg>
            Approve / Reject Reservation
          </button>
        </div>
      )}
    </div>
  );
};

// Restore the layout assignment
Show.layout = page => <Layout title="Reservation" children={page} />;

export default Show;
