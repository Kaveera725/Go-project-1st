import { useEffect, useState } from 'react';
import { Order } from '../types/order';
import { getMyOrders } from '../services/orderService';

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data ?? []);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500" />
        <p className="mt-3 text-gray-600 text-sm">Loading your orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-12 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-xl font-bold gradient-text mb-1">No orders yet</h3>
        <p className="text-gray-600 text-sm">Your order history will appear here once you place an order.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold gradient-text flex items-center gap-2">
        <span>📋</span> My Orders
      </h2>

      {orders.map((order) => (
        <div key={order.id} className="glass-effect rounded-2xl overflow-hidden card-hover">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-3 border-b border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${
                order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : order.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {order.status === 'pending' ? '⏳' : '✅'} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </span>
            </div>
            <span className="font-bold text-orange-600">
              Rs. {Number(order.total_amount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-700">
                    {item.food_name} <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-gray-800">
                    Rs. {(Number(item.price) * item.quantity).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
