import { useState } from 'react'
import { mockInvoices } from '../data/mockData'
import type { Invoice, InvoiceItem } from '../types'
import { Plus, X, Printer, DollarSign, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColor = { draft: 'bg-gray-100 text-gray-600', sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
const statusIcon = { draft: FileText, sent: Clock, paid: CheckCircle, overdue: AlertCircle }

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [filter, setFilter] = useState<'all' | Invoice['status']>('all')
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<Invoice | null>(null)
  const [form, setForm] = useState({ clientName: '', dueDate: '', notes: '' })
  const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([{ description: '', quantity: 1, rate: 0, amount: 0 }])

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter)
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const pendingRevenue = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.amount, 0)

  const updateItem = (idx: number, field: keyof Omit<InvoiceItem, 'id'>, val: string | number) => {
    setItems(its => its.map((it, i) => {
      if (i !== idx) return it
      const updated = { ...it, [field]: val }
      updated.amount = updated.quantity * updated.rate
      return updated
    }))
  }

  const total = items.reduce((s, i) => s + i.amount, 0)

  const handleCreate = () => {
    if (!form.clientName) { toast.error('Client name required'); return }
    const inv: Invoice = {
      id: `inv-${Date.now()}`, invoiceNumber: `INV-2024-00${invoices.length + 1}`,
      clientId: 'cl-1', clientName: form.clientName, consultantId: 'con-1',
      amount: total, status: 'draft', dueDate: form.dueDate, createdAt: new Date().toISOString().split('T')[0],
      items: items.map((it, i) => ({ ...it, id: `ii-${Date.now()}-${i}` })), notes: form.notes
    }
    setInvoices(is => [inv, ...is])
    setShowModal(false)
    toast.success('Invoice created')
  }

  const markPaid = (id: string) => { setInvoices(is => is.map(i => i.id === id ? { ...i, status: 'paid' } : i)); toast.success('Marked as paid') }
  const sendInvoice = (id: string) => { setInvoices(is => is.map(i => i.id === id ? { ...i, status: 'sent' } : i)); toast.success('Invoice sent') }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{invoices.length} invoices</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Create Invoice</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Revenue Collected</p>
          <p className="text-xl font-bold text-emerald-600">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Pending Payment</p>
          <p className="text-xl font-bold text-amber-600">${pendingRevenue.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Overdue</p>
          <p className="text-xl font-bold text-red-600">${invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-primary-500 text-white' : 'bg-white dark:bg-surface-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(inv => {
          const Icon = statusIcon[inv.status]
          return (
            <div key={inv.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DollarSign size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white">{inv.invoiceNumber}</p>
                      <span className={`badge ${statusColor[inv.status]}`}>
                        <Icon size={11} className="mr-1" />{inv.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{inv.clientName} · Due {new Date(inv.dueDate).toLocaleDateString()}</p>
                    {inv.items.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {inv.items.map(item => (
                          <div key={item.id} className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex-1">{item.description}</span>
                            <span>{item.quantity} × ${item.rate}</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">${item.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${inv.amount.toLocaleString()}</p>
                  <div className="flex gap-2">
                    {inv.status === 'draft' && <button onClick={() => sendInvoice(inv.id)} className="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 transition-colors">Send</button>}
                    {inv.status === 'sent' && <button onClick={() => markPaid(inv.id)} className="text-xs px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 transition-colors">Mark Paid</button>}
                    <button className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"><Printer size={11} /> Print</button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400">No invoices found</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Create Invoice</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div><label className="label">Client Name *</label><input className="input" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} /></div>
              <div><label className="label">Due Date</label><input className="input" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Line Items</label>
                <button onClick={() => setItems(its => [...its, { description: '', quantity: 1, rate: 0, amount: 0 }])} className="text-xs text-primary-600 hover:underline">+ Add item</button>
              </div>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                    <input className="input col-span-5 text-sm py-2" placeholder="Description" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} />
                    <input className="input col-span-2 text-sm py-2" type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} />
                    <input className="input col-span-2 text-sm py-2" type="number" placeholder="Rate" value={item.rate} onChange={e => updateItem(idx, 'rate', Number(e.target.value))} />
                    <div className="col-span-2 px-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">${item.amount.toLocaleString()}</div>
                    {items.length > 1 && <button onClick={() => setItems(its => its.filter((_, i) => i !== idx))} className="col-span-1 text-gray-400 hover:text-red-500"><X size={14} /></button>}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Total: ${total.toLocaleString()}</div>
              </div>
            </div>
            <div className="mb-5"><label className="label">Notes</label><textarea className="input h-16 resize-none" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleCreate} className="btn-primary flex-1">Create Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
