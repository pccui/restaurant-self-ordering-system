'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store/authStore';
import { getOrders, updateOrderStatus, DashboardOrder } from '@/lib/api/orders';
import { OrderStatus } from '@/lib/store/orderStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const STATUS_FILTERS: (OrderStatus | 'all')[] = ['all', 'pending', 'confirmed', 'preparing', 'completed', 'paid'];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  preparing: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  paid: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function OrdersPage() {
  const t = useTranslations('dashboard');
  const { user, isAdmin, isKitchen, isWaiter } = useAuthStore();

  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [tableFilter, setTableFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params: { status?: OrderStatus; tableId?: string } = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (tableFilter) params.tableId = tableFilter;

      const data = await getOrders(params);
      setOrders(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, tableFilter]);

  useEffect(() => {
    fetchOrders();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh orders
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatCurrency(cents: number) {
    return `€${(cents / 100).toFixed(2)}`;
  }

  // Determine which status buttons to show based on role
  function getNextStatusButtons(order: DashboardOrder): Array<{ status: OrderStatus; label: string }> {
    const buttons: Array<{ status: OrderStatus; label: string }> = [];

    if (isAdmin() || isKitchen()) {
      if (order.status === 'pending') {
        buttons.push({ status: 'confirmed', label: t('statusConfirm') });
      }
      if (order.status === 'confirmed') {
        buttons.push({ status: 'preparing', label: t('statusPrepare') });
      }
      if (order.status === 'preparing') {
        buttons.push({ status: 'completed', label: t('statusComplete') });
      }
    }

    if ((isAdmin() || isWaiter()) && order.status === 'completed') {
      buttons.push({ status: 'paid', label: t('statusPaid') });
    }

    return buttons;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {t('orders')}
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status Filter - Wrapped on mobile */}
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`
                  px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap flex-shrink-0
                  ${statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {status === 'all' ? t('filterAll') : t(`status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
              </button>
            ))}
          </div>

          {/* Table Filter */}
          <input
            type="text"
            placeholder={t('filterTable')}
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && orders.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{t('loading')}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t('noOrders')}</p>
        </div>
      )}

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-3 sm:p-4">
            {/* Order Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {t('table')} {order.tableId}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[order.status]}`}>
                    {t(`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {formatDate(order.placedAt)}
                </p>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {formatCurrency(order.total)}
              </span>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
              <ul className="space-y-1.5">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.qty}× {item.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatCurrency(item.priceCents * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Status Actions */}
            {getNextStatusButtons(order).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {getNextStatusButtons(order).map((btn) => (
                  <Button
                    key={btn.status}
                    size="sm"
                    variant={btn.status === 'paid' ? 'primary' : 'default'}
                    onClick={() => handleStatusChange(order.id, btn.status)}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
