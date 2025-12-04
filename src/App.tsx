import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './contexts/AppContext';
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { CategoryPage } from './pages/CategoryPage';
import { SubcategoryPage } from './pages/SubcategoryPage';
import { EntryPage } from './pages/EntryPage';
import { SearchPage } from './pages/SearchPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const { state } = useApp();
  const hasCompletedOnboarding = state.settings.hasCompletedOnboarding;

  return (
    <Routes>
      {/* Root route - shows onboarding or home */}
      <Route
        path="/"
        element={
          hasCompletedOnboarding ? (
            <Home />
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      />

      {/* Onboarding */}
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Main routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/subcategory/:subcategoryId" element={<SubcategoryPage />} />
      <Route path="/entry/new" element={<EntryPage />} />
      <Route path="/entry/:entryId" element={<EntryPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/settings" element={<SettingsPage />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
