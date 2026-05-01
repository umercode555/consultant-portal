import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'
import {
  LayoutDashboard, Users, TrendingUp, Calendar, CheckSquare,
  FileText, MessageSquare, BookOpen, Receipt, Mail,
  Zap, BarChart3, Shield, GraduationCap, User, LogOut,
  Bell, Sun, Moon, Menu, X, ChevronRight
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../../utils/api'

const navItems = {
  admin: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/clients', label: 'Clients', icon: Users },
    { path: '/dashboard/leads', label: 'Pipeline', icon: TrendingUp },
    { path: '/dashboard/students', label: 'Students', icon: GraduationCap },
    { path: '/dashboard/meetings', label: 'Meetings', icon: Calendar },
    { path: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/dashboard/documents', label: 'Documents', icon: FileText },
    { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { path: '/dashboard/forum', label: 'Community', icon: BookOpen },
    { path: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
    { path: '/dashboard/email', label: 'Email & Campaigns', icon: Mail },
    { path: '/dashboard/automation', label: 'Automation', icon: Zap },
    { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/dashboard/admin/users', label: 'Manage Users', icon: Shield },
  ],
  consultant: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/clients', label: 'Clients', icon: Users },
    { path: '/dashboard/leads', label: 'Pipeline', icon: TrendingUp },
    { path: '/dashboard/students', label: 'Students', icon: GraduationCap },
    { path: '/dashboard/meetings', label: 'Meetings', icon: Calendar },
    { path: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/dashboard/documents', label: 'Documents', icon: FileText },
    { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { path: '/dashboard/forum', label: 'Community', icon: BookOpen },
    { path: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
    { path: '/dashboard/email', label: 'Email & Campaigns', icon: Mail },
    { path: '/dashboard/automation', label: 'Automation', icon: Zap },
    { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  ],
  student: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/documents', label: 'My Documents', icon: FileText },
    { path: '/dashboard/meetings', label: 'Meetings', icon: Calendar },
    { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { path: '/dashboard/forum', label: 'Community', icon: BookOpen },
  ]
}

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then(r => r.data),
    refetchInterval: 30000
  })

  const unreadCount = notifications?.filter((n: { is_read: boolean }) => !n.is_read).length || 0
  const items = navItems[user?.role || 'student']

  const toggleDark = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? 'w-72' : sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-200`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-gray-700/50">
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-display font-bold text-sm">C</span>
        </div>
        {(sidebarOpen || mobile) && (
          <span className="font-display font-bold text-lg text-gray-900 dark:text-white">ConsultHub</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.path
          return (
            <button key={item.path} onClick={() => { navigate(item.path); setMobileSidebar(false) }}
              className={`sidebar-item w-full ${active ? 'active' : ''} ${!sidebarOpen && !mobile ? 'justify-center px-0' : ''}`}
              title={!sidebarOpen && !mobile ? item.label : undefined}>
              <Icon size={18} className="flex-shrink-0" />
              {(sidebarOpen || mobile) && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700/50">
        <button onClick={() => navigate('/dashboard/profile')}
          className={`sidebar-item w-full ${!sidebarOpen && !mobile ? 'justify-center px-0' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          {(sidebarOpen || mobile) && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          )}
        </button>
        <button onClick={handleLogout}
          className={`sidebar-item w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mt-1 ${!sidebarOpen && !mobile ? 'justify-center px-0' : ''}`}>
          <LogOut size={18} className="flex-shrink-0" />
          {(sidebarOpen || mobile) && <span>Sign out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col bg-white dark:bg-surface-900 border-r border-gray-100 dark:border-gray-700/50 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebar(false)} />
          <aside className="relative bg-white dark:bg-surface-900 flex flex-col">
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-surface-900 border-b border-gray-100 dark:border-gray-700/50 px-4 py-3 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn-ghost hidden lg:flex">
            <ChevronRight size={18} className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={() => setMobileSidebar(true)} className="btn-ghost lg:hidden">
            <Menu size={18} />
          </button>

          <div className="flex-1" />

          <button onClick={toggleDark} className="btn-ghost">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="btn-ghost relative">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
