export type Role = 'admin' | 'consultant' | 'student'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  avatarUrl?: string
  phone?: string
  department?: string
  createdAt?: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: 'active' | 'inactive' | 'prospect'
  consultantId?: string
  createdAt: string
  notes?: string
  country?: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  stage: 'inquiry' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  value?: number
  source?: string
  consultantId?: string
  createdAt: string
  notes?: string
  priority: 'low' | 'medium' | 'high'
}

export interface Meeting {
  id: string
  title: string
  clientId?: string
  studentId?: string
  consultantId: string
  date: string
  duration: number
  type: 'online' | 'in-person' | 'phone'
  notes?: string
  actionItems?: string[]
  followUpDate?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in_progress' | 'done'
  assignedTo?: string
  clientId?: string
  createdAt: string
}

export interface Document {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedBy: string
  uploadedAt: string
  studentId?: string
  clientId?: string
  category: 'cv' | 'application' | 'contract' | 'report' | 'other'
  status?: 'pending' | 'approved' | 'rejected'
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  read: boolean
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantRole: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

export interface ForumPost {
  id: string
  authorId: string
  authorName: string
  authorRole: string
  title: string
  content: string
  category: string
  likes: number
  replies: ForumReply[]
  createdAt: string
  pinned?: boolean
}

export interface ForumReply {
  id: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
  likes: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  clientName: string
  consultantId: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  dueDate: string
  createdAt: string
  items: InvoiceItem[]
  notes?: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: string
  createdAt: string
}

export interface Campaign {
  id: string
  name: string
  type: 'drip' | 'broadcast'
  status: 'draft' | 'active' | 'paused' | 'completed'
  targetSegment: string
  emails: DriplEmail[]
  createdAt: string
  sentCount?: number
  openRate?: number
}

export interface DriplEmail {
  id: string
  subject: string
  body: string
  delayDays: number
}

export interface Automation {
  id: string
  name: string
  trigger: string
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  status: 'active' | 'inactive'
  createdAt: string
  runCount?: number
}

export interface AutomationCondition {
  field: string
  operator: string
  value: string
}

export interface AutomationAction {
  type: 'send_email' | 'create_task' | 'move_stage' | 'assign_consultant' | 'send_notification'
  config: Record<string, string>
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
  link?: string
}

export interface Student {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  consultantId?: string
  consultantName?: string
  status: 'active' | 'inactive' | 'graduated'
  program?: string
  university?: string
  country?: string
  progressStage: 'inquiry' | 'document_prep' | 'application' | 'offer' | 'enrolled'
  createdAt: string
  notes?: string
}

export interface AnalyticsData {
  totalLeads: number
  convertedLeads: number
  conversionRate: number
  totalRevenue: number
  monthlyRevenue: MonthlyRevenue[]
  leadsByStage: StageData[]
  consultantPerformance: ConsultantPerf[]
  funnelData: FunnelStep[]
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  leads: number
}

export interface StageData {
  stage: string
  count: number
  value: number
}

export interface ConsultantPerf {
  id: string
  name: string
  leads: number
  conversions: number
  revenue: number
  rating: number
}

export interface FunnelStep {
  stage: string
  count: number
  dropOff: number
}
