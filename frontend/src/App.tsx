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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              🏨 Hotel Menu Manager
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your restaurant's food menu
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Food Item
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
