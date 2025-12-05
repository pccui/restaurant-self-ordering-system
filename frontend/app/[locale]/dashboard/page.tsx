'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store/authStore';
import { getOrders, updateOrderStatus, deleteOrder, updateOrder, DashboardOrder } from '@/lib/api/orders';
import { OrderStatus } from '@/lib/store/orderStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { toast } from 'sonner';

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
  const { isAdmin, isKitchen, isWaiter } = useAuthStore();

  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [tableFilter, setTableFilter] = useState('');

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<DashboardOrder | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit modal
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<DashboardOrder | null>(null);
  const [editedItems, setEditedItems] = useState<DashboardOrder['items']>([]);
  const [saving, setSaving] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params: { status?: OrderStatus; tableId?: string } = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (tableFilter) params.tableId = tableFilter;

      const data = await getOrders(params);
      setOrders(data);
      // Initialize ref on manual fetch / filter change so we don't get massive notifications
      prevOrdersRef.current = data;
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, tableFilter]);

  // Ref to track previous orders for diffing
  const prevOrdersRef = useRef<DashboardOrder[]>([]);

  useEffect(() => {
    fetchOrders();

    // Poll for updates every 5 seconds (fast polling)
    const interval = setInterval(async () => {
      // Create a separate fetch function for silent background updates to avoid flicker
      // or just re-use fetchOrders if we handle state carefully
      try {
        const params: { status?: OrderStatus; tableId?: string } = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        if (tableFilter) params.tableId = tableFilter;

        const data = await getOrders(params);

        // Compare new data with previous ref to trigger notifications
        // We only notify if:
        // 1. New order appears (ID not in prev)
        // 2. Status changes (ID in prev, but status different)
        // 3. Items change (Total diff)

        const prevOrders = prevOrdersRef.current;
        if (prevOrders.length > 0) { // Don't notify on first load
          const prevMap = new Map(prevOrders.map(o => [o.id, o]));

          data.forEach(newOrder => {
            const oldOrder = prevMap.get(newOrder.id);

            if (!oldOrder) {
              // Case 1: New Order
              // Only notify if we are showing relevant filters
              toast.success(`New Order from Table ${newOrder.tableId}`, {
                description: `${formatCurrency(newOrder.total)} - ${newOrder.items.length} items`,
                duration: 5000,
              });
            } else {
              // Case 2: Status Change
              if (oldOrder.status !== newOrder.status) {
                toast.info(`Table ${newOrder.tableId}: Status updated`, {
                  description: `${t(`status${oldOrder.status.charAt(0).toUpperCase() + oldOrder.status.slice(1)}`)} ➔ ${t(`status${newOrder.status.charAt(0).toUpperCase() + newOrder.status.slice(1)}`)}`
                });
              }

              // Case 3: Content Change (Total changed)
              if (oldOrder.total !== newOrder.total && oldOrder.status === newOrder.status) {
                const diff = newOrder.total - oldOrder.total;
                const msg = diff > 0 ? 'Items added' : 'Items removed';
                toast.warning(`Table ${newOrder.tableId}: Order updated`, {
                  description: `${msg} (${formatCurrency(newOrder.total)})`
                });
              }
            }
          });
        }

        setOrders(data);
        prevOrdersRef.current = data;
        setError('');
      } catch (err) {
        // Silent error on polling
        console.error('Polling error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchOrders, statusFilter, tableFilter, t]);

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  // Delete handlers
  function openDeleteDialog(order: DashboardOrder) {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!orderToDelete) return;

    try {
      setDeleting(true);
      await deleteOrder(orderToDelete.id);
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete order');
    } finally {
      setDeleting(false);
    }
  }

  // Edit handlers
  function openEditDialog(order: DashboardOrder) {
    setOrderToEdit(order);
    setEditedItems(JSON.parse(JSON.stringify(order.items))); // Deep copy
    setEditDialogOpen(true);
  }

  function handleItemQtyChange(itemIndex: number, newQty: number) {
    setEditedItems(prev => {
      const updated = [...prev];
      if (newQty <= 0) {
        // Remove item
        updated.splice(itemIndex, 1);
      } else {
        updated[itemIndex] = { ...updated[itemIndex], qty: newQty };
      }
      return updated;
    });
  }

  async function handleSaveEdit() {
    if (!orderToEdit) return;

    try {
      setSaving(true);
      const newTotal = editedItems.reduce((sum, item) => sum + item.priceCents * item.qty, 0);
      await updateOrder(orderToEdit.id, { items: editedItems, total: newTotal });
      setEditDialogOpen(false);
      setOrderToEdit(null);
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setSaving(false);
    }
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Check if order can be edited (only pending orders within edit window)
  function canEditOrder(order: DashboardOrder): boolean {
    return order.status === 'pending';
  }

  // Check if order can be deleted (admin only, not paid)
  function canDeleteOrder(order: DashboardOrder): boolean {
    return isAdmin() && order.status !== 'paid';
  }

  const editedTotal = editedItems.reduce((sum, item) => sum + item.priceCents * item.qty, 0);

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

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {/* Status transition buttons */}
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

              {/* Edit button - shown for pending orders to all staff */}
              {canEditOrder(order) && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => openEditDialog(order)}
                >
                  {t('editOrder')}
                </Button>
              )}

              {/* Delete button - shown only to admin, not for paid orders */}
              {canDeleteOrder(order) && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => openDeleteDialog(order)}
                >
                  {t('deleteOrder')}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title={t('confirmDeleteTitle')}
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {t('confirmDeleteMessage', { table: orderToDelete?.tableId, total: orderToDelete ? formatCurrency(orderToDelete.total) : '' })}
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="default"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? t('deleting') : t('delete')}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title={t('editOrderTitle')}
      >
        <div className="p-6 space-y-6">
          {/* Order Info */}
          {orderToEdit && (
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('table')} <span className="text-gray-900 dark:text-white font-semibold">{orderToEdit.tableId}</span>
              </p>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {t('statusPending')}
              </span>
            </div>
          )}

          {/* Editable Items */}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {editedItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-base font-medium text-gray-900 dark:text-white flex-1">
                  {item.name}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleItemQtyChange(idx, item.qty - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-95 transition-all"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-base font-semibold text-gray-900 dark:text-white">{item.qty}</span>
                  <button
                    onClick={() => handleItemQtyChange(idx, item.qty + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-95 transition-all"
                  >
                    +
                  </button>
                  <span className="text-base font-medium text-gray-900 dark:text-white w-20 text-right tabular-nums">
                    {formatCurrency(item.priceCents * item.qty)}
                  </span>
                </div>
              </div>
            ))}

            {editedItems.length === 0 && (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('noItems')}
                </p>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="space-y-4 pt-2">
            {/* New Total */}
            <div className="flex justify-between items-center p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-900/20">
              <span className="font-medium text-primary-900 dark:text-primary-100">{t('newTotal')}</span>
              <span className="font-bold text-2xl text-primary-700 dark:text-primary-300">
                {formatCurrency(editedTotal)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="default"
                onClick={() => setEditDialogOpen(false)}
                disabled={saving}
                className="px-6"
              >
                {t('cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveEdit}
                disabled={saving || editedItems.length === 0}
                className="px-6 shadow-lg shadow-primary-500/20"
              >
                {saving ? t('saving') : t('saveChanges')}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
