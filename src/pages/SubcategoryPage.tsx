import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useToast, Toast } from '../components/common/Toast';
import { formatRelativeDate } from '../utils/prompts';
import { generatePrompt, getRecentEntriesForContext } from '../utils/prompts';
import { copyToClipboard } from '../utils/clipboard';

export function SubcategoryPage() {
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const navigate = useNavigate();
  const { getSubcategoryById, getEntriesBySubcategory } = useApp();
  const { toast, showToast, hideToast } = useToast();

  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [promptType, setPromptType] = useState<'evaluation' | 'planning' | 'synthesis'>('evaluation');
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const subcategory = subcategoryId ? getSubcategoryById(subcategoryId) : undefined;
  const entries = subcategoryId ? getEntriesBySubcategory(subcategoryId) : [];

  if (!subcategory) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Subcategory not found</p>
        </div>
      </Layout>
    );
  }

  const openPromptModal = (type: 'evaluation' | 'planning' | 'synthesis') => {
    setPromptType(type);
    const recent = getRecentEntriesForContext(entries, subcategory.id, 3);
    setSelectedEntries(recent.map((e) => e.id));

    // Generate initial prompt
    const template = subcategory.promptTemplates[type];
    const entriesToUse = entries.filter((e) => recent.map((r) => r.id).includes(e.id));
    const prompt = generatePrompt(template, entriesToUse, true, recent.map((e) => e.id));
    setGeneratedPrompt(prompt);

    setPromptModalOpen(true);
  };

  // Regenerate prompt when selected entries change
  const handleEntriesChange = (entryId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedEntries, entryId]
      : selectedEntries.filter((id) => id !== entryId);

    setSelectedEntries(newSelected);

    // Regenerate prompt with new selection
    const template = subcategory.promptTemplates[promptType];
    const entriesToUse = entries.filter((e) => newSelected.includes(e.id));
    const prompt = generatePrompt(template, entriesToUse, true, newSelected);
    setGeneratedPrompt(prompt);
  };

  const handleCopyPrompt = () => {
    copyToClipboard(generatedPrompt).then((success) => {
      if (success) {
        showToast('Prompt copied to clipboard!', 'success');
        setPromptModalOpen(false);
      } else {
        showToast('Failed to copy prompt', 'error');
      }
    });
  };

  return (
    <Layout showBottomNav={!promptModalOpen}>
      <div className="px-6 py-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{subcategory.name}</h2>
          <p className="text-gray-600 mt-1">{entries.length} entries</p>
        </div>

        {/* Prompt Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => openPromptModal('evaluation')}
            fullWidth
          >
            Evaluate
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => openPromptModal('planning')}
            fullWidth
          >
            Plan
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => openPromptModal('synthesis')}
            fullWidth
          >
            Synthesize
          </Button>
        </div>

        {/* Entries */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Entries</h3>
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate(`/entry/new?subcategoryId=${subcategory.id}`)}
            >
              New
            </Button>
          </div>

          <div className="space-y-3">
            {entries.map((entry) => (
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

          {entries.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No entries yet. Tap + to create one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Modal */}
      <Modal
        isOpen={promptModalOpen}
        onClose={() => setPromptModalOpen(false)}
        title={`${promptType.charAt(0).toUpperCase() + promptType.slice(1)} Prompt`}
        size="lg"
      >
        <div className="p-6 space-y-4">
          {/* Prompt Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt Preview (you can edit this before copying)
            </label>
            <textarea
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent text-sm font-mono"
              rows={12}
              placeholder="Your prompt will appear here..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {generatedPrompt.length} characters
            </p>
          </div>

          {/* Context Entries Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Context Entries ({selectedEntries.length} selected)
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {entries.slice(0, 10).map((entry) => (
                <label key={entry.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedEntries.includes(entry.id)}
                    onChange={(e) => handleEntriesChange(entry.id, e.target.checked)}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-gray-700 line-clamp-1">{entry.title}</span>
                </label>
              ))}
              {entries.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No entries available for context
                </p>
              )}
            </div>
          </div>

          <Button variant="primary" onClick={handleCopyPrompt} fullWidth>
            Copy to Clipboard
          </Button>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      )}
    </Layout>
  );
}
