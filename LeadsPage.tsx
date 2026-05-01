import { useState } from 'react'
import { mockLeads } from '../data/mockData'
import type { Lead } from '../types'
import { Plus, X, DollarSign, Phone, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

const STAGES: { id: Lead['stage']; label: string; color: string; bg: string }[] = [
  { id: 'inquiry', label: 'Inquiry', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'qualification', label: 'Qualification', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'proposal', label: 'Proposal', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { id: 'negotiation', label: 'Negotiation', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 'closed_won', label: 'Won ✓', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 'closed_lost', label: 'Lost', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
]

const priorityColor = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-gray-300' }

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [dragId, setDragId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', value: '', source: '', priority: 'medium' as Lead['priority'], notes: '', stage: 'inquiry' as Lead['stage'] })

  const handleDragStart = (e: React.DragEvent, id: string) => { setDragId(id); e.dataTransfer.effectAllowed = 'move' }
  const handleDrop = (e: React.DragEvent, stage: Lead['stage']) => {
    e.preventDefault()
    if (!dragId) return
    setLeads(ls => ls.map(l => l.id === dragId ? { ...l, stage } : l))
    setDragId(null)
    toast.success('Lead moved')
  }

  const handleAdd = () => {
    if (!form.name || !form.email) { toast.error('Name and email required'); return }
    const newLead: Lead = { id: `ld-${Date.now()}`, name: form.name, email: form.email, phone: form.phone, stage: form.stage, value: Number(form.value) || undefined, source: form.source, priority: form.priority, notes: form.notes, createdAt: new Date().toISOString().split('T')[0] }
    setLeads(ls => [newLead, ...ls])
    setShowModal(false)
    toast.success('Lead added')
  }

  const totalValue = leads.filter(l => l.stage === 'closed_won').reduce((s, l) => s + (l.value || 0), 0)

  return (
    <div className="space-y-5 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Pipeline</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{leads.length} leads · ${totalValue.toLocaleString()} won</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Lead</button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
        {STAGES.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage.id)
          const stageValue = stageLeads.reduce((s, l) => s + (l.value || 0), 0)
          return (
            <div key={stage.id} className="flex-shrink-0 w-64"
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, stage.id)}>
              <div className={`${stage.bg} rounded-xl p-3 mb-3`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${stage.color}`}>{stage.label}</span>
                  <span className="text-xs bg-white dark:bg-gray-800 rounded-full px-2 py-0.5 font-medium text-gray-600 dark:text-gray-300">{stageLeads.length}</span>
                </div>
                {stageValue > 0 && <p className="text-xs text-gray-500 mt-1">${stageValue.toLocaleString()}</p>}
              </div>
              <div className="space-y-3">
                {stageLeads.map(lead => (
                  <div key={lead.id} draggable
                    onDragStart={e => handleDragStart(e, lead.id)}
                    className="card p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all select-none">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{lead.name}</p>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${priorityColor[lead.priority]}`} title={lead.priority} />
                    </div>
                    {lead.value && (
                      <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 mb-2">
                        <DollarSign size={11} /><span className="font-medium">{lead.value.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500"><Mail size={10} /><span className="truncate">{lead.email}</span></div>
                      {lead.phone && <div className="flex items-center gap-1 text-xs text-gray-500"><Phone size={10} /><span>{lead.phone}</span></div>}
                    </div>
                    {lead.source && (
                      <span className="mt-2 inline-block text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">{lead.source}</span>
                    )}
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center text-xs text-gray-400">Drop here</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Add Lead</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Name *</label><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><label className="label">Email *</label><input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><label className="label">Value ($)</label><input className="input" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} /></div>
              <div><label className="label">Source</label><input className="input" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} /></div>
              <div><label className="label">Priority</label>
                <select className="input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Lead['priority'] }))}>
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
              <div><label className="label">Stage</label>
                <select className="input" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value as Lead['stage'] }))}>
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div><label className="label">Notes</label><input className="input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleAdd} className="btn-primary flex-1">Add Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
