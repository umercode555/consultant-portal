import { useState } from 'react'
import { mockStudents } from '../data/mockData'
import type { Student } from '../types'
import { Plus, X, GraduationCap, Mail, Phone, Search, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const STAGES: { id: Student['progressStage']; label: string; color: string }[] = [
  { id: 'inquiry', label: 'Inquiry', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  { id: 'document_prep', label: 'Doc Prep', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'application', label: 'Application', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 'offer', label: 'Offer', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 'enrolled', label: 'Enrolled', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
]

const statusColor: Record<Student['status'], string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  graduated: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState<Student['progressStage'] | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<Student | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', program: '', university: '', country: '', progressStage: 'inquiry' as Student['progressStage'], notes: '' })

  const filtered = students.filter(s => {
    const matchSearch = `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(search.toLowerCase())
    const matchStage = filterStage === 'all' || s.progressStage === filterStage
    return matchSearch && matchStage
  })

  const handleAdd = () => {
    if (!form.firstName || !form.email) { toast.error('Name and email required'); return }
    const newStudent: Student = {
      id: `stu-${Date.now()}`, userId: `usr-${Date.now()}`,
      firstName: form.firstName, lastName: form.lastName, email: form.email,
      phone: form.phone, program: form.program, university: form.university,
      country: form.country, progressStage: form.progressStage,
      status: 'active', notes: form.notes, createdAt: new Date().toISOString().split('T')[0]
    }
    setStudents(s => [newStudent, ...s])
    setShowModal(false)
    setForm({ firstName: '', lastName: '', email: '', phone: '', program: '', university: '', country: '', progressStage: 'inquiry', notes: '' })
    toast.success('Student added')
  }

  const stageLabel = (stage: Student['progressStage']) => STAGES.find(s => s.id === stage)?.label || stage
  const stageColor = (stage: Student['progressStage']) => STAGES.find(s => s.id === stage)?.color || ''

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} students</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={filterStage} onChange={e => setFilterStage(e.target.value as typeof filterStage)}>
          <option value="all">All Stages</option>
          {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {/* Progress Bar Stats */}
      <div className="grid grid-cols-5 gap-2">
        {STAGES.map(stage => {
          const count = students.filter(s => s.progressStage === stage.id).length
          return (
            <button key={stage.id} onClick={() => setFilterStage(filterStage === stage.id ? 'all' : stage.id)}
              className={`card p-3 text-center transition-all hover:shadow-md ${filterStage === stage.id ? 'ring-2 ring-primary-500' : ''}`}>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stage.label}</p>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Program</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Consultant</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/30">
            {filtered.map(student => (
              <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-surface-700/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{student.firstName[0]}{student.lastName[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{student.firstName} {student.lastName}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail size={10} />{student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{student.program || '—'}</p>
                  <p className="text-xs text-gray-500">{student.university || ''}</p>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{student.consultantName || 'Unassigned'}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge text-xs ${stageColor(student.progressStage)}`}>{stageLabel(student.progressStage)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge text-xs capitalize ${statusColor[student.status]}`}>{student.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelected(student)} className="btn-ghost p-1.5"><ChevronRight size={16} /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Add Student</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">First Name *</label><input className="input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} /></div>
              <div><label className="label">Last Name</label><input className="input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} /></div>
              <div><label className="label">Email *</label><input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><label className="label">Program</label><input className="input" value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))} /></div>
              <div><label className="label">University</label><input className="input" value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))} /></div>
              <div><label className="label">Country</label><input className="input" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></div>
              <div><label className="label">Stage</label>
                <select className="input" value={form.progressStage} onChange={e => setForm(f => ({ ...f, progressStage: e.target.value as Student['progressStage'] }))}>
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="col-span-2"><label className="label">Notes</label><textarea className="input resize-none" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleAdd} className="btn-primary flex-1">Add Student</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end">
          <div className="bg-white dark:bg-surface-900 w-full max-w-md h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Student Detail</h2>
              <button onClick={() => setSelected(null)}><X size={18} /></button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{selected.firstName[0]}{selected.lastName[0]}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selected.firstName} {selected.lastName}</h3>
              <span className={`badge mt-2 ${stageColor(selected.progressStage)}`}>{stageLabel(selected.progressStage)}</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Email', value: selected.email, icon: <Mail size={14} /> },
                { label: 'Phone', value: selected.phone, icon: <Phone size={14} /> },
                { label: 'Program', value: selected.program },
                { label: 'University', value: selected.university },
                { label: 'Country', value: selected.country },
                { label: 'Consultant', value: selected.consultantName || 'Unassigned' },
                { label: 'Status', value: selected.status },
                { label: 'Joined', value: selected.createdAt },
              ].filter(f => f.value).map(field => (
                <div key={field.label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700/50">
                  <span className="text-sm text-gray-500 flex items-center gap-1">{field.icon}{field.label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{field.value}</span>
                </div>
              ))}
            </div>
            {selected.notes && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-surface-800 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selected.notes}</p>
              </div>
            )}
            {/* Progress Timeline */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Progress Timeline</h4>
              <div className="flex items-center gap-1">
                {STAGES.map((stage, i) => {
                  const stageIdx = STAGES.findIndex(s => s.id === selected.progressStage)
                  const done = i <= stageIdx
                  return (
                    <div key={stage.id} className="flex items-center flex-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${done ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>{i + 1}</div>
                      {i < STAGES.length - 1 && <div className={`flex-1 h-0.5 ${done && i < stageIdx ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-1">
                {STAGES.map(s => <span key={s.id} className="text-[9px] text-gray-400 text-center flex-1">{s.label}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
