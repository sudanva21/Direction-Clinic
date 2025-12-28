import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth.tsx';
import LoginPage from './pages/LoginPage';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const { user, loading } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />;
  }

  // Inject setShowProfile into some global state or pass it down?
  // For now, let's use a simpler approach or a context if needed.
  // Actually, I can use a custom event or just a simple prop-drilling for this demo ifHeader is used in dashboards.
  // But Header is used INSIDE dashboards. So I need a way to trigger showProfile from Header.

  return user.role === 'doctor' ?
    <DoctorDashboard onNavigateProfile={() => setShowProfile(true)} /> :
    <ReceptionistDashboard onNavigateProfile={() => setShowProfile(true)} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
