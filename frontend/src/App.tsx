import { useState } from 'react';
import FoodList from './components/FoodList';
import FoodFormModal from './components/FoodFormModal';
import Toast from './components/Toast';
import { Food, FoodInput } from './types/food';
import { createFood, updateFood } from './services/foodService';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
                  Manage your restaurant's menu with ease
                </p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Dish
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FoodList
          key={refreshKey}
          onEdit={handleEdit}
          onDeleted={handleDeleted}
          onDeleteError={handleDeleteError}
        />
      </main>

      {/* Modal */}
      {showModal && (
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
