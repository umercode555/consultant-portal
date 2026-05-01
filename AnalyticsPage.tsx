import { mockAnalytics } from '../data/mockData'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, DollarSign, Users, Target, Award, ArrowDown } from 'lucide-react'

const COLORS = ['#4F6EF7', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function AnalyticsPage() {
  const data = mockAnalytics

  const statCards = [
    { label: 'Total Leads', value: data.totalLeads, icon: <Users size={20} />, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Conversions', value: data.convertedLeads, icon: <Target size={20} />, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Conversion Rate', value: `${data.conversionRate}%`, icon: <TrendingUp size={20} />, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Total Revenue', value: `$${data.totalRevenue.toLocaleString()}`, icon: <DollarSign size={20} />, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Intelligence</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Business performance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue & Leads</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v, n) => [n === 'revenue' ? `$${Number(v).toLocaleString()}` : v, n === 'revenue' ? 'Revenue' : 'Leads']} />
              <Line type="monotone" dataKey="revenue" stroke="#4F6EF7" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Conversion Funnel</h3>
          <div className="space-y-2">
            {data.funnelData.map((step, i) => (
              <div key={step.stage}>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>{step.stage}</span>
                  <span className="font-medium">{step.count}</span>
                </div>
                <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div className="h-full rounded-lg flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${(step.count / data.funnelData[0].count) * 100}%`, backgroundColor: COLORS[i] }}>
                  </div>
                </div>
                {step.dropOff > 0 && (
                  <div className="flex items-center gap-1 text-xs text-red-400 mt-0.5">
                    <ArrowDown size={10} />{step.dropOff}% drop-off
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Distribution + Consultant Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Leads by Stage</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.leadsByStage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.leadsByStage.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Consultant Leaderboard */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award size={18} className="text-amber-500" /> Consultant Leaderboard
          </h3>
          <div className="space-y-3">
            {data.consultantPerformance
              .sort((a, b) => b.revenue - a.revenue)
              .map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'
                  }`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{c.name}</p>
                      <p className="text-xs font-semibold text-emerald-600">${c.revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span>{c.leads} leads</span>
                      <span>{c.conversions} converted</span>
                      <span>⭐ {c.rating}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(c.conversions / c.leads) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Revenue by Program Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue Forecast (Next 6 Months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.monthlyRevenue.slice(-6).map((m, i) => ({ ...m, forecast: m.revenue * (1.05 + i * 0.03) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`]} />
              <Line type="monotone" dataKey="revenue" stroke="#4F6EF7" strokeWidth={2} dot={false} name="Actual" />
              <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={[
                { name: 'LinkedIn', value: 35 }, { name: 'Referral', value: 28 },
                { name: 'Website', value: 20 }, { name: 'Event', value: 10 }, { name: 'Other', value: 7 }
              ]} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                {[0,1,2,3,4].map(i => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {['LinkedIn', 'Referral', 'Website', 'Event', 'Other'].map((src, i) => (
              <div key={src} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-gray-600 dark:text-gray-400">{src}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
