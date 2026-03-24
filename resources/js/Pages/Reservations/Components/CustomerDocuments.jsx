import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import EditButton from '@/Shared/TableActions/EditButton';
import DeleteButton from '@/Shared/TableActions/DeleteButton';
import ShowButton from '@/Shared/TableActions/ShowButton';
import { useTranslation } from 'react-i18next';

const statusColors = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
};

const CustomerDocuments = ({ documents = [], customerId, canEdit }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const openUploadModal = (doc) => {
    setSelectedDoc(doc);
    setFile(null);
    setErrors([]);
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedDoc(null);
    setFile(null);
    setErrors([]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setErrors([t('please_select_file_to_upload')]);
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', selectedDoc.type);

    router.post(
      route('customer-documents.upload', { customer: customerId, document: selectedDoc.type }),
      formData,
      {
        forceFormData: true,
        onSuccess: () => {
          closeUploadModal();
        },
        onError: (err) => {
          setErrors([err.file || t('upload_failed')]);
        },
        onFinish: () => setUploading(false),
      }
    );
  };

  const handleDelete = (mediaId) => {
    if (!confirm(t('are_you_sure_delete_document_file'))) return;
    router.delete(
      route('customer-documents.destroy', { customer: customerId, document: mediaId }),
      {
        onSuccess: () => {},
        onError: () => setErrors([t('failed_to_delete_document')]),
      }
    );
  };

  const handleApproveDocument = (mediaId) => {
    if (!confirm(t('approve_this_document'))) return;
    router.post(
      route('customer-documents.approve', { customer: customerId, document: mediaId }),
      {},
      {
        onSuccess: () => {},
        onError: () => setErrors([t('failed_to_approve_document')]),
      }
    );
  };

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7v10M17 7v10M5 17h14M5 7h14M12 3v4m0 10v4" />
        </svg>
        {t('customer_documents')}
      </h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">{t('type')}</th>
              <th className="px-6 py-3 text-left">{t('required')}</th>
              <th className="px-6 py-3 text-left">{t('status')}</th>
              <th className="px-6 py-3 text-left">{t('file')}</th>
              <th className="px-6 py-3 text-left">{t('size')}</th>
              <th className="px-6 py-3 text-left">{t('mime')}</th>
              <th className="px-6 py-3 text-left">{t('expires_at')}</th>
              {canEdit && <th className="px-6 py-3 text-left">{t('actions')}</th>}
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.type} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{doc.type_name}</td>
                <td className="px-6 py-3">{doc.is_required ? <span className="text-red-600 font-bold">{t('yes')}</span> : t('no')}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2 py-1 rounded ${statusColors[doc.status] || 'bg-gray-100 text-gray-800'}`}>
                    {t(doc.status.charAt(0).toUpperCase() + doc.status.slice(1).toLowerCase())}
                  </span>
                  {doc.status === 'rejected' && doc.rejection_reason && (
                    <div className="text-xs text-red-500 mt-1">{t('reason')}: {doc.rejection_reason}</div>
                  )}
                </td>
                <td className="px-6 py-3">
                  {doc.media ? (
                    <a
                      href={doc.media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {doc.media.file_name || t('view')}
                    </a>
                  ) : (
                    <span className={`text-gray-400 ${doc.is_required ? 'font-bold text-red-500' : ''}`}>
                      {t('no_file')}{doc.is_required ? ` (${t('required')})` : ''}
                    </span>
                  )}
                </td>
                <td className="px-6 py-3">{doc.media ? `${(doc.media.size / 1024).toFixed(1)} KB` : '—'}</td>
                <td className="px-6 py-3">{doc.media ? doc.media.mime_type : '—'}</td>
                <td className="px-6 py-3">{doc.expires_at ? new Date(doc.expires_at).toLocaleDateString() : '—'}</td>
                {canEdit && (
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-2">
                      <EditButton
                        label={doc.media ? t('replace') : t('upload')}
                        onClick={() => openUploadModal(doc)}
                      />
                      {doc.media && (
                        <>
                          <ShowButton
                            label={t('approve')}
                            onClick={() => handleApproveDocument(doc.media.id)}
                          />
                          <DeleteButton
                            label={t('delete')}
                            onClick={() => handleDelete(doc.media.id)}
                          />
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={canEdit ? 6 : 5} className="px-6 py-4 text-center text-gray-500">{t('no_documents_found')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="mb-4 text-lg font-semibold">
              {selectedDoc.file_path ? t('replace_document') : t('upload_document')}
            </h3>
            <form onSubmit={handleUpload}>
              <input
                type="file"
                className="mb-4 block w-full"
                onChange={handleFileChange}
                accept="application/pdf,image/*"
              />
              {errors.length > 0 && (
                <div className="mb-2 text-red-600">
                  {errors.map((err, idx) => <div key={idx}>{err}</div>)}
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

export default CustomerDocuments;
