import { useState } from 'react'
import { mockConversations, mockMessages } from '../data/mockData'
import type { Conversation, Message } from '../types'
import { Send, Search } from 'lucide-react'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages)
  const [activeConv, setActiveConv] = useState<string | null>(conversations[0]?.id || null)
  const [search, setSearch] = useState('')
  const [newMsg, setNewMsg] = useState('')

  const filtered = conversations.filter(c => c.participantName.toLowerCase().includes(search.toLowerCase()))
  const activeMessages = activeConv ? (messages[activeConv] || []) : []
  const activeConvData = conversations.find(c => c.id === activeConv)

  const sendMessage = () => {
    if (!newMsg.trim() || !activeConv) return
    const msg: Message = { id: `m-${Date.now()}`, senderId: 'current-user', receiverId: activeConvData?.participantId || '', content: newMsg.trim(), createdAt: new Date().toISOString(), read: true }
    setMessages(ms => ({ ...ms, [activeConv]: [...(ms[activeConv] || []), msg] }))
    setConversations(cs => cs.map(c => c.id === activeConv ? { ...c, lastMessage: newMsg.trim(), lastMessageAt: new Date().toISOString() } : c))
    setNewMsg('')
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-10rem)]">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 card overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Messages</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 py-2 text-sm" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700/50">
          {filtered.map(conv => (
            <button key={conv.id} onClick={() => setActiveConv(conv.id)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${activeConv === conv.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">{conv.participantName.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{conv.participantName}</span>
                    {conv.unreadCount > 0 && <span className="w-5 h-5 bg-primary-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold flex-shrink-0">{conv.unreadCount}</span>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 card overflow-hidden flex flex-col">
        {activeConvData ? (
          <>
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{activeConvData.participantName.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{activeConvData.participantName}</p>
                <p className="text-xs text-gray-500 capitalize">{activeConvData.participantRole}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeMessages.map(msg => {
                const isMe = msg.senderId !== activeConvData.participantId
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${isMe ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                )
              })}
              {activeMessages.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-8">Start the conversation</div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700/50 flex gap-3">
              <input
                className="input flex-1"
                placeholder="Type a message..."
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              />
              <button onClick={sendMessage} disabled={!newMsg.trim()} className="btn-primary px-4 flex items-center gap-2 disabled:opacity-50">
                <Send size={15} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>
        )}
      </div>
    </div>
  )
}
