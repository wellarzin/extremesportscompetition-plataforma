import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ToastProvider } from '@/components/ui/Toast';
import { Landing } from '@/pages/Landing';
import { Dashboard } from '@/pages/app/Dashboard';
import { Events } from '@/pages/app/Events';
import { EventDetail } from '@/pages/app/EventDetail';
import { LogActivity } from '@/pages/app/LogActivity';
import { Profile } from '@/pages/app/Profile';
import { Achievements } from '@/pages/app/Achievements';
import { Scoring } from '@/pages/app/Scoring';
import { BodyScan } from '@/pages/app/BodyScan';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminEvents } from '@/pages/admin/AdminEvents';
import { AdminAthletes } from '@/pages/admin/AdminAthletes';
import { AdminScoring } from '@/pages/admin/AdminScoring';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />

        {/* App routes with sidebar layout */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="activity/log" element={<LogActivity />} />
          <Route path="profile" element={<Profile />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="scoring" element={<Scoring />} />
          <Route path="body-scan" element={<BodyScan />} />
        </Route>

        {/* Admin routes with sidebar layout */}
        <Route path="/admin" element={<AppLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="athletes" element={<AdminAthletes />} />
          <Route path="scoring" element={<AdminScoring />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastProvider />
    </BrowserRouter>
  );
}
