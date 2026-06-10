import { FormEvent, useEffect, useRef, useState } from 'react'
import { ChevronLeft, FileUp, Paperclip, X } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createSupportRequestTicket } from '@/utils/supportRequestStorage'
import { saveTicketMediaFiles } from '@/utils/supportRequestMediaStorage'

type ProductIssueType = 'account' | 'laptop'

interface AttachmentItem {
  file: File
  previewUrl: string
  isVideo: boolean
}

const ISSUE_LABELS: Record<ProductIssueType, string> = {
  account: 'Account',
  laptop: 'Laptop/Pc',
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

export default function SupportRequestPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { type, id } = useParams<{ type: ProductIssueType; id: string }>()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const initialType: ProductIssueType = type === 'account' ? 'account' : 'laptop'

  const [orderCode, setOrderCode] = useState(id ?? '')
  const [productName, setProductName] = useState<string>(() => {
    const routeState = location.state as { productName?: string } | null
    return routeState?.productName?.trim() || (initialType === 'account' ? 'Tài khoản số cần hỗ trợ' : 'Laptop/Pc cần hỗ trợ')
  })
  const [contactInfo, setContactInfo] = useState('')
  const [issueType, setIssueType] = useState<ProductIssueType>(initialType)
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState<AttachmentItem[]>([])
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      attachments.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
  }, [attachments])

  const handlePickFiles = () => {
    fileInputRef.current?.click()
  }

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])

    if (selectedFiles.length === 0) {
      return
    }

    setAttachments((prev) => {
      const mappedFiles = selectedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        isVideo: file.type.startsWith('video/'),
      }))

      const mergedFiles = [...prev, ...mappedFiles]
      if (mergedFiles.length > 6) {
        mergedFiles.slice(6).forEach((item) => URL.revokeObjectURL(item.previewUrl))
      }
      return mergedFiles.slice(0, 6)
    })

    event.target.value = ''
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => {
      const target = prev[index]
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
      }

      return prev.filter((_, fileIndex) => fileIndex !== index)
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const attachmentPayload = await Promise.all(
      attachments.map(async (item) => ({
        name: item.file.name,
        type: item.file.type,
        isVideo: item.isVideo,
        previewUrl: item.isVideo ? undefined : await fileToDataUrl(item.file),
      }))
    )

    const createdTicket = createSupportRequestTicket({
      orderCode: orderCode.trim(),
      productName: productName.trim() || (issueType === 'account' ? 'Tài khoản số cần hỗ trợ' : 'Laptop/Pc cần hỗ trợ'),
      contactInfo: contactInfo.trim(),
      issueType,
      description: description.trim(),
      attachments: attachmentPayload,
    })

    await saveTicketMediaFiles(
      createdTicket.id,
      attachments.map((item) => item.file)
    )

    alert('Đã tiếp nhận yêu cầu hỗ trợ kỹ thuật của bạn. Bộ phận CSKH sẽ phản hồi sớm.')
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-3 py-4 md:px-6 md:py-8 text-slate-900">
      <div className="mx-auto w-full max-w-[860px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full p-2 text-slate-700 transition-colors hover:bg-slate-100"
              aria-label="Quay lại"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-center text-xl font-bold leading-tight md:text-[30px]">Trung tâm hỗ trợ và bảo hành</h1>
            <div className="w-9" aria-hidden="true" />
          </div>

          <div className="space-y-5 md:px-8">
            <div className="space-y-2">
              <label htmlFor="order-code" className="block text-lg font-semibold md:text-2xl">
                Nhập mã đơn hàng
              </label>
              <input
                id="order-code"
                value={orderCode}
                onChange={(event) => setOrderCode(event.target.value)}
                placeholder="Mã đơn hàng"
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none transition-colors focus:border-slate-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="product-name" className="block text-lg font-semibold md:text-2xl">
                Tên sản phẩm
              </label>
              <input
                id="product-name"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                placeholder="Nhập tên sản phẩm cần hỗ trợ"
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none transition-colors focus:border-slate-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-info" className="block text-lg font-semibold md:text-2xl">
                Nhập Email/ số điện thoại
              </label>
              <input
                id="contact-info"
                value={contactInfo}
                onChange={(event) => setContactInfo(event.target.value)}
                placeholder="Nhập email/ số điện thoại đã mua hàng"
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none transition-colors focus:border-slate-500"
                required
              />
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold md:text-2xl">Sản phẩm lỗi</p>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(ISSUE_LABELS) as ProductIssueType[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setIssueType(item)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-2 text-base transition-colors md:text-lg ${
                      issueType === item
                          ? 'border-[#3786EC] bg-[#EFF5FF] text-[#1E5FBF]'
                        : 'border-slate-300 bg-white hover:border-slate-500'
                    }`}
                  >
                    <span>{ISSUE_LABELS[item]}</span>
                    <span
                      className={`h-5 w-5 rounded-full border ${
                          issueType === item ? 'border-[#3786EC] bg-[#3786EC]' : 'border-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold md:text-2xl">Mô tả chi tiết</p>
              {!isDescriptionOpen ? (
                <button
                  type="button"
                  onClick={() => setIsDescriptionOpen(true)}
                  className="h-16 w-full rounded-xl border border-dashed border-slate-300 bg-slate-100 px-4 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Nhấn để nhập mô tả chi tiết lỗi
                </button>
              ) : (
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Mô tả lỗi bạn gặp phải (thời điểm phát sinh, biểu hiện lỗi, thao tác trước khi lỗi xảy ra...)"
                  className="h-32 w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm outline-none transition-colors focus:border-slate-500"
                  required
                />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold md:text-2xl">Tải ảnh/ video sản phẩm lỗi</p>
              <div className="rounded-xl border border-slate-300 bg-slate-100 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handlePickFiles}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#3786EC] bg-white px-4 py-2 text-sm font-semibold text-[#1E5FBF] transition-colors hover:bg-[#EFF5FF]"
                  >
                    <FileUp size={16} />
                    Chọn ảnh/video
                  </button>
                  <span className="text-xs text-slate-600">Tối đa 6 file (ảnh hoặc video)</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFilesChange}
                />

                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachments.map((item, index) => (
                      <div
                        key={`${item.file.name}-${index}`}
                        className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm"
                      >
                        <span className="flex items-center gap-2 truncate text-slate-700">
                          <Paperclip size={14} className="shrink-0" />
                          <span className="truncate">{item.file.name}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          {item.isVideo && (
                            <button
                              type="button"
                              onClick={() => setPreviewVideoUrl(item.previewUrl)}
                              className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              Xem video
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className="rounded-full p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Xóa file"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-full bg-[#3786EC] px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-[#2F73CA]"
              >
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </form>
      </div>

      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Xem lại video đã tải lên</p>
              <button
                type="button"
                onClick={() => setPreviewVideoUrl(null)}
                className="rounded-full p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Đóng xem video"
              >
                <X size={16} />
              </button>
            </div>

            <video src={previewVideoUrl} controls className="h-auto max-h-[70vh] w-full rounded-lg bg-black" />
          </div>
        </div>
      )}
    </div>
  )
}
