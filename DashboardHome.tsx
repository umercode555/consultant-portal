import { useAuthStore } from '../context/authStore'
import { mockClients, mockLeads, mockTasks, mockMeetings, mockStudents, mockInvoices } from '../data/mockData'
import { Users, TrendingUp, CheckSquare, Calendar, DollarSign, GraduationCap, ArrowUpRight, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DashboardHome() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'
  const isCon = user?.role === 'consultant'
  const isStu = user?.role === 'student'

  const myLeads = isAdmin ? mockLeads : mockLeads.filter(l => l.consultantId === user?.id)
  const myTasks = mockTasks.filter(t => isAdmin ? true : t.assignedTo === user?.id)
  const upcomingMeetings = mockMeetings.filter(m => m.status === 'scheduled').slice(0, 3)
  const pendingTasks = myTasks.filter(t => t.status !== 'done').slice(0, 5)
  const paidRevenue = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)

  const StatCard = ({ label, value, icon: Icon, color, onClick }: { label: string; value: string | number; icon: React.ElementType; color: string; onClick?: () => void }) => (
    <div onClick={onClick} className={`card p-5 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  )

  if (isStu) {
    const myStudent = mockStudents.find(s => s.userId === user?.id)
    const stages = ['inquiry', 'document_prep', 'application', 'offer', 'enrolled']
    const stageLabels: Record<string, string> = { inquiry: 'Inquiry', document_prep: 'Documents', application: 'Applied', offer: 'Offer Received', enrolled: 'Enrolled' }
    const currentIdx = stages.indexOf(myStudent?.progressStage || 'inquiry')
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.firstName}! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your application progress</p>
        </div>
        {myStudent && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Application Journey</h2>
            <div className="flex items-center gap-2">
              {stages.map((stage, idx) => (
                <div key={stage} className="flex items-center flex-1">
                  <div className={`flex flex-col items-center gap-1 flex-1`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx <= currentIdx ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                      {idx + 1}
                    </div>
                    <span className={`text-xs text-center ${idx <= currentIdx ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-400'}`}>{stageLabels[stage]}</span>
                  </div>
                  {idx < stages.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 mb-4 ${idx < currentIdx ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
              <p className="text-sm text-primary-700 dark:text-primary-300">
                <span className="font-semibold">Assigned Consultant:</span> {myStudent.consultantName} •{' '}
                <span className="font-semibold">Target:</span> {myStudent.program} at {myStudent.university || 'TBD'}
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Calendar size={16} /> Upcoming Meetings</h3>
            {upcomingMeetings.length === 0 ? <p className="text-sm text-gray-500">No upcoming meetings</p> : upcomingMeetings.map(m => (
              <div key={m.id} className="flex items-start gap-3 py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{m.title}</p>
                  <p className="text-xs text-gray-500">{new Date(m.date).toLocaleDateString()} · {m.duration}min</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Clock size={16} /> Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={() => navigate('/dashboard/documents')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
                Upload Documents <ArrowUpRight size={14} />
              </button>
              <button onClick={() => navigate('/dashboard/messages')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
                Message Consultant <ArrowUpRight size={14} />
              </button>
              <button onClick={() => navigate('/dashboard/forum')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
                Community Forum <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.firstName}! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{isAdmin ? 'Full system overview' : 'Your activity at a glance'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Clients" value={mockClients.length} icon={Users} color="bg-blue-500" onClick={() => navigate('/dashboard/clients')} />
        <StatCard label={isAdmin ? 'Total Leads' : 'My Leads'} value={myLeads.length} icon={TrendingUp} color="bg-emerald-500" onClick={() => navigate('/dashboard/leads')} />
        <StatCard label="Open Tasks" value={myTasks.filter(t => t.status !== 'done').length} icon={CheckSquare} color="bg-amber-500" onClick={() => navigate('/dashboard/tasks')} />
        {isAdmin
          ? <StatCard label="Revenue Collected" value={`$${(paidRevenue / 1000).toFixed(0)}k`} icon={DollarSign} color="bg-purple-500" onClick={() => navigate('/dashboard/analytics')} />
          : <StatCard label="Students" value={mockStudents.filter(s => s.consultantId === user?.id).length} icon={GraduationCap} color="bg-purple-500" onClick={() => navigate('/dashboard/students')} />
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Meetings</h3>
            <button onClick={() => navigate('/dashboard/meetings')} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {upcomingMeetings.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming meetings</p>
            ) : upcomingMeetings.map(m => (
              <div key={m.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar size={14} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{m.title}</p>
                  <p className="text-xs text-gray-500">{new Date(m.date).toLocaleDateString()} · {m.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Pending Tasks</h3>
            <button onClick={() => navigate('/dashboard/tasks')} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {pendingTasks.length === 0 ? (
              <p className="text-sm text-gray-500">All tasks complete!</p>
            ) : pendingTasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-300'}`} />
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">{t.title}</p>
                {t.dueDate && <span className="text-xs text-gray-400 flex-shrink-0">{new Date(t.dueDate).toLocaleDateString()}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Lead Pipeline Summary */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Pipeline Summary</h3>
            <button onClick={() => navigate('/dashboard/leads')} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {(['inquiry','qualification','proposal','negotiation'] as const).map(stage => {
              const count = myLeads.filter(l => l.stage === stage).length
              const val = myLeads.filter(l => l.stage === stage).reduce((s, l) => s + (l.value || 0), 0)
              const colors: Record<string, string> = { inquiry: 'bg-gray-400', qualification: 'bg-blue-500', proposal: 'bg-amber-500', negotiation: 'bg-emerald-500' }
              return (
                <div key={stage} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${colors[stage]}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize flex-1">{stage}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                  <span className="text-xs text-gray-400">${(val / 1000).toFixed(0)}k</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Won this period</span>
              <span className="font-semibold text-emerald-600">{myLeads.filter(l => l.stage === 'closed_won').length} deals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
