import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import FoodList from './components/FoodList';
import FoodFormModal from './components/FoodFormModal';
import OrderCart from './components/OrderCart';
import MyOrders from './components/MyOrders';
import Toast from './components/Toast';
import { Food, FoodInput } from './types/food';
import { CartItem } from './types/order';
import { createFood, updateFood } from './services/foodService';
import { createOrder } from './services/orderService';

function App() {
  const { user, loading, logout, isAdmin, isCustomer } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');

  // Cart state (customer only)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500" />
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  const handleAdd = () => {
    setEditingFood(null);
    setShowModal(true);
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setShowModal(true);
  };

  const handleSubmit = async (data: FoodInput) => {
    try {
      if (editingFood) {
        await updateFood(editingFood.id, data);
        showToast('Food item updated successfully!', 'success');
      } else {
        await createFood(data);
        showToast('Food item added successfully!', 'success');
      }
      setShowModal(false);
      setEditingFood(null);
      setRefreshKey((k) => k + 1);
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  const handleDeleted = () => {
    showToast('Food item deleted successfully!', 'success');
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteError = () => {
    showToast('Failed to delete food item.', 'error');
  };

  // ── Cart functions (customer) ──
  const handleAddToCart = (food: Food) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.food_id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food_id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        { food_id: food.id, food_name: food.name, price: food.price, quantity: 1 },
      ];
    });
    showToast(`${food.name} added to cart!`, 'success');
  };

  const handleUpdateCartQuantity = (foodId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.food_id === foodId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (foodId: string) => {
    setCart((prev) => prev.filter((item) => item.food_id !== foodId));
  };

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;
    setOrderLoading(true);
    try {
      await createOrder({
        items: cart.map((item) => ({
          food_id: item.food_id,
          quantity: item.quantity,
        })),
      });
      setCart([]);
      showToast('Order placed successfully! 🎉', 'success');
    } catch {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative glass-effect border-b border-orange-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                <span className="text-3xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text tracking-tight">
                  Delicious Dining
                </h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                  <span>✨</span>
                  {isAdmin
                    ? 'Manage your restaurant menu'
                    : 'Browse & order your favorite dishes'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* User badge */}
              <div className="hidden sm:flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl">
                <span className="text-lg">{isAdmin ? '🔑' : '👤'}</span>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  <p className="text-xs text-orange-600 font-medium capitalize">{user.role}</p>
                </div>
              </div>

              {/* Admin: Add New Dish button */}
              {isAdmin && activeTab === 'menu' && (
                <button
                  onClick={handleAdd}
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Dish
                </button>
              )}

              {/* Logout */}
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all text-sm font-medium border border-gray-200 hover:border-red-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Tab navigation (customer) */}
          {isCustomer && (
            <div className="flex gap-1 mt-4 bg-orange-100/50 p-1 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'menu'
                    ? 'bg-white text-orange-700 shadow-sm'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                🍴 Menu
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-white text-orange-700 shadow-sm'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                📋 My Orders
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${isCustomer && cart.length > 0 ? 'pb-80' : ''}`}>
        {activeTab === 'menu' ? (
          <FoodList
            key={refreshKey}
            onEdit={handleEdit}
            onDeleted={handleDeleted}
            onDeleteError={handleDeleteError}
            isAdmin={isAdmin}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <MyOrders />
        )}
      </main>

      {/* Order Cart (customer only) */}
      {isCustomer && cart.length > 0 && activeTab === 'menu' && (
        <OrderCart
          cart={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemove={handleRemoveFromCart}
          onConfirmOrder={handleConfirmOrder}
          loading={orderLoading}
        />
      )}

      {/* Modal (admin only) */}
      {showModal && isAdmin && (
        <FoodFormModal
          food={editingFood}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false);
            setEditingFood(null);
          }}
        />
      )}

      {/* Toast notifications */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
