import { useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { uploadMultipleImages, type UploadedImage } from '@/services/upload.service'

interface Props {
  value: string
  images?: UploadedImage[]
  folder?: string
  rows?: number
  disabled?: boolean
  onChange: (value: string, images: UploadedImage[]) => void
  className?: string
  textareaClassName?: string
}

function urlsToUploadedImages(value: string): UploadedImage[] {
  return value
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean)
    .map((url) => ({ url, public_id: `manual-${url}` }))
}

export default function ImageUploadField({
  value,
  images,
  folder = 'products',
  rows = 3,
  disabled,
  onChange,
  className = '',
  textareaClassName = '',
}: Props) {
  const [uploading, setUploading] = useState(false)
  const imageList = images?.length ? images : urlsToUploadedImages(value)

  const handleFiles = async (files: FileList | null) => {
    const selected = Array.from(files ?? [])
    if (!selected.length) return

    setUploading(true)
    try {
      const res = await uploadMultipleImages(selected, folder)
      const uploaded = res.data.data ?? []
      const nextImages = [...imageList.filter((item) => item.url), ...uploaded]
      onChange(nextImages.map((item) => item.url).join('\n'), nextImages)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (url: string) => {
    const nextImages = imageList.filter((item) => item.url !== url)
    onChange(nextImages.map((item) => item.url).join('\n'), nextImages)
  }

  const handleTextChange = (nextValue: string) => {
    onChange(nextValue, urlsToUploadedImages(nextValue))
  }

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-blue-500">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          <span>{uploading ? 'Đang tải ảnh...' : 'Tải ảnh từ máy'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            multiple
            disabled={disabled || uploading}
            onChange={(event) => handleFiles(event.target.files)}
            className="hidden"
          />
        </label>
        <span className="text-xs font-medium text-slate-400">
          Hỗ trợ JPG, PNG, WEBP. Có thể chọn nhiều ảnh cùng lúc.
        </span>
      </div>

      {imageList.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {imageList.map((image) => (
            <div key={image.url} className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#181B22]">
              <img src={image.url} alt="Ảnh đã tải" className="h-24 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(image.url)}
                className="absolute right-2 top-2 rounded-full bg-black/65 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                title="Xóa ảnh khỏi form"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={value}
        onChange={(event) => handleTextChange(event.target.value)}
        rows={rows}
        placeholder="Hoặc dán URL ảnh, mỗi dòng một URL"
        className={textareaClassName}
      />
    </div>
  )
}
