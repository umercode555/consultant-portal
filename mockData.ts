import type { Client, Lead, Meeting, Task, Document, Message, Conversation, ForumPost, Invoice, EmailTemplate, Campaign, Automation, Notification, Student, AnalyticsData, User } from '../types'

// USERS
export const mockUsers: User[] = [
  { id: 'admin-1', email: 'admin@consulthub.com', firstName: 'Sarah', lastName: 'Ahmed', role: 'admin', phone: '+1 555-0100' },
  { id: 'con-1', email: 'john@consulthub.com', firstName: 'John', lastName: 'Smith', role: 'consultant', phone: '+1 555-0101' },
  { id: 'con-2', email: 'priya@consulthub.com', firstName: 'Priya', lastName: 'Sharma', role: 'consultant', phone: '+1 555-0102' },
  { id: 'stu-1', email: 'ali@student.com', firstName: 'Ali', lastName: 'Hassan', role: 'student', phone: '+92 300-1234567' },
  { id: 'stu-2', email: 'fatima@student.com', firstName: 'Fatima', lastName: 'Khan', role: 'student', phone: '+92 300-7654321' },
]

// CLIENTS
export const mockClients: Client[] = [
  { id: 'cl-1', name: 'Ahmed Enterprises', email: 'ahmed@enterprise.com', phone: '+1 555-2001', company: 'Ahmed Enterprises', status: 'active', consultantId: 'con-1', createdAt: '2024-01-15', country: 'UAE', notes: 'Premium client, prefers email communication' },
  { id: 'cl-2', name: 'Global Solutions Ltd', email: 'contact@globalsol.com', phone: '+44 20-1234567', company: 'Global Solutions', status: 'active', consultantId: 'con-1', createdAt: '2024-02-10', country: 'UK' },
  { id: 'cl-3', name: 'TechVentures Inc', email: 'info@techventures.io', phone: '+1 555-3003', company: 'TechVentures', status: 'prospect', consultantId: 'con-2', createdAt: '2024-03-05', country: 'USA' },
  { id: 'cl-4', name: 'Nexus Consulting', email: 'hello@nexus.co', phone: '+61 2-9876543', company: 'Nexus Co', status: 'inactive', consultantId: 'con-2', createdAt: '2024-01-28', country: 'Australia' },
  { id: 'cl-5', name: 'Falcon Group', email: 'bd@falcon.ae', phone: '+971 50-1234567', company: 'Falcon Group', status: 'active', consultantId: 'con-1', createdAt: '2024-04-01', country: 'UAE' },
]

// LEADS
export const mockLeads: Lead[] = [
  { id: 'ld-1', name: 'Zara Investments', email: 'zara@invest.com', phone: '+1 555-4001', stage: 'qualification', value: 15000, source: 'LinkedIn', consultantId: 'con-1', createdAt: '2024-04-10', priority: 'high', notes: 'Interested in MBA consultation package' },
  { id: 'ld-2', name: 'Star Education', email: 'info@stared.com', phone: '+44 20-9999', stage: 'proposal', value: 8500, source: 'Referral', consultantId: 'con-1', createdAt: '2024-04-12', priority: 'medium' },
  { id: 'ld-3', name: 'Bright Futures LLC', email: 'contact@bright.co', stage: 'inquiry', value: 5000, source: 'Website', consultantId: 'con-2', createdAt: '2024-04-15', priority: 'low' },
  { id: 'ld-4', name: 'Premier Consultancy', email: 'hello@premier.io', stage: 'negotiation', value: 22000, source: 'Cold Outreach', consultantId: 'con-1', createdAt: '2024-03-20', priority: 'high' },
  { id: 'ld-5', name: 'EduPath Solutions', email: 'bd@edupath.com', stage: 'closed_won', value: 12000, source: 'Event', consultantId: 'con-2', createdAt: '2024-03-01', priority: 'medium' },
  { id: 'ld-6', name: 'Vision Academy', email: 'admin@vision.edu', stage: 'closed_lost', value: 7000, source: 'Website', consultantId: 'con-2', createdAt: '2024-02-15', priority: 'low' },
  { id: 'ld-7', name: 'Global Study Hub', email: 'info@gsh.com', stage: 'qualification', value: 9500, source: 'LinkedIn', consultantId: 'con-1', createdAt: '2024-04-18', priority: 'medium' },
  { id: 'ld-8', name: 'Elite Education', email: 'contact@elite.co', stage: 'proposal', value: 18000, source: 'Referral', consultantId: 'con-2', createdAt: '2024-04-20', priority: 'high' },
]

// MEETINGS
export const mockMeetings: Meeting[] = [
  { id: 'mt-1', title: 'Initial Consultation - Zara Investments', clientId: 'cl-1', consultantId: 'con-1', date: '2024-05-15T10:00:00', duration: 60, type: 'online', notes: 'Discussed MBA programs in UK and Canada. Client very interested in top 20 universities.', actionItems: ['Send program brochures', 'Schedule follow-up call', 'Prepare cost breakdown'], followUpDate: '2024-05-22', status: 'completed' },
  { id: 'mt-2', title: 'Progress Review - Ali Hassan', studentId: 'stu-1', consultantId: 'con-1', date: '2024-05-18T14:00:00', duration: 45, type: 'online', notes: 'Reviewed SOP draft. Good progress on application materials.', actionItems: ['Revise SOP intro paragraph', 'Get 2 more recommendation letters'], status: 'completed' },
  { id: 'mt-3', title: 'Document Review Meeting', clientId: 'cl-2', consultantId: 'con-2', date: '2024-05-25T11:00:00', duration: 30, type: 'phone', status: 'scheduled' },
  { id: 'mt-4', title: 'Strategy Session - Falcon Group', clientId: 'cl-5', consultantId: 'con-1', date: '2024-05-28T15:00:00', duration: 90, type: 'in-person', status: 'scheduled' },
  { id: 'mt-5', title: 'Application Strategy - Fatima Khan', studentId: 'stu-2', consultantId: 'con-2', date: '2024-05-30T09:00:00', duration: 60, type: 'online', status: 'scheduled' },
]

// TASKS
export const mockTasks: Task[] = [
  { id: 'tk-1', title: 'Send program brochures to Zara Investments', description: 'Email MBA and Masters program brochures for UK universities', dueDate: '2024-05-20', priority: 'high', status: 'todo', assignedTo: 'con-1', clientId: 'cl-1', createdAt: '2024-05-15' },
  { id: 'tk-2', title: 'Review Ali Hassan SOP draft', description: 'Give detailed feedback on Statement of Purpose', dueDate: '2024-05-22', priority: 'high', status: 'in_progress', assignedTo: 'con-1', createdAt: '2024-05-18' },
  { id: 'tk-3', title: 'Prepare proposal for Premier Consultancy', dueDate: '2024-05-25', priority: 'high', status: 'todo', assignedTo: 'con-1', createdAt: '2024-05-19' },
  { id: 'tk-4', title: 'Follow up with Bright Futures LLC', dueDate: '2024-05-21', priority: 'medium', status: 'done', assignedTo: 'con-2', createdAt: '2024-05-14' },
  { id: 'tk-5', title: 'Update CRM with new lead data', dueDate: '2024-05-23', priority: 'low', status: 'todo', assignedTo: 'admin-1', createdAt: '2024-05-20' },
  { id: 'tk-6', title: 'Prepare Fatima Khan university shortlist', dueDate: '2024-05-28', priority: 'medium', status: 'in_progress', assignedTo: 'con-2', createdAt: '2024-05-18' },
  { id: 'tk-7', title: 'Invoice follow-up - Global Solutions', dueDate: '2024-05-19', priority: 'high', status: 'done', assignedTo: 'con-1', clientId: 'cl-2', createdAt: '2024-05-12' },
]

// DOCUMENTS
export const mockDocuments: Document[] = [
  { id: 'dc-1', name: 'Ali_Hassan_CV_2024.pdf', type: 'application/pdf', size: 245678, url: '#', uploadedBy: 'stu-1', uploadedAt: '2024-05-10', studentId: 'stu-1', category: 'cv', status: 'approved' },
  { id: 'dc-2', name: 'Ali_Hassan_SOP_Draft.docx', type: 'application/docx', size: 89012, url: '#', uploadedBy: 'stu-1', uploadedAt: '2024-05-18', studentId: 'stu-1', category: 'application', status: 'pending' },
  { id: 'dc-3', name: 'Fatima_Khan_CV.pdf', type: 'application/pdf', size: 312445, url: '#', uploadedBy: 'stu-2', uploadedAt: '2024-05-12', studentId: 'stu-2', category: 'cv', status: 'approved' },
  { id: 'dc-4', name: 'Ahmed_Enterprises_Contract.pdf', type: 'application/pdf', size: 456789, url: '#', uploadedBy: 'con-1', uploadedAt: '2024-04-20', clientId: 'cl-1', category: 'contract', status: 'approved' },
  { id: 'dc-5', name: 'Q1_Performance_Report.pdf', type: 'application/pdf', size: 789012, url: '#', uploadedBy: 'admin-1', uploadedAt: '2024-04-01', category: 'report' },
  { id: 'dc-6', name: 'Fatima_Recommendation_Letter.pdf', type: 'application/pdf', size: 123456, url: '#', uploadedBy: 'stu-2', uploadedAt: '2024-05-20', studentId: 'stu-2', category: 'application', status: 'pending' },
]

// MESSAGES
export const mockConversations: Conversation[] = [
  { id: 'cv-1', participantId: 'stu-1', participantName: 'Ali Hassan', participantRole: 'student', lastMessage: 'Thank you for reviewing my SOP!', lastMessageAt: '2024-05-18T15:30:00', unreadCount: 2 },
  { id: 'cv-2', participantId: 'stu-2', participantName: 'Fatima Khan', participantRole: 'student', lastMessage: 'When is our next session?', lastMessageAt: '2024-05-20T10:15:00', unreadCount: 0 },
  { id: 'cv-3', participantId: 'con-2', participantName: 'Priya Sharma', participantRole: 'consultant', lastMessage: 'I forwarded the lead details', lastMessageAt: '2024-05-19T14:00:00', unreadCount: 1 },
]

export const mockMessages: Record<string, Message[]> = {
  'cv-1': [
    { id: 'm-1', senderId: 'con-1', receiverId: 'stu-1', content: 'Hi Ali! I reviewed your SOP draft. Great start!', createdAt: '2024-05-18T14:00:00', read: true },
    { id: 'm-2', senderId: 'stu-1', receiverId: 'con-1', content: 'Thank you so much! What should I improve?', createdAt: '2024-05-18T14:30:00', read: true },
    { id: 'm-3', senderId: 'con-1', receiverId: 'stu-1', content: 'Focus on your motivation paragraph. Make it more specific to your target university.', createdAt: '2024-05-18T15:00:00', read: true },
    { id: 'm-4', senderId: 'stu-1', receiverId: 'con-1', content: 'Thank you for reviewing my SOP!', createdAt: '2024-05-18T15:30:00', read: false },
    { id: 'm-5', senderId: 'stu-1', receiverId: 'con-1', content: 'I will revise it and send again.', createdAt: '2024-05-18T15:31:00', read: false },
  ]
}

// FORUM POSTS
export const mockForumPosts: ForumPost[] = [
  {
    id: 'fp-1',
    authorId: 'stu-1',
    authorName: 'Ali Hassan',
    authorRole: 'student',
    title: 'Tips for writing a strong SOP for UK universities?',
    content: 'I am applying to several UK universities for my Masters. Any advice on making my Statement of Purpose stand out? I have 2 years of work experience in finance.',
    category: 'Application Tips',
    likes: 12,
    replies: [
      { id: 'r-1', authorId: 'stu-2', authorName: 'Fatima Khan', content: 'Focus on why that specific university and program. Research their faculty and mention specific professors!', createdAt: '2024-05-16T10:00:00', likes: 5 },
      { id: 'r-2', authorId: 'con-1', authorName: 'John Smith', content: 'Great advice above! Also connect your work experience to your future goals. Admissions committees love a clear narrative.', createdAt: '2024-05-16T11:00:00', likes: 8 },
    ],
    createdAt: '2024-05-15T09:00:00',
    pinned: false
  },
  {
    id: 'fp-2',
    authorId: 'stu-2',
    authorName: 'Fatima Khan',
    authorRole: 'student',
    title: 'IELTS vs TOEFL - which to choose for Canadian universities?',
    content: 'Most Canadian universities accept both. I have taken IELTS before and scored 7.0. Is it worth retaking for a higher score or should I try TOEFL?',
    category: 'Test Prep',
    likes: 8,
    replies: [
      { id: 'r-3', authorId: 'stu-1', authorName: 'Ali Hassan', content: 'IELTS is generally more accepted globally. 7.0 should be fine for most programs!', createdAt: '2024-05-18T12:00:00', likes: 3 },
    ],
    createdAt: '2024-05-17T14:00:00',
    pinned: true
  },
  {
    id: 'fp-3',
    authorId: 'con-2',
    authorName: 'Priya Sharma',
    authorRole: 'consultant',
    title: '📌 Application deadlines tracker - 2024 intake',
    content: 'Pinning this for everyone to reference. Key deadlines:\n- Oxford: Jan 15\n- Cambridge: Dec 1\n- Toronto: Feb 1\n- Melbourne: Mar 31\nReply below if you need any specific university deadlines!',
    category: 'Resources',
    likes: 24,
    replies: [],
    createdAt: '2024-05-01T08:00:00',
    pinned: true
  },
]

// INVOICES
export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    clientId: 'cl-1',
    clientName: 'Ahmed Enterprises',
    consultantId: 'con-1',
    amount: 5500,
    status: 'paid',
    dueDate: '2024-04-30',
    createdAt: '2024-04-01',
    items: [
      { id: 'ii-1', description: 'University Application Consultation (5 universities)', quantity: 5, rate: 800, amount: 4000 },
      { id: 'ii-2', description: 'SOP Review & Editing', quantity: 1, rate: 1500, amount: 1500 },
    ],
    notes: 'Thank you for your business!'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2024-002',
    clientId: 'cl-2',
    clientName: 'Global Solutions Ltd',
    consultantId: 'con-1',
    amount: 3200,
    status: 'sent',
    dueDate: '2024-05-31',
    createdAt: '2024-05-01',
    items: [
      { id: 'ii-3', description: 'Visa Application Support', quantity: 2, rate: 1200, amount: 2400 },
      { id: 'ii-4', description: 'Document Attestation', quantity: 1, rate: 800, amount: 800 },
    ]
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2024-003',
    clientId: 'cl-5',
    clientName: 'Falcon Group',
    consultantId: 'con-1',
    amount: 8900,
    status: 'overdue',
    dueDate: '2024-05-10',
    createdAt: '2024-04-10',
    items: [
      { id: 'ii-5', description: 'Corporate Training Program', quantity: 1, rate: 8900, amount: 8900 },
    ]
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2024-004',
    clientId: 'cl-3',
    clientName: 'TechVentures Inc',
    consultantId: 'con-2',
    amount: 2500,
    status: 'draft',
    dueDate: '2024-06-15',
    createdAt: '2024-05-20',
    items: [
      { id: 'ii-6', description: 'Initial Consultation Package', quantity: 1, rate: 2500, amount: 2500 },
    ]
  },
]

// EMAIL TEMPLATES
export const mockEmailTemplates: EmailTemplate[] = [
  { id: 'et-1', name: 'Welcome Email', subject: 'Welcome to ConsultHub — Let\'s start your journey!', body: 'Dear {{first_name}},\n\nWelcome to ConsultHub! We are thrilled to have you on board.\n\nYour dedicated consultant {{consultant_name}} will reach out within 24 hours to schedule your first session.\n\nBest regards,\nThe ConsultHub Team', category: 'Onboarding', createdAt: '2024-01-01' },
  { id: 'et-2', name: 'Follow-up After Meeting', subject: 'Great meeting you, {{first_name}}!', body: 'Dear {{first_name}},\n\nThank you for meeting with us today. As discussed:\n\n{{meeting_summary}}\n\nNext steps:\n{{action_items}}\n\nPlease don\'t hesitate to reach out if you have any questions.\n\nBest regards,\n{{consultant_name}}', category: 'Follow-up', createdAt: '2024-01-05' },
  { id: 'et-3', name: 'Application Deadline Reminder', subject: '⚠️ Deadline approaching: {{university}} application closes soon', body: 'Dear {{first_name}},\n\nThis is a friendly reminder that your application for {{university}} closes on {{deadline_date}}.\n\nPlease ensure you have submitted all required documents:\n- Statement of Purpose ✓\n- Recommendation Letters ({{rec_count}}/3)\n- Transcripts\n- Test Scores\n\nLog in to your portal to check status.\n\nBest,\n{{consultant_name}}', category: 'Reminders', createdAt: '2024-01-10' },
  { id: 'et-4', name: 'Invoice Sent', subject: 'Invoice #{{invoice_number}} from ConsultHub', body: 'Dear {{client_name}},\n\nPlease find attached Invoice #{{invoice_number}} for {{amount}} due on {{due_date}}.\n\nPayment methods accepted: Bank Transfer, Credit Card, PayPal\n\nThank you for your business!\n\nConsultHub Finance Team', category: 'Billing', createdAt: '2024-01-15' },
  { id: 'et-5', name: 'Offer Congratulations', subject: '🎉 Congratulations {{first_name}} — Offer received!', body: 'Dear {{first_name}},\n\nWonderful news! You have received an offer from {{university}}!\n\nOffer details:\n- Program: {{program}}\n- Start Date: {{start_date}}\n- Scholarship: {{scholarship}}\n\nPlease review the offer letter and let us know your decision by {{response_deadline}}.\n\nCongratulations again!\n{{consultant_name}}', category: 'Student Updates', createdAt: '2024-02-01' },
]

// CAMPAIGNS
export const mockCampaigns: Campaign[] = [
  {
    id: 'cm-1',
    name: 'New Student Onboarding Drip',
    type: 'drip',
    status: 'active',
    targetSegment: 'New Students',
    sentCount: 45,
    openRate: 68,
    emails: [
      { id: 'de-1', subject: 'Welcome to ConsultHub!', body: 'Welcome email content...', delayDays: 0 },
      { id: 'de-2', subject: 'Your first steps', body: 'Getting started guide...', delayDays: 3 },
      { id: 'de-3', subject: 'How can we help?', body: 'Check-in email...', delayDays: 7 },
    ],
    createdAt: '2024-03-01'
  },
  {
    id: 'cm-2',
    name: 'May Application Deadline Broadcast',
    type: 'broadcast',
    status: 'completed',
    targetSegment: 'All Students',
    sentCount: 120,
    openRate: 74,
    emails: [
      { id: 'de-4', subject: 'Important: Application deadlines this month', body: 'Deadline reminder...', delayDays: 0 },
    ],
    createdAt: '2024-05-01'
  },
  {
    id: 'cm-3',
    name: 'Lead Re-engagement Campaign',
    type: 'drip',
    status: 'draft',
    targetSegment: 'Cold Leads (90+ days)',
    sentCount: 0,
    openRate: 0,
    emails: [
      { id: 'de-5', subject: 'We miss you! Here\'s what\'s new', body: 'Re-engagement content...', delayDays: 0 },
      { id: 'de-6', subject: 'Special offer for returning clients', body: 'Offer content...', delayDays: 7 },
    ],
    createdAt: '2024-05-20'
  },
]

// AUTOMATIONS
export const mockAutomations: Automation[] = [
  {
    id: 'au-1',
    name: 'New Lead Welcome',
    trigger: 'lead_created',
    conditions: [],
    actions: [
      { type: 'send_email', config: { template: 'welcome', delay: '0' } },
      { type: 'create_task', config: { title: 'Follow up with new lead', assignTo: 'consultant', dueInDays: '1' } },
    ],
    status: 'active',
    runCount: 34,
    createdAt: '2024-02-01'
  },
  {
    id: 'au-2',
    name: 'Lead Stage: Proposal → Send Proposal Email',
    trigger: 'lead_stage_changed',
    conditions: [{ field: 'new_stage', operator: 'equals', value: 'proposal' }],
    actions: [
      { type: 'send_email', config: { template: 'proposal', delay: '0' } },
    ],
    status: 'active',
    runCount: 12,
    createdAt: '2024-02-15'
  },
  {
    id: 'au-3',
    name: 'Auto-assign Student to Consultant',
    trigger: 'student_registered',
    conditions: [],
    actions: [
      { type: 'assign_consultant', config: { method: 'round_robin' } },
      { type: 'send_notification', config: { message: 'New student assigned to you' } },
    ],
    status: 'active',
    runCount: 28,
    createdAt: '2024-03-01'
  },
  {
    id: 'au-4',
    name: 'Invoice Overdue Reminder',
    trigger: 'invoice_overdue',
    conditions: [],
    actions: [
      { type: 'send_email', config: { template: 'invoice_reminder', delay: '0' } },
      { type: 'create_task', config: { title: 'Follow up on overdue invoice', assignTo: 'consultant', dueInDays: '0' } },
    ],
    status: 'active',
    runCount: 5,
    createdAt: '2024-03-10'
  },
  {
    id: 'au-5',
    name: '7-Day No Response Follow-up',
    trigger: 'lead_inactive',
    conditions: [{ field: 'days_inactive', operator: 'greater_than', value: '7' }],
    actions: [
      { type: 'send_email', config: { template: 'follow_up', delay: '0' } },
    ],
    status: 'inactive',
    runCount: 0,
    createdAt: '2024-04-01'
  },
]

// NOTIFICATIONS
export const mockNotifications: Notification[] = [
  { id: 'nt-1', userId: 'con-1', title: 'New message', message: 'Ali Hassan sent you a message', type: 'info', isRead: false, createdAt: '2024-05-18T15:30:00', link: '/dashboard/messages' },
  { id: 'nt-2', userId: 'con-1', title: 'Meeting reminder', message: 'You have a meeting with Falcon Group in 1 hour', type: 'warning', isRead: false, createdAt: '2024-05-28T14:00:00' },
  { id: 'nt-3', userId: 'con-1', title: 'Invoice overdue', message: 'Invoice INV-2024-003 is overdue by 18 days', type: 'error', isRead: true, createdAt: '2024-05-28T08:00:00', link: '/dashboard/invoices' },
  { id: 'nt-4', userId: 'admin-1', title: 'New user registered', message: 'Priya Sharma has registered as a consultant', type: 'success', isRead: false, createdAt: '2024-05-15T09:00:00' },
]

// STUDENTS
export const mockStudents: Student[] = [
  { id: 'st-1', userId: 'stu-1', firstName: 'Ali', lastName: 'Hassan', email: 'ali@student.com', phone: '+92 300-1234567', consultantId: 'con-1', consultantName: 'John Smith', status: 'active', program: 'MSc Finance', university: 'University of Manchester', country: 'UK', progressStage: 'application', createdAt: '2024-02-15', notes: 'Very motivated student. Strong academic background in finance.' },
  { id: 'st-2', userId: 'stu-2', firstName: 'Fatima', lastName: 'Khan', email: 'fatima@student.com', phone: '+92 300-7654321', consultantId: 'con-2', consultantName: 'Priya Sharma', status: 'active', program: 'MBA', university: 'University of Toronto', country: 'Canada', progressStage: 'document_prep', createdAt: '2024-03-01', notes: 'GMAT score: 720. Looking at top 10 MBA programs.' },
  { id: 'st-3', userId: 'stu-3', firstName: 'Omar', lastName: 'Mahmoud', email: 'omar@student.com', consultantId: 'con-1', consultantName: 'John Smith', status: 'active', program: 'BSc Computer Science', country: 'USA', progressStage: 'offer', createdAt: '2024-01-10' },
]

// ANALYTICS
export const mockAnalytics: AnalyticsData = {
  totalLeads: 47,
  convertedLeads: 12,
  conversionRate: 25.5,
  totalRevenue: 142500,
  monthlyRevenue: [
    { month: 'Jan', revenue: 18500, leads: 8 },
    { month: 'Feb', revenue: 22000, leads: 11 },
    { month: 'Mar', revenue: 15800, leads: 7 },
    { month: 'Apr', revenue: 31200, leads: 13 },
    { month: 'May', revenue: 28400, leads: 10 },
    { month: 'Jun', revenue: 26600, leads: 9 },
  ],
  leadsByStage: [
    { stage: 'Inquiry', count: 14, value: 62000 },
    { stage: 'Qualification', count: 11, value: 89500 },
    { stage: 'Proposal', count: 8, value: 124000 },
    { stage: 'Negotiation', count: 4, value: 88000 },
    { stage: 'Won', count: 7, value: 156000 },
    { stage: 'Lost', count: 3, value: 0 },
  ],
  consultantPerformance: [
    { id: 'con-1', name: 'John Smith', leads: 28, conversions: 8, revenue: 92000, rating: 4.8 },
    { id: 'con-2', name: 'Priya Sharma', leads: 19, conversions: 4, revenue: 50500, rating: 4.6 },
  ],
  funnelData: [
    { stage: 'Visitor', count: 1240, dropOff: 0 },
    { stage: 'Inquiry', count: 380, dropOff: 69 },
    { stage: 'Qualified Lead', count: 140, dropOff: 63 },
    { stage: 'Proposal', count: 68, dropOff: 51 },
    { stage: 'Negotiation', count: 28, dropOff: 59 },
    { stage: 'Client', count: 12, dropOff: 57 },
  ]
}
