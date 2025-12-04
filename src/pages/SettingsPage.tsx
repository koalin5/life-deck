import { Layout } from '../components/layout/Layout';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/common/Button';

export function SettingsPage() {
  const { state, updateSettings, clearAllData } = useApp();

  const handleClearData = () => {
    if (confirm('Are you sure you want to reset the app? This will restore default folders and delete all your entries. This cannot be undone.')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <Layout>
      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-1">Manage your Life Deck preferences</p>
        </div>

        {/* View Mode */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">View Mode</h3>
            <p className="text-sm text-gray-600 mt-1">Choose how categories are displayed</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => updateSettings({ viewMode: 'grid' })}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                state.settings.viewMode === 'grid'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => updateSettings({ viewMode: 'list' })}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                state.settings.viewMode === 'list'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
            <p className="text-sm text-gray-600 mt-1">Reset the app to its default state</p>
          </div>
          <Button
            variant="danger"
            onClick={handleClearData}
            fullWidth
          >
            Reset App
          </Button>
        </div>

        {/* Stats */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{state.categories.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Entries</p>
              <p className="text-2xl font-bold text-gray-900">{state.entries.length}</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>Life Deck v0.1.0</p>
          <p className="mt-1">Personal knowledge and prompt orchestration hub</p>
        </div>
      </div>
    </Layout>
  );
}
