import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader/AppHeader';
import HomePage from './pages/HomePage/HomePage';
import EditorPage from './pages/EditorPage/EditorPage';
import CompareGenerator from './components/CompareGenerator/CompareGenerator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-opera-cream">
        <AppHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/compare" element={<CompareGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
