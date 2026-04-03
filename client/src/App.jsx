import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import DietPlanner from './components/DietPlanner';
import ParticalBG from './components/ParticalBG';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import HistoryPage from './pages/HistoryPage';

function HomePage() {
  // Disable hover effects on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add('no-hover');
  }

  return (
    <div>
      <ParticalBG />
      <DietPlanner />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/history/:id" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;