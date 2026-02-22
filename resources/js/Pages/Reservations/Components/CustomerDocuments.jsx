import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const statusColors = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
};

const CustomerDocuments = ({ documents = [], customerId, canEdit }) => {
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
      setErrors(['Please select a file to upload.']);
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', selectedDoc.type); // or selectedDoc.type_name if that's the identifier

    router.post(
      route('customer-documents.upload', { customer: customerId, document: selectedDoc.type }), // use type as identifier
      formData,
      {
        forceFormData: true,
        onSuccess: () => {
          closeUploadModal();
        },
        onError: (err) => {
          setErrors([err.file || 'Upload failed.']);
        },
        onFinish: () => setUploading(false),
      }
    );
  };

  const handleDelete = (mediaId) => {
    if (!confirm('Are you sure you want to delete this document file?')) return;
    router.delete(
      route('customer-documents.destroy', { customer: customerId, document: mediaId }),
      {
        onSuccess: () => {},
        onError: () => setErrors(['Failed to delete document.']),
      }
    );
  };

  const handleApproveDocument = (mediaId) => {
    if (!confirm('Approve this document?')) return;
    router.post(
      route('customer-documents.approve', { customer: customerId, document: mediaId }),
      {},
      {
        onSuccess: () => {},
        onError: () => setErrors(['Failed to approve document.']),
      }
    );
  };

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7v10M17 7v10M5 17h14M5 7h14M12 3v4m0 10v4" />
        </svg>
        Customer Documents
      </h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Required</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">File</th>
              <th className="px-6 py-3 text-left">Size</th>
              <th className="px-6 py-3 text-left">Mime</th>
              <th className="px-6 py-3 text-left">Expires At</th>
              {canEdit && <th className="px-6 py-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.type} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{doc.type_name}</td>
                <td className="px-6 py-3">{doc.is_required ? <span className="text-red-600 font-bold">Yes</span> : 'No'}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2 py-1 rounded ${statusColors[doc.status] || 'bg-gray-100 text-gray-800'}`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                  {doc.status === 'rejected' && doc.rejection_reason && (
                    <div className="text-xs text-red-500 mt-1">Reason: {doc.rejection_reason}</div>
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
                      {doc.media.file_name || 'View'}
                    </a>
                  ) : (
                    <span className="text-gray-400">No file</span>
                  )}
                </td>
                <td className="px-6 py-3">{doc.media ? `${(doc.media.size / 1024).toFixed(1)} KB` : '—'}</td>
                <td className="px-6 py-3">{doc.media ? doc.media.mime_type : '—'}</td>
                <td className="px-6 py-3">{doc.expires_at ? new Date(doc.expires_at).toLocaleDateString() : '—'}</td>
                {canEdit && (
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="px-3 py-1 text-sm font-semibold rounded border border-indigo-600 bg-white text-indigo-600 hover:bg-indigo-50 hover:border-indigo-700 transition"
                        onClick={() => openUploadModal(doc)}
                      >
                        {doc.media ? 'Replace' : 'Upload'}
                      </button>
                      {doc.media && (
                        <>
                          <button
                            className="px-3 py-1 text-sm font-semibold rounded border border-green-600 bg-white text-green-600 hover:bg-green-50 hover:border-green-700 transition"
                            onClick={() => handleApproveDocument(doc.media.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="px-3 py-1 text-sm font-semibold rounded border border-red-600 bg-white text-red-600 hover:bg-red-50 hover:border-red-700 transition"
                            onClick={() => handleDelete(doc.media.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={canEdit ? 6 : 5} className="px-6 py-4 text-center text-gray-500">No documents found.</td>
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
              {selectedDoc.file_path ? 'Replace Document' : 'Upload Document'}
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Save'}
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
