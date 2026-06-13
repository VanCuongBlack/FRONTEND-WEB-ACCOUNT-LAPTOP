import { type ChangeEvent, useEffect, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  findSupportRequestById,
  type SupportRequestStatus,
  type SupportRequestTicket,
  updateSupportRequestAttachment,
} from '@/utils/supportRequestStorage'
import {
  getTicketMediaObjectUrls,
  resolveAttachmentPreviewSource,
  revokeMediaObjectUrls,
  saveTicketMediaFiles,
} from '@/utils/supportRequestMediaStorage'

const statusLabelMap: Record<SupportRequestStatus, string> = {
  pending: 'Chờ tiếp nhận',
  in_progress: 'Đang xử lý',
  responded: 'Đã xử lý',
}

const issueTypeLabelMap = {
  account: 'Account',
  laptop: 'Laptop/PC',
} as const

function formatDateTime(isoString: string) {
  return new Date(isoString).toLocaleString('vi-VN')
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('Không đọc được file đã chọn'))
    }
    reader.onerror = () => reject(new Error('Không đọc được file đã chọn'))
    reader.readAsDataURL(file)
  })
}

export default function SupportRequestDetailPage() {
  const navigate = useNavigate()
  const { ticketId } = useParams<{ ticketId: string }>()
  const [ticket, setTicket] = useState<SupportRequestTicket | null>(null)
  const [mediaByName, setMediaByName] = useState<Record<string, string>>({})

  const loadMediaByTicketId = async (id: string) => {
    const urls = await getTicketMediaObjectUrls(id)
    setMediaByName((prev) => {
      revokeMediaObjectUrls(prev)
      return urls
    })
  }

  useEffect(() => {
    if (!ticketId) {
      setTicket(null)
      return
    }

    setTicket(findSupportRequestById(ticketId))
  }, [ticketId])

  useEffect(() => {
    const syncTicket = () => {
      if (!ticketId) {
        return
      }
      setTicket(findSupportRequestById(ticketId))
    }

    window.addEventListener('storage', syncTicket)
    window.addEventListener('focus', syncTicket)

    return () => {
      window.removeEventListener('storage', syncTicket)
      window.removeEventListener('focus', syncTicket)
    }
  }, [ticketId])

  useEffect(() => {
    let isMounted = true

    const loadMedia = async () => {
      if (!ticket) {
        if (isMounted) {
          setMediaByName({})
        }
        return
      }

      if (isMounted) {
        await loadMediaByTicketId(ticket.id)
      }
    }

    loadMedia()

    return () => {
      isMounted = false
      revokeMediaObjectUrls(mediaByName)
    }
  }, [ticket])

  const handleReplaceAttachment = async (
    attachmentIndex: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file || !ticket) {
      return
    }

    await saveTicketMediaFiles(ticket.id, [file])

    const isVideo = file.type.startsWith('video/')
    const updated = updateSupportRequestAttachment(ticket.id, attachmentIndex, {
      name: file.name,
      type: file.type,
      isVideo,
      previewUrl: isVideo ? undefined : await fileToDataUrl(file),
    })

    if (updated) {
      setTicket(updated)
      await loadMediaByTicketId(updated.id)
    }

    event.target.value = ''
  }

  const hasResponse = Boolean(ticket?.staffResponse?.trim())
  const createdDate = useMemo(() => {
    if (!ticket) {
      return ''
    }
    return new Date(ticket.createdAt).toLocaleDateString('vi-VN')
  }, [ticket])

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] px-4 py-6 text-slate-900">
        <div className="mx-auto max-w-[860px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="mb-4 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100"
          >
            <ChevronLeft size={18} />
            Quay lại
          </button>
          <p className="text-sm text-slate-600">Không tìm thấy yêu cầu hỗ trợ.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-6 text-slate-900 md:px-6 md:py-8">
      <div className="mx-auto max-w-[900px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-7">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="rounded-full p-2 text-slate-700 transition-colors hover:bg-slate-100"
            aria-label="Quay lại trang hồ sơ"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 md:text-4xl">Mã yêu cầu: #{ticket.id}</h1>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap rounded-2xl border border-slate-300 px-4 py-3 text-sm md:text-base">
          <p className="shrink-0">
            Trạng thái: <span className="font-semibold">{statusLabelMap[ticket.status]}</span>
          </p>
          <p className="shrink-0">
            Ngày gửi: <span className="font-semibold">{createdDate}</span>
          </p>
          <p className="shrink-0">
            Sản phẩm: <span className="font-semibold">{issueTypeLabelMap[ticket.issueType]}</span>
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-300 p-5">
            <h2 className="text-xl font-extrabold uppercase text-slate-900">Chi tiết yêu cầu</h2>

            <div className="mt-5 space-y-3 text-base text-slate-800">
              <p>
                Tên sản phẩm: <span className="font-semibold">{ticket.productName}</span>
              </p>
              <p>
                Loại sản phẩm: <span className="font-semibold">{issueTypeLabelMap[ticket.issueType]}</span>
              </p>
              <p>Mô tả chi tiết:</p>
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-base leading-relaxed text-slate-700">
                {ticket.description || 'Khách hàng chưa bổ sung mô tả chi tiết.'}
              </p>
              <p>Hình ảnh/ video sản phẩm lỗi:</p>
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {ticket.attachments.length > 0 ? (
                  ticket.attachments.map((attachment, index) => {
                    const previewSource = resolveAttachmentPreviewSource(attachment, mediaByName)

                    if (!previewSource) {
                      return (
                        <div key={`${attachment.name}-${index}`} className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs font-semibold text-slate-600">
                            File #{index + 1}: {attachment.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Không thể hiển thị trực tiếp file cũ này. Vui lòng tải lại file ở yêu cầu mới để xem preview ảnh/video.
                          </p>
                          <label className="mt-3 inline-flex cursor-pointer items-center rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                            Tải lại file này
                            <input
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(event) => handleReplaceAttachment(index, event)}
                            />
                          </label>
                        </div>
                      )
                    }

                    return (
                      <div key={`${attachment.name}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="border-b border-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
                          {attachment.name}
                        </div>
                        {attachment.isVideo ? (
                          <video src={previewSource} controls className="h-auto max-h-[260px] w-full bg-black" />
                        ) : (
                          <img src={previewSource} alt={attachment.name} className="h-auto max-h-[260px] w-full object-contain bg-white" />
                        )}
                      </div>
                    )
                  })
                ) : (
                  <p>Không có file đính kèm.</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 p-5">
            <h2 className="text-xl font-extrabold uppercase text-slate-900">Phản hồi của nhân viên</h2>

            {hasResponse ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-200 text-sm font-bold text-emerald-800">
                    {(ticket.staffResponderName?.[0] || 'N').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900">{ticket.staffResponderName || 'Nhân viên hỗ trợ'}</p>
                    <p className="text-xs text-slate-600">
                      Phản hồi lúc {ticket.respondedAt ? formatDateTime(ticket.respondedAt) : formatDateTime(ticket.createdAt)}
                    </p>
                    {ticket.assignedTechName && (
                      <p className="text-xs text-slate-600">
                        Kỹ thuật viên chỉ định: <span className="font-semibold text-slate-700">{ticket.assignedTechName}</span>
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-line rounded-xl border border-emerald-100 bg-white p-3 text-sm leading-relaxed text-slate-700">
                  {ticket.staffResponse}
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-800">Nhân viên chưa phản hồi yêu cầu này.</p>
                <p className="mt-2 text-sm text-amber-700">
                  Vui lòng chờ thêm, bộ phận hỗ trợ sẽ phản hồi trong thời gian sớm nhất.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
