import { useState } from 'react'
import { useAuthStore } from '../context/authStore'
import { User, Mail, Phone, Building, Camera, Save, Lock, Bell, Palette } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [tab, setTab] = useState<'profile' | 'security' | 'notifications'>('profile')
  const [form, setForm] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    email: user?.email || '', phone: user?.phone || '', department: user?.department || '',
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [notifications, setNotifications] = useState({
    emailNewLead: true, emailMeeting: true, emailTask: false,
    inAppAll: true, inAppMessages: true, inAppReminders: true,
  })

  const handleSave = () => {
    if (user) setUser({ ...user, firstName: form.firstName, lastName: form.lastName, phone: form.phone })
    toast.success('Profile updated')
  }

  const handlePassword = () => {
    if (!passwords.current) { toast.error('Enter current password'); return }
    if (passwords.newPass !== passwords.confirm) { toast.error('Passwords do not match'); return }
    if (passwords.newPass.length < 6) { toast.error('Min 6 characters'); return }
    setPasswords({ current: '', newPass: '', confirm: '' })
    toast.success('Password updated')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account</p>
      </div>

      {/* Avatar Card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
            <Camera size={13} />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</h2>
          <p className="text-sm text-gray-500 capitalize mt-0.5">{user?.role}</p>
          <span className="inline-block mt-2 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-medium">Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-surface-800 p-1 rounded-xl w-fit">
        {(['profile', 'security', 'notifications'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white dark:bg-surface-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><User size={16} /> Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">First Name</label><input className="input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} /></div>
            <div><label className="label">Last Name</label><input className="input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} /></div>
            <div className="col-span-2">
              <label className="label">Email</label>
              <div className="relative"><Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input className="input pl-9 opacity-60 cursor-not-allowed" value={form.email} readOnly /></div>
            </div>
            <div>
              <label className="label">Phone</label>
              <div className="relative"><Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input className="input pl-9" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555-0000" /></div>
            </div>
            <div>
              <label className="label">Department</label>
              <div className="relative"><Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input className="input pl-9" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Sales" /></div>
            </div>
          </div>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2 mt-2"><Save size={15} /> Save Changes</button>
        </div>
      )}

      {tab === 'security' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Lock size={16} /> Change Password</h3>
          <div className="space-y-3">
            <div><label className="label">Current Password</label><input className="input" type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} /></div>
            <div><label className="label">New Password</label><input className="input" type="password" value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} /></div>
            <div><label className="label">Confirm New Password</label><input className="input" type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} /></div>
          </div>
          <button onClick={handlePassword} className="btn-primary flex items-center gap-2"><Lock size={15} /> Update Password</button>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Bell size={16} /> Notification Preferences</h3>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Email Notifications</p>
            <div className="space-y-3">
              {[
                { key: 'emailNewLead', label: 'New lead assigned' },
                { key: 'emailMeeting', label: 'Meeting reminders' },
                { key: 'emailTask', label: 'Task due reminders' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  <button onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${notifications[item.key as keyof typeof notifications] ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">In-App Notifications</p>
            <div className="space-y-3">
              {[
                { key: 'inAppAll', label: 'All activity' },
                { key: 'inAppMessages', label: 'New messages' },
                { key: 'inAppReminders', label: 'Reminders & alerts' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  <button onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${notifications[item.key as keyof typeof notifications] ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => toast.success('Preferences saved')} className="btn-primary flex items-center gap-2"><Save size={15} /> Save Preferences</button>
        </div>
      )}
    </div>
  )
}
