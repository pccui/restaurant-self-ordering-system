'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Dialog from '@/components/ui/Dialog';
import { getAuditLogsForEntity, AuditLog } from '@/lib/api/audit';

interface HistoryDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string | null;
  tableId: string | null;
}

export default function HistoryDialog({ open, onClose, orderId, tableId }: HistoryDialogProps) {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && orderId) {
      loadLogs();
    } else {
      setLogs([]);
    }
  }, [open, orderId]);

  async function loadLogs() {
    if (!orderId) return;
    try {
      setLoading(true);
      setError('');
      const data = await getAuditLogsForEntity('Order', orderId);
      // Sort descending
      setLogs(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function formatAction(action: string) {
    // Basic formatting: "ORDER_CREATED" -> "Order Created"
    return action
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`${t('history')} - Table ${tableId || '?'}`}
    >
      <div className="max-h-[60vh] overflow-y-auto px-1">
        {loading && (
          <div className="py-8 text-center text-gray-500">
            <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading...
          </div>
        )}

        {error && (
          <div className="py-4 text-center text-red-500 text-sm">{error}</div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="py-8 text-center text-gray-500 text-sm">
            No history found
          </div>
        )}

        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatAction(log.action)}
                </p>
                <div className="mt-1 space-y-1">
                  {/* Changes Summary - simplistic view */}
                  {log.changes && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-white dark:bg-gray-900/50 p-2 rounded border border-gray-200 dark:border-gray-700/50 overflow-x-auto">
                      {/* Show simplified changes if possible */}
                      {log.action.includes('STATUS') && log.changes.after && (
                        <span>Status: {String((log.changes.before as any)?.status)} ➔ {String((log.changes.after as any)?.status)}</span>
                      )}
                      {log.action.includes('ITEMS') && (
                        <span>Items updated</span>
                      )}
                      {!log.action.includes('STATUS') && !log.action.includes('ITEMS') && (
                        <span>{JSON.stringify(log.changes.after || log.changes)}</span>
                      )}
                    </div>
                  )}
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col items-end min-w-[100px]">
                <span className="text-xs text-gray-400">{formatDate(log.createdAt)}</span>
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400 mt-1">
                  {log.userEmail || 'System'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
