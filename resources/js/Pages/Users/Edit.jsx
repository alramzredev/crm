import React, { useMemo } from 'react';
import Helmet from 'react-helmet';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import TrashedMessage from '@/Shared/TrashedMessage';
import UserForm from './Components/UserForm';
import { useTranslation } from 'react-i18next';

const Edit = () => {
  const { user, roles = [], supervisors = [], projects = [], auth } = usePage().props;
  const { t } = useTranslation();

  const userRoleId = user?.roles && user.roles.length > 0 ? user.roles[0].id : '';
  const userSupervisorIds = user?.supervisor ? user.supervisor.map(s => s.id) : [];
  const userProjectIds = user?.projects ? user.projects.map(p => p.id) : [];

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  const { data, setData, errors, post, processing } = useForm({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    password: '',
    role: userRoleId,
    photo: '',
    supervisor_ids: userSupervisorIds,
    project_ids: userProjectIds,
    lead_capacity: user.lead_capacity ?? 0,
    _method: 'PUT'
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('users.update', user.id));
  }

  function destroy() {
    if (confirm(t('delete_user_confirm') || 'Are you sure you want to delete this user?')) {
      router.delete(route('users.destroy', user.id));
    }
  }

  function restore() {
    if (confirm(t('restore_user_confirm') || 'Are you sure you want to restore this user?')) {
      router.put(route('users.restore', user.id));
    }
  }

  return (
    <div>
      <Helmet title={`${data.first_name} ${data.last_name}`} />
      <div className="flex justify-start max-w-lg mb-8">
        <h1 className="text-3xl font-bold">
          <Link
            href={route('users')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            {t('users')}
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {data.first_name} {data.last_name}
        </h1>
        {user.photo && (
          <img className="block w-8 h-8 ml-4 rounded-full" src={user.photo} />
        )}
      </div>
      {user.deleted_at && can('users.restore') && (
        <TrashedMessage onRestore={restore}>
          {t('user_deleted')}
        </TrashedMessage>
      )}
      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <UserForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel={t('update_user')}
          roles={roles}
          supervisors={supervisors}
          projects={projects}
        />
        <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
          {!user.deleted_at && can('users.delete') && (
            <DeleteButton onDelete={destroy}>{t('delete_user')}</DeleteButton>
          )}
        </div>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
