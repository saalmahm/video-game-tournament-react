import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TournamentsPage from './pages/TournamentsPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import TournamentDetailsPage from './pages/TournamentDetailsPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="py-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/tournaments/:id" element={<TournamentDetailsPage />} />
              
              {/* Protected Routes */}
              <Route
                path="/tournaments/create"
                element={
                  <PrivateRoute>
                    <CreateTournamentPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tournaments/:id/edit"
                element={
                  <PrivateRoute>
                    <CreateTournamentPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tournaments/:id/matches/create"
                element={
                  <PrivateRoute>
                    <h1>Create Match (To be implemented)</h1>
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
