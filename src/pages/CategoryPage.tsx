import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { formatRelativeDate } from '../utils/prompts';
import { generatePromptsForSubcategory } from '../utils/promptGenerator';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const {
    getCategoryById,
    state,
    addSubcategory,
    updateCategory,
    deleteCategory,
    updateSubcategory,
    deleteSubcategory
  } = useApp();

  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [subcategoryName, setSubcategoryName] = useState('');
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);

  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryIcon, setEditCategoryIcon] = useState('');

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const category = categoryId ? getCategoryById(categoryId) : undefined;

  // Get category-level entries (where categoryId matches and subcategoryId is null)
  const categoryEntries = state.entries
    .filter((entry) => entry.categoryId === categoryId && entry.subcategoryId === null)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleAddSubcategory = () => {
    if (!subcategoryName.trim() || !category || !categoryId) return;

    if (editingSubcategoryId) {
      // Update existing subcategory
      updateSubcategory(editingSubcategoryId, {
        name: subcategoryName.trim(),
      });
      setEditingSubcategoryId(null);
    } else {
      // Add new subcategory
      const prompts = generatePromptsForSubcategory(category.name, subcategoryName.trim());
      addSubcategory(categoryId, {
        name: subcategoryName.trim(),
        promptTemplates: prompts,
      } as any);
    }

    setSubcategoryName('');
    setShowSubcategoryModal(false);
  };

  const handleEditCategory = () => {
    if (!category) return;
    setEditCategoryName(category.name);
    setEditCategoryIcon(category.icon);
    setShowEditCategoryModal(true);
    setShowCategoryMenu(false);
  };

  const handleSaveCategory = () => {
    if (!editCategoryName.trim() || !categoryId) return;
    updateCategory(categoryId, {
      name: editCategoryName.trim(),
      icon: editCategoryIcon,
    });
    setShowEditCategoryModal(false);
  };

  const handleDeleteCategory = () => {
    if (!categoryId) return;
    if (confirm('Are you sure you want to delete this category? All subcategories and entries will be deleted.')) {
      deleteCategory(categoryId);
      navigate('/home');
    }
    setShowCategoryMenu(false);
  };

  const handleEditSubcategory = (subcategoryId: string, currentName: string) => {
    setEditingSubcategoryId(subcategoryId);
    setSubcategoryName(currentName);
    setShowSubcategoryModal(true);
  };

  const handleDeleteSubcategory = (subcategoryId: string) => {
    if (confirm('Are you sure you want to delete this subcategory? All entries in it will be deleted.')) {
      deleteSubcategory(subcategoryId);
    }
  };

  if (!category) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Category not found</p>
        </div>
      </Layout>
    );
  }

  const commonIconEmojis = ['📁', '💼', '🎯', '🏃', '💰', '📚', '🎨', '🏠', '✈️', '🎵', '💻', '🌱', '❤️', '✨'];

  // Use emoji directly - fallback to 📁 if no icon set
  const emoji = category.icon || '📁';

  return (
    <Layout>
      <div className="px-6 py-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>{emoji}</span>
              {category.name}
            </h2>
            <p className="text-gray-600 mt-1">
              {category.subcategories.length} subcategories · {categoryEntries.length} category notes
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            {showCategoryMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={handleEditCategory}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Category
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Category
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Subcategories */}
        <div>
          <div className="flex items-center justify-end mb-4">
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowSubcategoryModal(true)}
            >
              New Subcategory
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="relative group p-4 bg-white border border-gray-200 rounded-lg hover:border-accent transition-all duration-200"
              >
                <div
                  onClick={() => navigate(`/subcategory/${subcategory.id}`)}
                  className="cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-900">{subcategory.name}</h3>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSubcategory(subcategory.id, subcategory.name);
                    }}
                    className="p-1.5 rounded-md bg-white hover:bg-gray-100 border border-gray-200 transition-colors"
                    title="Edit subcategory"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubcategory(subcategory.id);
                    }}
                    className="p-1.5 rounded-md bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-colors"
                    title="Delete subcategory"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {category.subcategories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No subcategories yet. Click "New Subcategory" to add one.</p>
            </div>
          )}
        </div>

        {/* Category-level Notes */}
        <div>
          <div className="flex items-center justify-end mb-4">
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate(`/entry/new?categoryId=${category.id}`)}
            >
              New Note
            </Button>
          </div>
          {categoryEntries.length > 0 ? (
            <div className="space-y-3">
              {categoryEntries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => navigate(`/entry/${entry.id}`)}
                  className="w-full flex flex-col items-start gap-2 p-4 bg-white border border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left"
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <h4 className="font-semibold text-gray-900 line-clamp-1">{entry.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      entry.label === 'note' ? 'bg-gray-100 text-gray-700' :
                      entry.label === 'synthesis' ? 'bg-blue-100 text-blue-700' :
                      entry.label === 'plan' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {entry.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{entry.content}</p>
                  <span className="text-xs text-gray-500">{formatRelativeDate(entry.updatedAt)}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No category notes yet. Click "New Note" to add one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Subcategory Modal */}
      <Modal
        isOpen={showSubcategoryModal}
        onClose={() => {
          setShowSubcategoryModal(false);
          setSubcategoryName('');
          setEditingSubcategoryId(null);
        }}
        title={editingSubcategoryId ? 'Edit Subcategory' : 'New Subcategory'}
        size="md"
      >
        <div className="p-6 space-y-4">
          <Input
            label="Subcategory Name"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            placeholder="e.g., Branding, User Research, Prototyping..."
            fullWidth
            autoFocus
          />
          {!editingSubcategoryId && (
            <p className="text-xs text-gray-500">
              Smart prompts will be generated automatically based on "{category.name}" and your subcategory name.
            </p>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowSubcategoryModal(false);
                setSubcategoryName('');
                setEditingSubcategoryId(null);
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddSubcategory}
              disabled={!subcategoryName.trim()}
              fullWidth
            >
              {editingSubcategoryId ? 'Save' : 'Create Subcategory'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditCategoryModal}
        onClose={() => setShowEditCategoryModal(false)}
        title="Edit Category"
        size="md"
      >
        <div className="p-6 space-y-4">
          <Input
            label="Category Name"
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
            placeholder="Category name..."
            fullWidth
            autoFocus
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="flex gap-2 flex-wrap">
              {commonIconEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setEditCategoryIcon(emoji)}
                  className={`w-12 h-12 rounded-lg text-2xl transition-all ${
                    editCategoryIcon === emoji
                      ? 'bg-accent/10 ring-2 ring-accent'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowEditCategoryModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveCategory}
              disabled={!editCategoryName.trim()}
              fullWidth
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
