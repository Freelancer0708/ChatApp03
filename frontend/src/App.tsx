import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const isAuthenticated = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} /> {/* 変更 */}
      </Routes>
    </Router>
  );
}

export default App;
