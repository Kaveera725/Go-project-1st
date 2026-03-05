import { CartItem } from '../types/order';

interface OrderCartProps {
  cart: CartItem[];
  onUpdateQuantity: (foodId: string, quantity: number) => void;
  onRemove: (foodId: string) => void;
  onConfirmOrder: () => void;
  loading: boolean;
}

export default function OrderCart({
  cart,
  onUpdateQuantity,
  onRemove,
  onConfirmOrder,
  loading,
}: OrderCartProps) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="glass-effect rounded-2xl shadow-2xl border border-orange-200 overflow-hidden">
          {/* Cart header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 flex items-center justify-between">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span>🛒</span> Your Order ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>
            <span className="text-white font-bold text-lg">
              Rs. {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Cart items */}
          <div className="p-4 max-h-60 overflow-y-auto">
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.food_id}
                  className="flex items-center justify-between bg-orange-50/50 rounded-xl px-4 py-3"
                >
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800 text-sm">
                      {item.food_name}
                    </span>
                    <span className="text-gray-500 text-xs ml-2">
                      Rs. {Number(item.price).toLocaleString('en-LK', { minimumFractionDigits: 2 })} each
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? onUpdateQuantity(item.food_id, item.quantity - 1)
                            : onRemove(item.food_id)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all text-xs font-bold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.food_id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Item total */}
                    <span className="text-sm font-bold text-gray-800 w-24 text-right">
                      Rs. {(item.price * item.quantity).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => onRemove(item.food_id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm button */}
          <div className="px-4 pb-4">
            <button
              onClick={onConfirmOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Placing Order...
                </>
              ) : (
                <>
                  ✅ Confirm Order — Rs. {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
