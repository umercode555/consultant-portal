import { useState } from 'react'
import { mockForumPosts } from '../data/mockData'
import type { ForumPost } from '../types'
import { Plus, X, ThumbsUp, MessageSquare, Pin } from 'lucide-react'
import toast from 'react-hot-toast'

const categories = ['All', 'Application Tips', 'Test Prep', 'Resources', 'Visa', 'General']

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>(mockForumPosts)
  const [catFilter, setCatFilter] = useState('All')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ title: '', content: '', category: 'General' })

  const filtered = catFilter === 'All' ? posts : posts.filter(p => p.category === catFilter)

  const handleLike = (id: string) => {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p))
  }

  const handleReply = (postId: string) => {
    const text = replyText[postId]?.trim()
    if (!text) return
    setPosts(ps => ps.map(p => p.id === postId ? {
      ...p, replies: [...p.replies, { id: `r-${Date.now()}`, authorId: 'current', authorName: 'You', content: text, createdAt: new Date().toISOString(), likes: 0 }]
    } : p))
    setReplyText(r => ({ ...r, [postId]: '' }))
    toast.success('Reply posted')
  }

  const handlePost = () => {
    if (!form.title || !form.content) { toast.error('Title and content required'); return }
    const np: ForumPost = {
      id: `fp-${Date.now()}`, authorId: 'current', authorName: 'You', authorRole: 'consultant',
      title: form.title, content: form.content, category: form.category, likes: 0, replies: [],
      createdAt: new Date().toISOString(), pinned: false
    }
    setPosts(ps => [np, ...ps])
    setShowModal(false)
    setForm({ title: '', content: '', category: 'General' })
    toast.success('Post created')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Community Forum</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{posts.length} discussions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Post</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)} className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${catFilter === cat ? 'bg-primary-500 text-white' : 'bg-white dark:bg-surface-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>{cat}</button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(post => (
          <div key={post.id} className="card overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">{post.authorName.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        {post.pinned && <Pin size={13} className="text-amber-500" />}
                        <button onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                          className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 text-left">{post.title}</button>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{post.authorName}</span>
                        <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">{post.category}</span>
                        <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {(expanded === post.id) && (
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{post.content}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors">
                      <ThumbsUp size={13} />{post.likes}
                    </button>
                    <button onClick={() => setExpanded(expanded === post.id ? null : post.id)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors">
                      <MessageSquare size={13} />{post.replies.length} replies
                    </button>
                  </div>
                </div>
              </div>

              {expanded === post.id && (
                <div className="mt-4 pl-12 space-y-3">
                  {post.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">{reply.authorName}</span>
                        <span className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      className="input flex-1 py-2 text-sm"
                      placeholder="Write a reply..."
                      value={replyText[post.id] || ''}
                      onChange={e => setReplyText(r => ({ ...r, [post.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleReply(post.id)}
                    />
                    <button onClick={() => handleReply(post.id)} className="btn-primary px-3 py-2 text-sm">Reply</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">New Post</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><label className="label">Category</label>
                <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="label">Content *</label><textarea className="input h-32 resize-none" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handlePost} className="btn-primary flex-1">Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
