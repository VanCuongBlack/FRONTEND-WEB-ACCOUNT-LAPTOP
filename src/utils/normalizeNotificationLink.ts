export function normalizeNotificationLink(link?: string | null, role?: string | null) {
  if (!link) return null

  const url = link.startsWith('http') ? new URL(link).pathname : link
  const staffLike = role === 'admin' || role === 'staff'

  const supportManageMatch = url.match(/^\/support\/manage\/tickets\/([^/?#]+)/)
  if (supportManageMatch) {
    return staffLike ? `/staff/tickets?ticketId=${supportManageMatch[1]}` : '/notification'
  }

  const supportMatch = url.match(/^\/support\/tickets\/([^/?#]+)/)
  if (supportMatch) {
    return staffLike ? `/staff/tickets?ticketId=${supportMatch[1]}` : `/profile/support/${supportMatch[1]}`
  }

  const orderMatch = url.match(/^\/orders\/([^/?#]+)/)
  if (orderMatch) {
    return staffLike ? `/staff/orders?orderId=${orderMatch[1]}` : `/profile/history/${orderMatch[1]}`
  }

  return url
}
