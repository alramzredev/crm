import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import EditButton from '@/Shared/TableActions/EditButton';
import CreateReservationButton from '@/Shared/TableActions/CreateReservationButton';
import StatusPill from '@/Shared/StatusPill';
import { useTranslation } from 'react-i18next';

const Contracts = ({
  contractDocuments = [],
  canGenerateContract = false,
  reservation,
  contractTypes = [],
  handleGenerateContract,
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Map contract types to contractDocuments
  const contractsByType = {};
  contractDocuments.forEach(contract => {
    if (contract.contract_type_id) {
      contractsByType[contract.contract_type_id] = contract;
    }
  });

  const openUploadModal = (contract, docType) => {
    setSelectedDocType({ contract, docType });
    setFile(null);
    setErrors([]);
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedDocType(null);
    setFile(null);
    setErrors([]);
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file || !selectedDocType) {
      setErrors(['Please select a file to upload.']);
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', selectedDocType.docType);

    router.post(
      route('contracts.documents.upload', {
        reservation: reservation.id,
        document: selectedDocType.docType,
        contract: selectedDocType.contract.id,
      }),
      formData,
      {
        forceFormData: true,
        onSuccess: closeUploadModal,
        onError: (err) => setErrors([err.file || 'Upload failed.']),
        onFinish: () => setUploading(false),
      }
    );
  };

  // Render a card for each contract type
  const renderContractCard = (contractType) => {
    const contract = contractsByType[contractType.id] || null;
    return (
      <div key={contractType.id} className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{contractType.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{t('status')}:</span>
            <StatusPill status={contract?.status || 'draft'} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">{t('original_contract')}</div>
              {contract?.original_contract ? (
                <a
                  href={contract.original_contract.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 hover:underline"
                >
                  {t('view')}
                </a>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">{t('signed_contract')}</div>
              {contract?.signed_contract ? (
                <a
                  href={contract.signed_contract.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 hover:underline"
                >
                  {t('view')}
                </a>
              ) : (
                <span className="text-gray-400">{t('not_uploaded')}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-[180px]">
          {canGenerateContract && !contract && (
            <CreateReservationButton
              label={t('generate_contract')}
              onClick={() => handleGenerateContract(contractType.code)}
            />
          )}
          {contract && (
            <EditButton
              label={t('upload_signed')}
              onClick={() => openUploadModal(contract, 'signed_contract')}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7v10M17 7v10M5 17h14M5 7h14M12 3v4m0 10v4" />
        </svg>
        {t('contracts')}
      </h2>
      {contractTypes.map(renderContractCard)}

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="mb-4 text-lg font-semibold">
              {t('upload_document')}
            </h3>
            <form onSubmit={handleUpload}>
              <input
                type="file"
                className="mb-4 block w-full"
                onChange={handleFileChange}
                accept="application/pdf"
              />
              {errors.length > 0 && (
                <div className="mb-2 text-red-600">
                  {errors.map((err, idx) => <div key={idx}>{t(err)}</div>)}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={closeUploadModal}
                  disabled={uploading}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  disabled={uploading}
                >
                  {uploading ? t('uploading') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;
