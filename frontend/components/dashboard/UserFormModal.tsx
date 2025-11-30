'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { User, Role } from '@/lib/store/authStore';
import { CreateUserData, UpdateUserData } from '@/lib/api/users';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserData | UpdateUserData) => Promise<void>;
  user: User | null; // null for create, User for edit
}

const ROLES: Role[] = ['ADMIN', 'WAITER', 'KITCHEN'];

export default function UserFormModal({ isOpen, onClose, onSave, user }: UserFormModalProps) {
  const t = useTranslations('dashboard');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('WAITER');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!user;

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setEmail(user.email);
        setName(user.name);
        setRole(user.role);
        setPassword(''); // Don't show existing password
      } else {
        setEmail('');
        setName('');
        setPassword('');
        setRole('WAITER');
      }
      setError('');
    }
  }, [isOpen, user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isEditing) {
        const updateData: UpdateUserData = { name, role };
        if (email !== user.email) updateData.email = email;
        if (password) updateData.password = password;
        await onSave(updateData);
      } else {
        if (!password) {
          setError(t('passwordRequired'));
          setIsSubmitting(false);
          return;
        }
        await onSave({ email, name, password, role } as CreateUserData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} size="md" title={isEditing ? t('editUser') : t('addUser')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t('userName')}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t('userEmail')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t('userPassword')}
            {isEditing && (
              <span className="text-gray-400 font-normal ml-2">
                ({t('leaveBlankToKeep')})
              </span>
            )}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Role Field */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t('userRole')}
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`role${r.charAt(0) + r.slice(1).toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? t('saving') : (isEditing ? t('save') : t('create'))}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
