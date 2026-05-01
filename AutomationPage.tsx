import { useState } from 'react'
import { mockAutomations, mockCampaigns } from '../data/mockData'
import type { Automation, Campaign } from '../types'
import { Plus, X, Zap, Mail, Play, Pause, ChevronRight, Clock, Users, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const TRIGGERS = ['Lead stage changed', 'New lead created', 'Meeting completed', 'Document uploaded', 'Invoice overdue', 'Student enrolled', 'No activity for 7 days']
const ACTIONS = ['Send email', 'Create task', 'Move to next stage', 'Assign consultant', 'Send notification', 'Add to campaign']

export default function AutomationPage() {
  const [tab, setTab] = useState<'automations' | 'campaigns'>('automations')
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations)
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [showModal, setShowModal] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [newAuto, setNewAuto] = useState({ name: '', trigger: TRIGGERS[0], action: ACTIONS[0], actionConfig: '' })
  const [newCampaign, setNewCampaign] = useState({ name: '', type: 'drip' as Campaign['type'], targetSegment: 'All Leads', emails: [{ subject: '', delayDays: 1, body: '' }] })

  const toggleAuto = (id: string) => {
    setAutomations(a => a.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x))
    toast.success('Automation updated')
  }
  const deleteAuto = (id: string) => { setAutomations(a => a.filter(x => x.id !== id)); toast.success('Deleted') }

  const addAuto = () => {
    if (!newAuto.name) { toast.error('Name required'); return }
    const a: Automation = {
      id: `auto-${Date.now()}`, name: newAuto.name,
      trigger: newAuto.trigger, conditions: [], runCount: 0,
      actions: [{ type: 'send_email', config: { message: newAuto.actionConfig } }],
      status: 'active', createdAt: new Date().toISOString().split('T')[0]
    }
    setAutomations(x => [a, ...x])
    setShowModal(false)
    toast.success('Automation created')
  }

  const addCampaign = () => {
    if (!newCampaign.name) { toast.error('Name required'); return }
    const c: Campaign = {
      id: `camp-${Date.now()}`, name: newCampaign.name, type: newCampaign.type,
      targetSegment: newCampaign.targetSegment, status: 'draft', sentCount: 0, openRate: 0,
      emails: newCampaign.emails.map((e, i) => ({ id: `e-${i}`, subject: e.subject, body: e.body, delayDays: e.delayDays })),
      createdAt: new Date().toISOString().split('T')[0]
    }
    setCampaigns(x => [c, ...x])
    setShowCampaignModal(false)
    toast.success('Campaign created')
  }

  const statusColor: Record<Campaign['status'], string> = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Automation Engine</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">If/Then workflows & drip campaigns</p>
        </div>
        <button onClick={() => tab === 'automations' ? setShowModal(true) : setShowCampaignModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> {tab === 'automations' ? 'New Workflow' : 'New Campaign'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-surface-800 p-1 rounded-xl w-fit">
        {(['automations', 'campaigns'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white dark:bg-surface-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'automations' && (
        <div className="space-y-3">
          {automations.map(auto => (
            <div key={auto.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${auto.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <Zap size={18} className={auto.status === 'active' ? 'text-emerald-600' : 'text-gray-400'} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{auto.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        When: {auto.trigger}
                      </span>
                      <ChevronRight size={12} className="text-gray-400" />
                      {auto.actions.map((a, i) => (
                        <span key={i} className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full capitalize">
                          Then: {a.type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Play size={10} /> {auto.runCount || 0} runs</span>
                      <span>Created {auto.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleAuto(auto.id)} className="btn-ghost p-1.5">
                    {auto.status === 'active' ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                  <button onClick={() => deleteAuto(auto.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {automations.length === 0 && (
            <div className="card p-12 text-center">
              <Zap size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No automations yet. Create your first workflow.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map(camp => (
            <div key={camp.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{camp.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">{camp.type} campaign · {camp.targetSegment}</p>
                </div>
                <span className={`badge text-xs capitalize ${statusColor[camp.status]}`}>{camp.status}</span>
              </div>
              <div className="space-y-2 mb-4">
                {camp.emails.map((email, i) => (
                  <div key={email.id} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary-600">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-gray-700 dark:text-gray-300">{email.subject || 'No subject'}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} /> Day {email.delayDays}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <span className="flex items-center gap-1"><Users size={11} /> {camp.sentCount || 0} sent</span>
                <span className="flex items-center gap-1"><Mail size={11} /> {camp.openRate || 0}% open rate</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn-secondary text-xs py-1.5 px-3 flex-1"
                  onClick={() => { setCampaigns(cs => cs.map(c => c.id === camp.id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c)); toast.success('Updated') }}>
                  {camp.status === 'active' ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Activate</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Automation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Create Workflow</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="label">Workflow Name *</label><input className="input" placeholder="e.g. Welcome New Lead" value={newAuto.name} onChange={e => setNewAuto(f => ({ ...f, name: e.target.value }))} /></div>
              <div>
                <label className="label">Trigger (When...)</label>
                <select className="input" value={newAuto.trigger} onChange={e => setNewAuto(f => ({ ...f, trigger: e.target.value }))}>
                  {TRIGGERS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Action (Then...)</label>
                <select className="input" value={newAuto.action} onChange={e => setNewAuto(f => ({ ...f, action: e.target.value }))}>
                  {ACTIONS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div><label className="label">Action Details</label><input className="input" placeholder="e.g. Email subject or task name" value={newAuto.actionConfig} onChange={e => setNewAuto(f => ({ ...f, actionConfig: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={addAuto} className="btn-primary flex-1">Create Workflow</button>
            </div>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Create Campaign</h2>
              <button onClick={() => setShowCampaignModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="label">Campaign Name *</label><input className="input" value={newCampaign.name} onChange={e => setNewCampaign(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Type</label>
                  <select className="input" value={newCampaign.type} onChange={e => setNewCampaign(f => ({ ...f, type: e.target.value as Campaign['type'] }))}>
                    <option value="drip">Drip</option><option value="broadcast">Broadcast</option>
                  </select>
                </div>
                <div><label className="label">Segment</label>
                  <select className="input" value={newCampaign.targetSegment} onChange={e => setNewCampaign(f => ({ ...f, targetSegment: e.target.value }))}>
                    {['All Leads', 'New Leads', 'Qualified Leads', 'All Students', 'Active Students'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Email Sequence</label>
                  <button className="text-xs text-primary-600 hover:underline" onClick={() => setNewCampaign(f => ({ ...f, emails: [...f.emails, { subject: '', delayDays: (f.emails[f.emails.length - 1]?.delayDays || 0) + 3, body: '' }] }))}>+ Add Email</button>
                </div>
                {newCampaign.emails.map((email, i) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-surface-800 rounded-xl mb-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">Email {i + 1}</span>
                      <input type="number" className="input py-1 w-20 text-xs" placeholder="Day" value={email.delayDays}
                        onChange={e => setNewCampaign(f => ({ ...f, emails: f.emails.map((em, j) => j === i ? { ...em, delayDays: Number(e.target.value) } : em) }))} />
                      <span className="text-xs text-gray-400">days after trigger</span>
                    </div>
                    <input className="input text-sm" placeholder="Email subject" value={email.subject}
                      onChange={e => setNewCampaign(f => ({ ...f, emails: f.emails.map((em, j) => j === i ? { ...em, subject: e.target.value } : em) }))} />
                    <textarea className="input text-sm resize-none" rows={2} placeholder="Email body..." value={email.body}
                      onChange={e => setNewCampaign(f => ({ ...f, emails: f.emails.map((em, j) => j === i ? { ...em, body: e.target.value } : em) }))} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCampaignModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={addCampaign} className="btn-primary flex-1">Create Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
