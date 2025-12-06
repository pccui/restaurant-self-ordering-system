'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Dialog from '@/components/ui/Dialog';
import { getAuditLogsForEntity, AuditLog } from '@/lib/api/audit';
import { menuData } from '@/lib/data/menuData';

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
    return action
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  function getItemName(id: string) {
    const item = menuData.find(m => m.id === id);
    if (!item) return `Item #${id}`;
    // @ts-ignore - dynamic locale access
    return item.translations[locale]?.name || item.translations['en']?.name || 'Unknown Item';
  }

  function getDiff(log: AuditLog) {
    const changes: string[] = [];

    // 1. Status Change
    if (log.changes?.before && log.changes?.after && 'status' in log.changes.after) {
      const oldStatus = (log.changes.before as any).status;
      const newStatus = (log.changes.after as any).status;
      if (oldStatus !== newStatus) {
        changes.push(`${t('status')}: ${oldStatus} ➔ ${newStatus}`);
      }
    } else if (log.changes?.after && 'status' in log.changes.after) {
      // Fallback if before is missing but status is in after (e.g. init)
      const newStatus = (log.changes.after as any).status;
      changes.push(`${t('status')}: ${newStatus}`);
    }

    // 2. Items Change
    if (log.changes?.before && log.changes?.after && 'items' in log.changes.after) {
      const oldItems: any[] = (log.changes.before as any).items || [];
      const newItems: any[] = (log.changes.after as any).items || [];

      // Map ID -> Qty
      const oldMap = new Map<string, number>();
      const newMap = new Map<string, number>();

      oldItems.forEach(i => oldMap.set(i.menuItemId, i.qty));
      newItems.forEach(i => newMap.set(i.menuItemId, i.qty));

      const allIds = new Set([...Array.from(oldMap.keys()), ...Array.from(newMap.keys())]);

      allIds.forEach(id => {
        const oldQty = oldMap.get(id) || 0;
        const newQty = newMap.get(id) || 0;
        const diff = newQty - oldQty;
        const name = getItemName(id);

        if (diff > 0) {
          changes.push(`+ ${diff}x ${name}`);
        } else if (diff < 0) {
          changes.push(`- ${Math.abs(diff)}x ${name}`);
        }
      });
    }

    // 3. Fallback for other changes or empty diffs but valid log
    if (changes.length === 0) {
      // Try to show reason if available (e.g. auto-confirm)
      // Check log.changes for "reason" key directly if flatten, or inside after
      // The screenshot showed {"reason": "Auto-confirmed...", "status": "confirmed"} as the 'update' content
      const content = log.changes?.after || log.changes || {};
      if ('reason' in content) {
        changes.push((content as any).reason);
      }
      // If still empty and we have raw content, simplistic json
      else if (Object.keys(content).length > 0) {
        // Filter out 'updatedAt' etc
        const filtered = Object.entries(content).filter(([k]) => !['updatedAt', 'total'].includes(k));
        if (filtered.length > 0) {
          // Just stringify if we can't parse it nicely
          changes.push(JSON.stringify(Object.fromEntries(filtered)).slice(0, 50));
        }
      }
    }

    if (changes.length === 0) return null;

    return (
      <ul className="list-disc list-inside space-y-1">
        {changes.map((c, i) => (
          <li key={i} className={`text-xs font-mono break-words ${c.startsWith('+') ? 'text-green-600 dark:text-green-400' : c.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {c}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`${t('history')} - Table ${tableId || '?'}`}
    >
      <div className="px-1 pb-4">
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
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatAction(log.action)}
                </p>
                <div className="mt-2 bg-white dark:bg-gray-900/50 p-2 rounded border border-gray-200 dark:border-gray-700/50">
                  {getDiff(log) || <span className="text-xs text-gray-400 italic">No visible changes</span>}
                </div>
              </div>
              <div className="text-right flex flex-col items-end shrink-0 ml-2">
                <span className="text-xs text-gray-400">{formatDate(log.createdAt)}</span>
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400 mt-1">
                  {log.userEmail || t('client')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
