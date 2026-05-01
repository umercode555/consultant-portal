import { useState } from 'react'
import { mockEmailTemplates, mockCampaigns } from '../data/mockData'
import type { EmailTemplate, Campaign } from '../types'
import { Plus, X, Mail, Send, BarChart2, PlayCircle, PauseCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColor = { draft: 'bg-gray-100 text-gray-600', active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', paused: 'bg-amber-100 text-amber-700', completed: 'bg-blue-100 text-blue-700' }

export default function EmailPage() {
  const [tab, setTab] = useState<'templates' | 'campaigns'>('templates')
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockEmailTemplates)
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [showTplModal, setShowTplModal] = useState(false)
  const [showCamModal, setShowCamModal] = useState(false)
  const [selectedTpl, setSelectedTpl] = useState<EmailTemplate | null>(null)
  const [previewTpl, setPreviewTpl] = useState<EmailTemplate | null>(null)
  const [tplForm, setTplForm] = useState({ name: '', subject: '', body: '', category: 'General' })
  const [camForm, setCamForm] = useState({ name: '', type: 'broadcast' as Campaign['type'], targetSegment: '' })

  const toggleCampaign = (id: string) => {
    setCampaigns(cs => cs.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c))
    toast.success('Campaign updated')
  }

  const saveTpl = () => {
    if (!tplForm.name || !tplForm.subject) { toast.error('Name and subject required'); return }
    if (selectedTpl) {
      setTemplates(ts => ts.map(t => t.id === selectedTpl.id ? { ...t, ...tplForm } : t))
      toast.success('Template updated')
    } else {
      const nt: EmailTemplate = { id: `et-${Date.now()}`, ...tplForm, createdAt: new Date().toISOString().split('T')[0] }
      setTemplates(ts => [nt, ...ts])
      toast.success('Template created')
    }
    setShowTplModal(false)
  }

  const createCampaign = () => {
    if (!camForm.name) { toast.error('Name required'); return }
    const nc: Campaign = { id: `cm-${Date.now()}`, name: camForm.name, type: camForm.type, status: 'draft', targetSegment: camForm.targetSegment, emails: [], createdAt: new Date().toISOString().split('T')[0], sentCount: 0, openRate: 0 }
    setCampaigns(cs => [nc, ...cs])
    setShowCamModal(false)
    toast.success('Campaign created')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email & Campaigns</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{templates.length} templates · {campaigns.filter(c => c.status === 'active').length} active campaigns</p>
        </div>
        <button onClick={() => tab === 'templates' ? (setSelectedTpl(null), setTplForm({ name: '', subject: '', body: '', category: 'General' }), setShowTplModal(true)) : setShowCamModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />{tab === 'templates' ? 'New Template' : 'New Campaign'}
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {(['templates', 'campaigns'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map(tpl => (
            <div key={tpl.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Mail size={15} className="text-blue-600" />
                </div>
                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">{tpl.category}</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">{tpl.name}</p>
              <p className="text-sm text-gray-500 truncate mb-3">{tpl.subject}</p>
              <p className="text-xs text-gray-400 line-clamp-2">{tpl.body.substring(0, 100)}...</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setPreviewTpl(tpl)} className="flex-1 text-xs px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Preview</button>
                <button onClick={() => { setSelectedTpl(tpl); setTplForm({ name: tpl.name, subject: tpl.subject, body: tpl.body, category: tpl.category }); setShowTplModal(true) }} className="flex-1 text-xs px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 transition-colors">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.map(cam => (
            <div key={cam.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{cam.name}</p>
                    <span className={`badge ${statusColor[cam.status]}`}>{cam.status}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full capitalize">{cam.type}</span>
                  </div>
                  <p className="text-sm text-gray-500">Target: {cam.targetSegment} · {cam.emails.length} emails</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Sent</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{cam.sentCount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Open Rate</p>
                        <p className="text-sm font-semibold text-emerald-600">{cam.openRate}%</p>
                      </div>
                    </div>
                  </div>
                  {(cam.status === 'active' || cam.status === 'paused') && (
                    <button onClick={() => toggleCampaign(cam.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      {cam.status === 'active' ? <PauseCircle size={20} className="text-amber-500" /> : <PlayCircle size={20} className="text-emerald-500" />}
                    </button>
                  )}
                </div>
              </div>
              {cam.emails.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex gap-2 overflow-x-auto">
                  {cam.emails.map((email, idx) => (
                    <div key={email.id} className="flex-shrink-0 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">Day {email.delayDays}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[120px]">{email.subject}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Template Modal */}
      {showTplModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg">{selectedTpl ? 'Edit Template' : 'New Template'}</h2>
              <button onClick={() => setShowTplModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Name *</label><input className="input" value={tplForm.name} onChange={e => setTplForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div><label className="label">Category</label><input className="input" value={tplForm.category} onChange={e => setTplForm(f => ({ ...f, category: e.target.value }))} /></div>
              </div>
              <div><label className="label">Subject *</label><input className="input" value={tplForm.subject} onChange={e => setTplForm(f => ({ ...f, subject: e.target.value }))} /></div>
              <div><label className="label">Body</label><textarea className="input h-48 resize-none font-mono text-sm" value={tplForm.body} onChange={e => setTplForm(f => ({ ...f, body: e.target.value }))} /></div>
              <p className="text-xs text-gray-400">Use {'{{'}variable{'}}'}  for dynamic content</p>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowTplModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={saveTpl} className="btn-primary flex-1">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTpl && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">{previewTpl.name}</h2>
              <button onClick={() => setPreviewTpl(null)}><X size={18} /></button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Subject</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">{previewTpl.subject}</p>
              <p className="text-xs text-gray-400 mb-1">Body</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{previewTpl.body}</p>
            </div>
            <button onClick={() => setPreviewTpl(null)} className="btn-secondary w-full mt-4">Close</button>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {showCamModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg">New Campaign</h2>
              <button onClick={() => setShowCamModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="label">Name *</label><input className="input" value={camForm.name} onChange={e => setCamForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><label className="label">Type</label>
                <select className="input" value={camForm.type} onChange={e => setCamForm(f => ({ ...f, type: e.target.value as Campaign['type'] }))}>
                  <option value="broadcast">Broadcast</option><option value="drip">Drip Sequence</option>
                </select>
              </div>
              <div><label className="label">Target Segment</label><input className="input" placeholder="e.g. New Students" value={camForm.targetSegment} onChange={e => setCamForm(f => ({ ...f, targetSegment: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCamModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={createCampaign} className="btn-primary flex-1">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
