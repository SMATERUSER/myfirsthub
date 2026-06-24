import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResumeBuilder from './components/ResumeBuilder';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/builder" element={<ResumeBuilder />} />
    </Routes>
  );
}

export default App
