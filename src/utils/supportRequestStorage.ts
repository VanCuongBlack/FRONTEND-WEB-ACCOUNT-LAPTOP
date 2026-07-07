export type SupportRequestStatus = 'pending' | 'in_progress' | 'responded'
export type SupportIssueType = 'account' | 'laptop'

export interface SupportRequestAttachment {
  name: string
  type: string
  isVideo: boolean
  previewUrl?: string
}

function looksLikeDirectMediaSource(value: string): boolean {
  return /^(https?:\/\/|\/|blob:|data:)/.test(value)
}

function isVideoByNameOrType(name: string, type: string): boolean {
  if (type.startsWith('video/')) {
    return true
  }
  return /\.(mp4|webm|ogg|mov|mkv|avi)$/i.test(name)
}

function normalizeAttachment(rawAttachment: unknown): SupportRequestAttachment | null {
  if (!rawAttachment) {
    return null
  }

  if (typeof rawAttachment === 'string') {
    const normalizedName = rawAttachment.trim() || 'Tệp đính kèm'
    const isVideo = isVideoByNameOrType(normalizedName, '')
    return {
      name: normalizedName,
      type: isVideo ? 'video/*' : 'image/*',
      isVideo,
      previewUrl: looksLikeDirectMediaSource(normalizedName) ? normalizedName : undefined,
    }
  }

  if (typeof rawAttachment !== 'object') {
    return null
  }

  const attachment = rawAttachment as Record<string, unknown>
  const rawName = String(attachment.name ?? attachment.fileName ?? attachment.title ?? '').trim()
  const rawType = String(attachment.type ?? attachment.mimeType ?? '').trim()

  const previewCandidates = [
    attachment.previewUrl,
    attachment.url,
    attachment.src,
    attachment.path,
    attachment.fileUrl,
    attachment.dataUrl,
    attachment.objectUrl,
  ]
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)

  const inferredPreviewUrl =
    previewCandidates.find((candidate) => looksLikeDirectMediaSource(candidate)) ||
    (looksLikeDirectMediaSource(rawName) ? rawName : undefined)

  const inferredIsVideo =
    typeof attachment.isVideo === 'boolean'
      ? attachment.isVideo
      : isVideoByNameOrType(rawName, rawType)

  return {
    name: rawName || (inferredIsVideo ? 'Video đính kèm' : 'Hình ảnh đính kèm'),
    type: rawType || (inferredIsVideo ? 'video/*' : 'image/*'),
    isVideo: inferredIsVideo,
    previewUrl: inferredPreviewUrl,
  }
}

export interface SupportRequestTicket {
  id: string
  orderCode: string
  productName: string
  contactInfo: string
  issueType: SupportIssueType
  description: string
  attachments: SupportRequestAttachment[]
  status: SupportRequestStatus
  createdAt: string
  assignedTechName?: string
  staffResponse?: string
  staffResponderName?: string
  respondedAt?: string
}

export const SUPPORT_REQUESTS_STORAGE_KEY = 'supportRequests'

const DEMO_REQUESTS: SupportRequestTicket[] = [
  {
    id: 'TK-88219',
    orderCode: 'ACC-20260513',
    productName: 'Dell Gaming G15',
    contactInfo: '0909xxxxxx',
    issueType: 'laptop',
    description:
      'Khách hàng phản hồi phím bị kẹt cơ và lỗi kết nối cổng HDMI. Cần kỹ thuật viên hỗ trợ kiểm tra chi tiết.',
    attachments: [],
    status: 'in_progress',
    createdAt: '2026-06-09T14:30:00.000Z',
    staffResponse: '',
    staffResponderName: '',
  },
]

function safeRead(): SupportRequestTicket[] {
  if (typeof window === 'undefined') {
    return [...DEMO_REQUESTS]
  }

  try {
    const raw = localStorage.getItem(SUPPORT_REQUESTS_STORAGE_KEY)
    if (!raw) {
      return [...DEMO_REQUESTS]
    }

    const parsed = JSON.parse(raw) as SupportRequestTicket[]
    if (!Array.isArray(parsed)) {
      return [...DEMO_REQUESTS]
    }

    return parsed.map((ticket) => ({
      ...ticket,
      productName:
        ticket.productName?.trim() ||
        (ticket.issueType === 'account' ? 'Tài khoản số cần hỗ trợ' : 'Laptop/Pc cần hỗ trợ'),
      attachments: Array.isArray(ticket.attachments)
        ? ticket.attachments
            .map((attachment) => normalizeAttachment(attachment))
            .filter((attachment): attachment is SupportRequestAttachment => Boolean(attachment))
        : [],
    }))
  } catch {
    return [...DEMO_REQUESTS]
  }
}

function safeWrite(tickets: SupportRequestTicket[]) {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(SUPPORT_REQUESTS_STORAGE_KEY, JSON.stringify(tickets))
}

export function getStoredSupportRequests(): SupportRequestTicket[] {
  return safeRead().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

export function createSupportRequestTicket(
  payload: Omit<SupportRequestTicket, 'id' | 'status' | 'createdAt'>
): SupportRequestTicket {
  const newTicket: SupportRequestTicket = {
    id: `TK-${Date.now().toString().slice(-6)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...payload,
  }

  const currentTickets = safeRead()
  safeWrite([newTicket, ...currentTickets])

  return newTicket
}

export function findSupportRequestById(ticketId: string): SupportRequestTicket | null {
  const tickets = safeRead()
  return tickets.find((ticket) => ticket.id === ticketId) ?? null
}

export function updateSupportRequestResponse(
  ticketId: string,
  response: string,
  responderName: string,
  assignedTechName?: string
): SupportRequestTicket | null {
  const normalizedResponse = response.trim()
  const normalizedResponder = responderName.trim() || 'Nhân viên hỗ trợ'
  const normalizedAssignedTech = assignedTechName?.trim() || undefined
  let updatedTicket: SupportRequestTicket | null = null

  const updatedTickets = safeRead().map((ticket) => {
    if (ticket.id !== ticketId) {
      return ticket
    }

    const nextTicket: SupportRequestTicket = {
      ...ticket,
      staffResponse: normalizedResponse,
      staffResponderName: normalizedResponder,
      assignedTechName: normalizedAssignedTech,
      respondedAt: new Date().toISOString(),
      status: normalizedResponse ? 'responded' : 'in_progress',
    }
    updatedTicket = nextTicket
    return nextTicket
  })

  if (!updatedTicket) {
    return null
  }

  safeWrite(updatedTickets)
  return updatedTicket
}

export function updateSupportRequestAttachment(
  ticketId: string,
  attachmentIndex: number,
  nextAttachment: SupportRequestAttachment
): SupportRequestTicket | null {
  if (attachmentIndex < 0) {
    return null
  }

  let updatedTicket: SupportRequestTicket | null = null

  const updatedTickets = safeRead().map((ticket) => {
    if (ticket.id !== ticketId) {
      return ticket
    }

    if (!Array.isArray(ticket.attachments) || attachmentIndex >= ticket.attachments.length) {
      updatedTicket = ticket
      return ticket
    }

    const nextAttachments = [...ticket.attachments]
    nextAttachments[attachmentIndex] = nextAttachment

    const nextTicket: SupportRequestTicket = {
      ...ticket,
      attachments: nextAttachments,
    }
    updatedTicket = nextTicket
    return nextTicket
  })

  if (!updatedTicket) {
    return null
  }

  safeWrite(updatedTickets)
  return updatedTicket
}
