import { useState } from 'react'
import { mockUsers } from '../data/mockData'
import type { User } from '../types'
import { Plus, X, Search, Shield, UserCheck, GraduationCap, Trash2, MoreVertical, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

const roleIcon = { admin: <Shield size={14} />, consultant: <UserCheck size={14} />, student: <GraduationCap size={14} /> }
const roleColor = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  consultant: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  student: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<User['role'] | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', role: 'consultant' as User['role'], phone: '' })

  const filtered = users.filter(u => {
    const matchSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || u.role === filterRole
    return matchSearch && matchRole
  })

  const counts = { all: users.length, admin: users.filter(u => u.role === 'admin').length, consultant: users.filter(u => u.role === 'consultant').length, student: users.filter(u => u.role === 'student').length }

  const handleAdd = () => {
    if (!form.email || !form.firstName) { toast.error('Name and email required'); return }
    const newUser: User = { id: `usr-${Date.now()}`, email: form.email, firstName: form.firstName, lastName: form.lastName, role: form.role, phone: form.phone }
    setUsers(u => [newUser, ...u])
    setShowModal(false)
    setForm({ email: '', firstName: '', lastName: '', role: 'consultant', phone: '' })
    toast.success('User added')
  }

  const handleDelete = (id: string) => {
    setUsers(u => u.filter(x => x.id !== id))
    setMenuId(null)
    toast.success('User removed')
  }

  const handleRoleChange = (id: string, role: User['role']) => {
    setUsers(u => u.map(x => x.id === id ? { ...x, role } : x))
    setMenuId(null)
    toast.success('Role updated')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{users.length} total users</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Role Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'admin', 'consultant', 'student'] as const).map(role => (
          <button key={role} onClick={() => setFilterRole(role)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${filterRole === role ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-700'}`}>
            {role} <span className="ml-1 text-xs opacity-70">({counts[role]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-9" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(user => (
          <div key={user.id} className="card p-4 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{user.firstName[0]}{user.lastName[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                  <span className={`badge text-xs flex items-center gap-1 w-fit mt-0.5 ${roleColor[user.role]}`}>
                    {roleIcon[user.role]}{user.role}
                  </span>
                </div>
              </div>
              <div className="relative">
                <button onClick={() => setMenuId(menuId === user.id ? null : user.id)} className="btn-ghost p-1.5">
                  <MoreVertical size={16} />
                </button>
                {menuId === user.id && (
                  <div className="absolute right-0 top-8 bg-white dark:bg-surface-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-10 py-1 min-w-40">
                    <p className="text-xs text-gray-400 px-3 py-1.5 font-medium uppercase tracking-wider">Change Role</p>
                    {(['admin', 'consultant', 'student'] as User['role'][]).filter(r => r !== user.role).map(role => (
                      <button key={role} onClick={() => handleRoleChange(user.id, role)} className="w-full text-left px-3 py-2 text-sm capitalize hover:bg-gray-50 dark:hover:bg-surface-700 transition-colors">
                        {role}
                      </button>
                    ))}
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                      <button onClick={() => handleDelete(user.id)} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2">
                        <Trash2 size={13} /> Remove User
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail size={11} /><span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={11} /><span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 card p-12 text-center">
            <p className="text-gray-400">No users found</p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setMenuId(null)}>
          <div className="card w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Add User</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">First Name *</label><input className="input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} /></div>
              <div><label className="label">Last Name</label><input className="input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} /></div>
              <div className="col-span-2"><label className="label">Email *</label><input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><label className="label">Role</label>
                <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as User['role'] }))}>
                  <option value="admin">Admin</option>
                  <option value="consultant">Consultant</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleAdd} className="btn-primary flex-1">Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
