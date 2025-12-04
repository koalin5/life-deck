import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SearchBar } from '../components/common/SearchBar';
import { useApp } from '../contexts/AppContext';
import { formatRelativeDate } from '../utils/prompts';
import type { EntryLabel } from '../types';

export function SearchPage() {
  const navigate = useNavigate();
  const { searchEntries } = useApp();
  const [query, setQuery] = useState('');
  const [labelFilter, setLabelFilter] = useState<EntryLabel | undefined>();

  const results = searchEntries(query, labelFilter ? { label: labelFilter } : undefined);

  return (
    <Layout>
      <div className="px-6 py-6 space-y-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search entries..."
          autoFocus
        />

        {/* Label filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setLabelFilter(undefined)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !labelFilter
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {(['note', 'synthesis', 'plan', 'assessment'] as EntryLabel[]).map((l) => (
            <button
              key={l}
              onClick={() => setLabelFilter(l)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                labelFilter === l
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>

        {/* Results */}
        <div>
          <p className="text-sm text-gray-600 mb-4">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>

          <div className="space-y-3">
            {results.map((entry) => (
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

          {results.length === 0 && query && (
            <div className="text-center py-12 text-gray-500">
              <p>No entries found matching "{query}"</p>
            </div>
          )}

          {!query && (
            <div className="text-center py-12 text-gray-500">
              <p>Start typing to search your entries</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
