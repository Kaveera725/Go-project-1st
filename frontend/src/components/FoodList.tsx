import { useEffect, useState } from 'react';
import { Food } from '../types/food';
import { getAllFoods, deleteFood } from '../services/foodService';
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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 font-medium">{error}</p>
        <button onClick={fetchFoods} className="mt-3 text-sm text-red-600 underline hover:text-red-800">
          Try again
        </button>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-5xl mb-4">🍽️</div>
        <h3 className="text-lg font-semibold text-gray-700">No menu items yet</h3>
        <p className="text-gray-500 mt-1">Click "Add Food Item" to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3.5 px-6 font-semibold text-gray-600 uppercase tracking-wider text-xs">
                  Name
                </th>
                <th className="text-left py-3.5 px-6 font-semibold text-gray-600 uppercase tracking-wider text-xs">
                  Category
                </th>
                <th className="text-left py-3.5 px-6 font-semibold text-gray-600 uppercase tracking-wider text-xs">
                  Price
                </th>
                <th className="text-left py-3.5 px-6 font-semibold text-gray-600 uppercase tracking-wider text-xs">
                  Status
                </th>
                <th className="text-right py-3.5 px-6 font-semibold text-gray-600 uppercase tracking-wider text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {foods.map((food) => (
                <tr key={food.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{food.name}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        categoryColors[food.category] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {food.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-700 font-mono">
                    ${Number(food.price).toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    {food.available ? (
                      <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                        <span className="w-2 h-2 bg-red-400 rounded-full" />
                        Unavailable
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => onEdit(food)}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(food)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-900 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-xs text-gray-500">
          {foods.length} item{foods.length !== 1 ? 's' : ''} in menu
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
