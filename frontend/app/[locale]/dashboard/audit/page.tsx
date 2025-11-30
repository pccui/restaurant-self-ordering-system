'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store/authStore';
import { getAuditLogs, AuditLog } from '@/lib/api/audit';
import Card from '@/components/ui/Card';

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  STATUS_CHANGE: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  PAY: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const ACTION_ICONS: Record<string, string> = {
  CREATE: '➕',
  UPDATE: '✏️',
  DELETE: '🗑️',
  STATUS_CHANGE: '🔄',
  PAY: '💰',
};

export default function AuditLogsPage() {
  const t = useTranslations('audit');
  const { isAdmin } = useAuthStore();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');

  const fetchLogs = useCallback(async () => {
    if (!isAdmin()) return;
    
    try {
      setLoading(true);
      const data = await getAuditLogs({
        entityType: entityTypeFilter || undefined,
        action: actionFilter || undefined,
        limit: 100,
      });
      setLogs(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [entityTypeFilter, actionFilter, isAdmin]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  function formatChanges(changes: AuditLog['changes']) {
    if (!changes) return null;
    
    const parts: string[] = [];
    
    if (changes.before && changes.after) {
      // Show what changed
      const beforeKeys = Object.keys(changes.before);
      const afterKeys = Object.keys(changes.after);
      const allKeys = [...new Set([...beforeKeys, ...afterKeys])];
      
      allKeys.forEach(key => {
        const before = changes.before?.[key];
        const after = changes.after?.[key];
        if (JSON.stringify(before) !== JSON.stringify(after)) {
          if (key === 'status') {
            parts.push(`${before} → ${after}`);
          }
        }
      });
    } else if (changes.after) {
      parts.push('Created');
    }
    
    return parts.length > 0 ? parts.join(', ') : null;
  }

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Access denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {t('title')}
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={entityTypeFilter}
            onChange={(e) => setEntityTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">{t('allActions')}</option>
            <option value="Order">{t('order')}</option>
            <option value="User">{t('user')}</option>
          </select>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">{t('allActions')}</option>
            <option value="CREATE">{t('actionCreate')}</option>
            <option value="UPDATE">{t('actionUpdate')}</option>
            <option value="DELETE">{t('actionDelete')}</option>
            <option value="STATUS_CHANGE">{t('actionStatusChange')}</option>
          </select>

          <button
            onClick={fetchLogs}
            className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {t('refresh')}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && logs.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && logs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t('noLogs')}</p>
        </div>
      )}

      {/* Audit Logs Table */}
      {logs.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">{t('time')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">{t('action')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">{t('order')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">{t('user')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">{t('details')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800'}`}>
                        <span>{ACTION_ICONS[log.action] || '•'}</span>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900 dark:text-white">{log.entityType}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate max-w-[150px]">
                        {log.entityId}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {log.userEmail || <span className="text-gray-400 italic">{t('system')}</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {formatChanges(log.changes) || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
