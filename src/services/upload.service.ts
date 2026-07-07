import api from './api'

export interface UploadedImage {
  url: string
  public_id: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
  error?: string
}

export const uploadSingleImage = (file: File, folder = 'general') => {
  const formData = new FormData()
  formData.append('image', file)

  return api.post<ApiResponse<UploadedImage>>('/upload/single', formData, {
    params: { folder },
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const uploadMultipleImages = (files: File[], folder = 'products') => {
  const formData = new FormData()
  files.forEach((file) => formData.append('images', file))

  return api.post<ApiResponse<UploadedImage[]>>('/upload/multiple', formData, {
    params: { folder },
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteUploadedImages = (publicIds: string[]) => {
  return api.delete<ApiResponse>('/upload', {
    data: { public_ids: publicIds },
  })
}
