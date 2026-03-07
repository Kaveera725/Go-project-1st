import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import FoodList from './components/FoodList';
import FoodFormModal from './components/FoodFormModal';
import OrderCart from './components/OrderCart';
import MyOrders from './components/MyOrders';
import AdminOrders from './components/AdminOrders';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header - Natural, practical design */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container-app py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Hotel Menu Manager
                </h1>
                <p className="text-xs text-gray-500">
                  {isAdmin ? 'Admin Dashboard' : 'Customer Portal'}
                </p>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* User info */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
                <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>

              {/* Admin: Add New Dish button */}
              {isAdmin && activeTab === 'menu' && (
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </button>
              )}

              {/* Logout */}
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-gray-700 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Tab navigation - More natural design */}
          {(isCustomer || isAdmin) && (
            <div className="flex gap-1 mt-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'menu'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {isAdmin ? 'Customer Orders' : 'My Orders'}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - Natural spacing */}
      <main className={`container-app py-6 ${isCustomer && cart.length > 0 ? 'pb-72' : ''}`}>
        {activeTab === 'menu' ? (
          <FoodList
            key={refreshKey}
            onEdit={handleEdit}
            onDeleted={handleDeleted}
            onDeleteError={handleDeleteError}
            isAdmin={isAdmin}
            onAddToCart={handleAddToCart}
          />
        ) : isAdmin ? (
          <AdminOrders />
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
