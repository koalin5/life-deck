import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { useApp } from '../contexts/AppContext';
import { Input, Textarea } from '../components/common/Input';
import { Button } from '../components/common/Button';
import type { EntryLabel } from '../types';

export function EntryPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getEntryById, addEntry, updateEntry, deleteEntry } = useApp();

  const isNew = entryId === 'new';
  const subcategoryIdFromQuery = searchParams.get('subcategoryId');
  const categoryIdFromQuery = searchParams.get('categoryId');
  const existingEntry = !isNew && entryId ? getEntryById(entryId) : undefined;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [label, setLabel] = useState<EntryLabel>('note');

  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title);
      setContent(existingEntry.content);
      setLabel(existingEntry.label);
    }
  }, [existingEntry]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    if (isNew) {
      addEntry({
        title: title.trim(),
        content: content.trim(),
        categoryId: categoryIdFromQuery || null,
        subcategoryId: subcategoryIdFromQuery || null,
        label,
      });
    } else if (entryId) {
      updateEntry(entryId, {
        title: title.trim(),
        content: content.trim(),
        label,
      });
    }

    navigate(-1);
  };

  const handleDelete = () => {
    if (!entryId || isNew) return;
    if (confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(entryId);
      navigate(-1);
    }
  };

  return (
    <Layout showBottomNav={false}>
      <div className="px-6 py-6 space-y-4 max-w-3xl mx-auto">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title..."
          className="text-2xl font-bold"
          fullWidth
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label
          </label>
          <div className="flex gap-2 flex-wrap">
            {(['note', 'synthesis', 'plan', 'assessment'] as EntryLabel[]).map((l) => (
              <button
                key={l}
                onClick={() => setLabel(l)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content..."
          rows={20}
          fullWidth
        />

        <div className="flex gap-3 pt-4">
          {!isNew && (
            <Button
              variant="danger"
              onClick={handleDelete}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    </Layout>
  );
}
