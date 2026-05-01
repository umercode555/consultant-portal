import { useState } from 'react'
import { mockDocuments } from '../data/mockData'
import type { Document } from '../types'
import { Upload, Search, FileText, Download, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const categoryColor: Record<string, string> = { cv: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', application: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', contract: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', report: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', other: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' }
const statusIcon = { approved: <CheckCircle size={13} className="text-emerald-500" />, pending: <Clock size={13} className="text-amber-500" />, rejected: <XCircle size={13} className="text-red-500" /> }

function formatSize(bytes: number) { return bytes < 1000000 ? `${(bytes / 1000).toFixed(0)} KB` : `${(bytes / 1000000).toFixed(1)} MB` }

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>(mockDocuments)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [dragging, setDragging] = useState(false)

  const filtered = docs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || d.category === catFilter
    return matchSearch && matchCat
  })

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      const newDoc: Document = {
        id: `dc-${Date.now()}-${Math.random()}`, name: file.name, type: file.type, size: file.size,
        url: '#', uploadedBy: 'current-user', uploadedAt: new Date().toISOString().split('T')[0],
        category: 'other', status: 'pending'
      }
      setDocs(ds => [newDoc, ...ds])
      toast.success(`${file.name} uploaded`)
    })
  }

  const handleDelete = (id: string) => { setDocs(ds => ds.filter(d => d.id !== id)); toast.success('Document deleted') }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{docs.length} files stored</p>
        </div>
        <label className="btn-primary flex items-center gap-2 cursor-pointer">
          <Upload size={16} /> Upload
          <input type="file" multiple className="hidden" onChange={e => handleFileUpload(e.target.files)} />
        </label>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFileUpload(e.dataTransfer.files) }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop files here, or <label className="text-primary-600 cursor-pointer hover:underline">browse<input type="file" multiple className="hidden" onChange={e => handleFileUpload(e.target.files)} /></label></p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'cv', 'application', 'contract', 'report', 'other'].map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)} className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${catFilter === cat ? 'bg-primary-500 text-white' : 'bg-white dark:bg-surface-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Size</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Uploaded</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {filtered.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{doc.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`badge ${categoryColor[doc.category] || categoryColor.other}`}>{doc.category}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{formatSize(doc.size)}</td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {doc.status && (
                    <div className="flex items-center gap-1 text-xs capitalize text-gray-600 dark:text-gray-400">
                      {statusIcon[doc.status]}{doc.status}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><Download size={14} /></button>
                    <button onClick={() => handleDelete(doc.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">No documents found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
