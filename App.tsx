import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './context/authStore'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardLayout from './components/shared/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import ClientsPage from './pages/ClientsPage'
import LeadsPage from './pages/LeadsPage'
import MeetingsPage from './pages/MeetingsPage'
import TasksPage from './pages/TasksPage'
import DocumentsPage from './pages/DocumentsPage'
import MessagesPage from './pages/MessagesPage'
import ForumPage from './pages/ForumPage'
import InvoicesPage from './pages/InvoicesPage'
import EmailPage from './pages/EmailPage'
import AutomationPage from './pages/AutomationPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import StudentsPage from './pages/StudentsPage'
import ProfilePage from './pages/ProfilePage'

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  const { user } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="clients" element={<ProtectedRoute roles={['admin','consultant']}><ClientsPage /></ProtectedRoute>} />
          <Route path="leads" element={<ProtectedRoute roles={['admin','consultant']}><LeadsPage /></ProtectedRoute>} />
          <Route path="meetings" element={<MeetingsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="students" element={<ProtectedRoute roles={['admin','consultant']}><StudentsPage /></ProtectedRoute>} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="invoices" element={<ProtectedRoute roles={['admin','consultant']}><InvoicesPage /></ProtectedRoute>} />
          <Route path="email" element={<ProtectedRoute roles={['admin','consultant']}><EmailPage /></ProtectedRoute>} />
          <Route path="automation" element={<ProtectedRoute roles={['admin','consultant']}><AutomationPage /></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute roles={['admin','consultant']}><AnalyticsPage /></ProtectedRoute>} />
          <Route path="admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
