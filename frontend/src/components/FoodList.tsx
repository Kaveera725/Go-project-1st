import { useEffect, useState } from 'react';
import { deleteFood, getAllFoods } from '../services/foodService';
import { Food } from '../types/food';
import DeleteConfirmModal from './DeleteConfirmModal';

interface FoodListProps {
  onEdit: (food: Food) => void;
  onDeleted: () => void;
  onDeleteError: () => void;
}

const categoryColors: Record<string, string> = {
  Breakfast: 'bg-amber-100 text-amber-800',
  Lunch: 'bg-green-100 text-green-800',
  Dinner: 'bg-purple-100 text-purple-800',
  Drinks: 'bg-blue-100 text-blue-800',
};

export default function FoodList({ onEdit, onDeleted, onDeleteError }: FoodListProps) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Food | null>(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const data = await getAllFoods();
      setFoods(data ?? []);
      setError('');
    } catch {
      setError('Failed to load menu items. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFood(deleteTarget.id);
      setFoods((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
      onDeleted();
    } catch {
      setDeleteTarget(null);
      onDeleteError();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200" />
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 absolute top-0" />
        </div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading delicious items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-effect border border-red-200 rounded-2xl p-8 text-center card-hover">
        <div className="text-5xl mb-4">😢</div>
        <p className="text-red-700 font-medium text-lg">{error}</p>
        <button 
          onClick={fetchFoods} 
          className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-16 text-center card-hover">
        <div className="text-7xl mb-6 animate-bounce">🍽️</div>
        <h3 className="text-2xl font-bold gradient-text mb-2">No dishes yet</h3>
        <p className="text-gray-600">Start building your menu by adding your first delicious dish!</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-effect rounded-2xl overflow-hidden card-hover">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                <th className="text-left py-4 px-6 font-bold text-orange-800 uppercase tracking-wider text-xs">
                  🍴 Dish Name
                </th>
                <th className="text-left py-4 px-6 font-bold text-orange-800 uppercase tracking-wider text-xs">
                  📂 Category
                </th>
                <th className="text-left py-4 px-6 font-bold text-orange-800 uppercase tracking-wider text-xs">
                  💰 Price
                </th>
                <th className="text-left py-4 px-6 font-bold text-orange-800 uppercase tracking-wider text-xs">
                  Status
                </th>
                <th className="text-right py-3.5 px-6 font-semibold text-gray-600 uppercase tracking-wider text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {foods.map((food, index) => (
                <tr key={food.id} className="hover:bg-orange-50/50 transition-all duration-200 group" style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="py-5 px-6 font-semibold text-gray-800 group-hover:text-orange-700 transition-colors">
                    {food.name}
                  </td>
                  <td className="py-5 px-6">
                    <span
                      className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                        categoryColors[food.category] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {food.category}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-gray-800 font-bold text-lg">
                    Rs. {Number(food.price).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-5 px-6">
                    {food.available ? (
                      <span className="inline-flex items-center gap-2 text-green-700 text-xs font-semibold bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-red-700 text-xs font-semibold bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
                        <span className="w-2 h-2 bg-red-400 rounded-full" />
                        Sold Out
                      </span>
                    )}
                  </td>
                  <td className="py-5 px-6 text-right space-x-2">
                    <button
                      onClick={() => onEdit(food)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(food)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-all shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with count */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 font-semibold">
              📊 Total Menu Items: <span className="text-orange-600">{foods.length}</span>
            </span>
            <span className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          foodName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
