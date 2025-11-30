'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { User, Role } from '@/lib/store/authStore';
import { getUsers, createUser, updateUser, deleteUser, CreateUserData, UpdateUserData } from '@/lib/api/users';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import UserFormModal from '@/components/dashboard/UserFormModal';

const ROLE_COLORS: Record<Role, string> = {
  ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  WAITER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  KITCHEN: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function UsersPage() {
  const t = useTranslations('dashboard');

  // Require ADMIN role for this page
  useRequireAuth({ requiredRoles: ['ADMIN'] });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function handleAddUser() {
    setEditingUser(null);
    setModalOpen(true);
  }

  function handleEditUser(user: User) {
    setEditingUser(user);
    setModalOpen(true);
  }

  async function handleSaveUser(data: CreateUserData | UpdateUserData) {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, data as UpdateUserData);
      } else {
        await createUser(data as CreateUserData);
      }
      setModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      throw err; // Let the modal handle the error
    }
  }

  async function handleDeleteUser(id: string) {
    try {
      await deleteUser(id);
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('users')}
        </h2>
        <Button variant="primary" onClick={handleAddUser}>
          {t('addUser')}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{t('loading')}</p>
        </div>
      )}

      {/* Users Table */}
      {!loading && (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('userName')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('userEmail')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('userRole')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('userActions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${ROLE_COLORS[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" onClick={() => handleEditUser(user)}>
                        {t('edit')}
                      </Button>
                      {deleteConfirm === user.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            {t('confirmDelete')}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            {t('cancel')}
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteConfirm(user.id)}
                        >
                          {t('delete')}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {t('noUsers')}
            </div>
          )}
        </Card>
      )}

      {/* User Form Modal */}
      <UserFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </div>
  );
}
