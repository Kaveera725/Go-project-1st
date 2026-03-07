import { useEffect, useState } from 'react';
import { Order } from '../types/order';
import { getAllOrders, updateOrderStatus } from '../services/orderService';

interface AdminOrdersProps {
  onStatusUpdate?: () => void;
}

export default function AdminOrders({ onStatusUpdate }: AdminOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 10 seconds to show new orders
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data ?? []);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state immediately
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      onStatusUpdate?.();
    } catch {
      // fail silently
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800">
            ⏳ Pending
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-100 text-blue-800">
            👨‍🍳 Preparing
          </span>
        );
      case 'complete':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-green-100 text-green-800">
            ✅ Complete
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500" />
        <p className="mt-3 text-gray-600 text-sm">Loading orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-12 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-xl font-bold gradient-text mb-1">No orders yet</h3>
        <p className="text-gray-600 text-sm">Customer orders will appear here in real-time.</p>
      </div>
    );
  }

  // Group orders by status for better organization
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const completeOrders = orders.filter((o) => o.status === 'complete');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gradient-text flex items-center gap-2">
          <span>📋</span> Customer Orders
        </h2>
        <div className="flex gap-2 text-xs">
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            {pendingOrders.length} Pending
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {preparingOrders.length} Preparing
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {completeOrders.length} Complete
          </span>
        </div>
      </div>

      {/* Pending Orders - Need attention */}
      {pendingOrders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-yellow-700 flex items-center gap-2">
            ⏳ New Orders (Pending)
          </h3>
          {pendingOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
              getStatusBadge={getStatusBadge}
              updatingId={updatingId}
            />
          ))}
        </div>
      )}

      {/* Preparing Orders */}
      {preparingOrders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-700 flex items-center gap-2">
            👨‍🍳 Being Prepared
          </h3>
          {preparingOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
              getStatusBadge={getStatusBadge}
              updatingId={updatingId}
            />
          ))}
        </div>
      )}

      {/* Complete Orders */}
      {completeOrders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-green-700 flex items-center gap-2">
            ✅ Completed Orders
          </h3>
          {completeOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
              getStatusBadge={getStatusBadge}
              updatingId={updatingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Separate OrderCard component for cleaner code
interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: string) => void;
  getStatusBadge: (status: string) => JSX.Element;
  updatingId: string | null;
}

function OrderCard({ order, onStatusUpdate, getStatusBadge, updatingId }: OrderCardProps) {
  const isUpdating = updatingId === order.id;

  return (
    <div className="glass-effect rounded-2xl overflow-hidden card-hover border-l-4 border-l-orange-400">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-3 border-b border-orange-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">👤</span>
            <div>
              <p className="font-semibold text-gray-800">{order.username || 'Customer'}</p>
              <p className="text-xs text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            <span className="font-bold text-orange-600">
              Rs. {Number(order.total_amount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Order Items */}
        <div className="space-y-2 mb-4">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-gray-100 last:border-0">
              <span className="text-gray-700">
                {item.food_name} <span className="text-gray-400">×{item.quantity}</span>
              </span>
              <span className="font-semibold text-gray-800">
                Rs. {(Number(item.price) * item.quantity).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>

        {/* Status Update Buttons */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          {order.status === 'pending' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'preparing')}
              disabled={isUpdating}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
            >
              {isUpdating ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>👨‍🍳 Start Preparing</>
              )}
            </button>
          )}
          {order.status === 'preparing' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'complete')}
              disabled={isUpdating}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
            >
              {isUpdating ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>✅ Mark Complete</>
              )}
            </button>
          )}
          {order.status === 'complete' && (
            <span className="flex-1 text-center text-green-600 font-semibold text-sm py-2">
              ✅ Order Served
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
