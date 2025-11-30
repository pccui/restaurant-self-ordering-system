'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import MenuList from '@/components/menu/MenuList';

export default function MenuPageWithoutTable() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('menu');
  const tCommon = useTranslations('common');
  const [tableId, setTableId] = useState('');
  const [showTableModal, setShowTableModal] = useState(false);

  function handleProceedToOrder() {
    if (!tableId.trim()) return;
    // Navigate to the table-specific menu page to place order
    router.push(`/${locale}/${tableId.trim()}/menu`);
  }

  return (
    <div className="relative">
      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 px-4 py-3 mb-4">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            📋 {t('browsingMode')}
          </p>
          <button
            onClick={() => setShowTableModal(true)}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
          >
            {t('enterTableId')}
          </button>
        </div>
      </div>

      {/* Menu List */}
      <MenuList />

      {/* Table ID Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('enterTableTitle')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('enterTableDescription')}
            </p>

            <input
              type="text"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleProceedToOrder()}
              placeholder={t('tableIdPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowTableModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {tCommon('cancel')}
              </button>
              <button
                onClick={handleProceedToOrder}
                disabled={!tableId.trim()}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {tCommon('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
