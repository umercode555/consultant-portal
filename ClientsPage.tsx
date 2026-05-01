import { useState } from 'react'
import { mockClients } from '../data/mockData'
import type { Client } from '../types'
import { Plus, Search, Mail, Phone, Building2, MoreHorizontal, X } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColor = { active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', prospect: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'prospect'>('all')
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<Client | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', country: '', status: 'prospect' as Client['status'], notes: '' })

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || (c.company || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  const openAdd = () => { setSelected(null); setForm({ name: '', email: '', phone: '', company: '', country: '', status: 'prospect', notes: '' }); setShowModal(true) }
  const openEdit = (c: Client) => { setSelected(c); setForm({ name: c.name, email: c.email, phone: c.phone || '', company: c.company || '', country: c.country || '', status: c.status, notes: c.notes || '' }); setShowModal(true) }

  const handleSave = () => {
    if (!form.name || !form.email) { toast.error('Name and email required'); return }
    if (selected) {
      setClients(cs => cs.map(c => c.id === selected.id ? { ...c, ...form } : c))
      toast.success('Client updated')
    } else {
      const newClient: Client = { id: `cl-${Date.now()}`, ...form, createdAt: new Date().toISOString().split('T')[0] }
      setClients(cs => [newClient, ...cs])
      toast.success('Client added')
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => { setClients(cs => cs.filter(c => c.id !== id)); toast.success('Client removed') }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{clients.length} total clients</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Client</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive', 'prospect'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-primary-500 text-white' : 'bg-white dark:bg-surface-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{c.name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{c.name}</p>
                  {c.company && <p className="text-xs text-gray-500 dark:text-gray-400">{c.company}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`badge ${statusColor[c.status]}`}>{c.status}</span>
                <div className="relative group">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><MoreHorizontal size={14} /></button>
                  <div className="absolute right-0 top-7 w-32 card shadow-lg z-10 overflow-hidden hidden group-hover:block">
                    <button onClick={() => openEdit(c)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail size={13} /><span className="truncate">{c.email}</span>
              </div>
              {c.phone && <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Phone size={13} /><span>{c.phone}</span></div>}
              {c.country && <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Building2 size={13} /><span>{c.country}</span></div>}
            </div>
            {c.notes && <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">{c.notes}</p>}
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-3 text-center py-16 text-gray-400">No clients found</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{selected ? 'Edit Client' : 'Add Client'}</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Name *</label><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div><label className="label">Email *</label><input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div><label className="label">Company</label><input className="input" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></div>
                <div><label className="label">Country</label><input className="input" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></div>
                <div><label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Client['status'] }))}>
                    <option value="prospect">Prospect</option><option value="active">Active</option><option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div><label className="label">Notes</label><textarea className="input h-20 resize-none" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
