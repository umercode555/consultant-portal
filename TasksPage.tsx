import { useState } from 'react'
import { mockTasks } from '../data/mockData'
import type { Task } from '../types'
import { Plus, X, Flag } from 'lucide-react'
import toast from 'react-hot-toast'

const COLS: { id: Task['status']; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'text-gray-600 bg-gray-50 dark:bg-gray-800' },
  { id: 'in_progress', label: 'In Progress', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { id: 'done', label: 'Done', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
]
const priorityColor = { high: 'text-red-500', medium: 'text-amber-500', low: 'text-gray-400' }
const priorityBg = { high: 'bg-red-100 dark:bg-red-900/30', medium: 'bg-amber-100 dark:bg-amber-900/30', low: 'bg-gray-100 dark:bg-gray-700' }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [showModal, setShowModal] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'medium' as Task['priority'], status: 'todo' as Task['status'] })

  const handleDrop = (status: Task['status']) => {
    if (!dragId) return
    setTasks(ts => ts.map(t => t.id === dragId ? { ...t, status } : t))
    setDragId(null)
  }

  const handleAdd = () => {
    if (!form.title) { toast.error('Title required'); return }
    const nt: Task = { id: `tk-${Date.now()}`, title: form.title, description: form.description, dueDate: form.dueDate, priority: form.priority, status: form.status, createdAt: new Date().toISOString().split('T')[0] }
    setTasks(ts => [nt, ...ts])
    setShowModal(false)
    toast.success('Task added')
  }

  const deleteTask = (id: string) => { setTasks(ts => ts.filter(t => t.id !== id)); toast.success('Task deleted') }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{tasks.filter(t => t.status !== 'done').length} open · {tasks.filter(t => t.status === 'done').length} done</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Task</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id)
          return (
            <div key={col.id}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(col.id)}
              className="min-h-48">
              <div className={`${col.color} rounded-xl px-4 py-3 mb-3 flex items-center justify-between`}>
                <span className="font-semibold text-sm">{col.label}</span>
                <span className="text-xs bg-white/60 dark:bg-black/20 rounded-full px-2 py-0.5 font-medium">{colTasks.length}</span>
              </div>
              <div className="space-y-3">
                {colTasks.map(task => (
                  <div key={task.id} draggable
                    onDragStart={() => setDragId(task.id)}
                    className="card p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{task.title}</p>
                      <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all flex-shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                    {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{task.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${priorityBg[task.priority]} ${priorityColor[task.priority]}`}>
                        <Flag size={10} />{task.priority}
                      </span>
                      {task.dueDate && (
                        <span className={`text-xs ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center text-xs text-gray-400">Drop here</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Add Task</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><label className="label">Description</label><textarea className="input h-16 resize-none" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Due Date</label><input className="input" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
                <div><label className="label">Priority</label>
                  <select className="input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Task['priority'] }))}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
              </div>
              <div><label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Task['status'] }))}>
                  <option value="todo">To Do</option><option value="in_progress">In Progress</option><option value="done">Done</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleAdd} className="btn-primary flex-1">Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
