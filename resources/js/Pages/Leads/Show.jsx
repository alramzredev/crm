import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import StatusPill from '@/Shared/StatusPill';
import { useTranslation } from 'react-i18next';

const Show = () => {
  const { lead, employees = [], auth, canAssign } = usePage().props;
  const { t } = useTranslation();
  const canEdit = auth.user?.permissions?.includes('leads.edit');
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(lead.active_assignment?.employee_id || '');

  function handleAssign() {
    router.post(route('leads.assign-employee', lead.id), { employee_id: selectedEmployee }, {
      preserveScroll: true,
      onSuccess: () => setAssignOpen(false),
    });
  }

  function handleUnassign() {
    if (!window.confirm(t('are_you_sure_unassign_lead') || 'Are you sure you want to unassign this lead?')) {
      return;
    }
    setSelectedEmployee('');
    router.post(route('leads.unassign-employee', lead.id), {}, {
      preserveScroll: true,
      onSuccess: () => setAssignOpen(false),
    });
  }
  console.log('Lead details:', lead);

  const assignedEmployee = lead.activeAssignment?.employee?.first_name
    ? `${lead.activeAssignment.employee.first_name} ${lead.activeAssignment.employee.last_name}`
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          <Link href={route('leads')} className="text-indigo-600 hover:text-indigo-700">{t('leads')}</Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {lead.first_name} {lead.last_name}
        </h1>
        {canEdit && (
          <Link className="btn-indigo" href={route('leads.edit', lead.id)}>
            {t('edit')}
          </Link>
        )}
      </div>

      <div className="max-w-2xl bg-white rounded shadow p-8">
        <div className="mb-6">
          <div className="text-lg font-semibold mb-2">{t('lead_details')}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">{t('name')}</div>
              <div className="font-medium">{lead.first_name} {lead.last_name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">{t('phone')}</div>
              <div className="font-medium">{lead.phone || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">{t('email')}</div>
              <div className="font-medium">{lead.email || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">{t('project')}</div>
              <div className="font-medium">{lead.project?.name || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">{t('status')}</div>
              <div className="font-medium">
                <StatusPill status={lead.status?.code} name={lead.status?.name} />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">{t('lead_source')}</div>
              <div className="font-medium">{lead.leadSource?.name || '—'}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-lg font-semibold mb-2">{t('assignment')}</div>
          <div className="flex items-center gap-4">
            <div>
              <span className="font-medium">{t('assigned_to')}: </span>
              {assignedEmployee || <span className="text-gray-500">{t('unassigned')}</span>}
            </div>
            {canAssign && (
              <>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-700 bg-white rounded-lg font-semibold shadow-sm hover:bg-indigo-50 hover:border-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ml-2"
                  onClick={() => setAssignOpen(true)}
                  type="button"
                >
                   
                  {assignedEmployee ? t('reassign') : t('assign')}
                </button>
                {assignedEmployee && (
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 border border-red-500 text-red-700 bg-white rounded-lg font-semibold shadow-sm hover:bg-red-50 hover:border-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
                    onClick={handleUnassign}
                    type="button"
                  >
                    
                    {t('unassign')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Assignment Dialog */}
      {assignOpen && canAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('assign_lead')}
            </h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">{t('select_employee')}</label>
              <select
                className="form-input w-full"
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value)}
              >
                <option value="">{t('select_employee')}</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg font-semibold shadow-sm hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={() => setAssignOpen(false)}
              >
                
                {t('cancel')}
              </button>
              <button
                type="button"
                className={`inline-flex items-center gap-2 px-4 py-2 border border-indigo-600 text-white bg-indigo-600 rounded-lg font-semibold shadow-sm hover:bg-indigo-700 hover:border-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${!selectedEmployee ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleAssign}
                disabled={!selectedEmployee}
              >
                {t('assign')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Show.layout = page => <Layout title="Lead Details" children={page} />;

export default Show;
