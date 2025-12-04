import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { useApp } from '../../contexts/AppContext';
import type { EntryLabel } from '../../types';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CaptureMode = 'note' | 'category';

export function QuickCaptureModal({ isOpen, onClose }: QuickCaptureModalProps) {
  const { state, addEntry, addCategory } = useApp();
  const [mode, setMode] = useState<CaptureMode>('note');

  // Note fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [label, setLabel] = useState<EntryLabel>('note');

  // Category fields
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('📁');

  const selectedCategory = state.categories.find((c) => c.id === selectedCategoryId);

  const handleSaveNote = () => {
    if (!title.trim() || !content.trim()) return;

    addEntry({
      title: title.trim(),
      content: content.trim(),
      categoryId: selectedCategoryId || null,
      subcategoryId: selectedSubcategoryId || null,
      label,
    });

    resetForm();
    onClose();
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;

    addCategory({
      name: categoryName.trim(),
      icon: categoryIcon,
      subcategories: [], // No default subcategories - user will add them
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    // Reset note fields
    setTitle('');
    setContent('');
    setSelectedCategoryId('');
    setSelectedSubcategoryId('');
    setLabel('note');

    // Reset category fields
    setCategoryName('');
    setCategoryIcon('📁');

    // Reset mode
    setMode('note');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const commonIconEmojis = ['📁', '💼', '🎯', '🏃', '💰', '📚', '🎨', '🏠', '✈️', '🎵', '💻', '🌱', '❤️', '✨'];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Quick Capture" size="lg">
      <div className="p-6 space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setMode('note')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'note'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Quick Note
          </button>
          <button
            onClick={() => setMode('category')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'category'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            New Category
          </button>
        </div>

        {/* Note Form */}
        {mode === 'note' && (
          <>
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title..."
              fullWidth
              autoFocus
            />

            <Textarea
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
              rows={6}
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedSubcategoryId('');
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Select category...</option>
                {state.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={selectedSubcategoryId}
                  onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select subcategory...</option>
                  {selectedCategory.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label
              </label>
              <div className="flex gap-2 flex-wrap">
                {(['note', 'synthesis', 'plan', 'assessment'] as EntryLabel[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLabel(l)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      label === l
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={handleClose} fullWidth>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveNote}
                disabled={!title.trim() || !content.trim()}
                fullWidth
              >
                Save Note
              </Button>
            </div>
          </>
        )}

        {/* Category Form */}
        {mode === 'category' && (
          <>
            <Input
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Design, Travel, Cooking..."
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
                    onClick={() => setCategoryIcon(emoji)}
                    className={`w-12 h-12 rounded-lg text-2xl transition-all ${
                      categoryIcon === emoji
                        ? 'bg-accent/10 ring-2 ring-accent'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                You can add subcategories later, or use the category directly for notes.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={handleClose} fullWidth>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveCategory}
                disabled={!categoryName.trim()}
                fullWidth
              >
                Create Category
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
