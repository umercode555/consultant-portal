import { useState } from 'react'
import { mockMeetings } from '../data/mockData'
import type { Meeting } from '../types'
import { Plus, X, Calendar, Clock, Video, Phone, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const typeIcon = { online: Video, phone: Phone, 'in-person': Users }
const statusColor = { scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', cancelled: 'bg-gray-100 text-gray-500' }

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings)
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all')
  const [showModal, setShowModal] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', date: '', duration: '60', type: 'online' as Meeting['type'], notes: '', actionItems: '' })

  const filtered = filter === 'all' ? meetings : meetings.filter(m => m.status === filter)

  const handleAdd = () => {
    if (!form.title || !form.date) { toast.error('Title and date required'); return }
    const nm: Meeting = {
      id: `mt-${Date.now()}`, title: form.title, consultantId: 'con-1', date: form.date,
      duration: Number(form.duration), type: form.type, notes: form.notes,
      actionItems: form.actionItems ? form.actionItems.split('\n').filter(Boolean) : [],
      status: 'scheduled'
    }
    setMeetings(ms => [nm, ...ms])
    setShowModal(false)
    toast.success('Meeting scheduled')
  }

  const markComplete = (id: string) => {
    setMeetings(ms => ms.map(m => m.id === id ? { ...m, status: 'completed' } : m))
    toast.success('Marked complete')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meetings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{meetings.filter(m => m.status === 'scheduled').length} upcoming</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Schedule</button>
      </div>

      <div className="flex gap-2">
        {(['all', 'scheduled', 'completed', 'cancelled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-primary-500 text-white' : 'bg-white dark:bg-surface-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(m => {
          const Icon = typeIcon[m.type]
          const isOpen = expanded === m.id
          return (
            <div key={m.id} className="card overflow-hidden">
              <div className="p-4 flex items-start gap-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : m.id)}>
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">{m.title}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-sm text-gray-500"><Calendar size={13} /><span>{new Date(m.date).toLocaleDateString()}</span></div>
                    <div className="flex items-center gap-1 text-sm text-gray-500"><Clock size={13} /><span>{m.duration} min</span></div>
                    <span className="capitalize text-xs text-gray-400">{m.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`badge ${statusColor[m.status]}`}>{m.status}</span>
                  {m.status === 'scheduled' && (
                    <button onClick={e => { e.stopPropagation(); markComplete(m.id) }} className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 transition-colors">
                      Complete
                    </button>
                  )}
                </div>
              </div>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700/50 pt-4 space-y-3">
                  {m.notes && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{m.notes}</p>
                    </div>
                  )}
                  {m.actionItems && m.actionItems.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Action Items</p>
                      <ul className="space-y-1">
                        {m.actionItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="w-4 h-4 bg-primary-100 dark:bg-primary-900/30 rounded flex items-center justify-center text-[10px] font-bold text-primary-600 flex-shrink-0 mt-0.5">{i + 1}</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {m.followUpDate && <p className="text-sm text-gray-500">Follow-up: {new Date(m.followUpDate).toLocaleDateString()}</p>}
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400">No meetings found</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Schedule Meeting</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Date & Time *</label><input className="input" type="datetime-local" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
                <div><label className="label">Duration (min)</label><input className="input" type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} /></div>
              </div>
              <div><label className="label">Type</label>
                <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Meeting['type'] }))}>
                  <option value="online">Online</option><option value="phone">Phone</option><option value="in-person">In-Person</option>
                </select>
              </div>
              <div><label className="label">Notes</label><textarea className="input h-20 resize-none" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <div><label className="label">Action Items (one per line)</label><textarea className="input h-20 resize-none" placeholder="Send brochures&#10;Schedule follow-up" value={form.actionItems} onChange={e => setForm(f => ({ ...f, actionItems: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleAdd} className="btn-primary flex-1">Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
