import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProblemsPage from './pages/ProblemsPage';
import PatternsPage from './pages/PatternsPage';
import ResourcesPage from './pages/ResourcesPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import { SolvedProblemsProvider } from './contexts/SolvedProblemsContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SolvedProblemsProvider>
            <div className="min-h-screen bg-[var(--bg-primary)]">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/patterns" element={<PatternsPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<VerifyOTPPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </div>
          </SolvedProblemsProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
