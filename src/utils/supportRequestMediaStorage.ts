const DB_NAME = 'support-request-media-db'
const DB_VERSION = 1
const STORE_NAME = 'ticket-media'

interface AttachmentWithPreview {
  name: string
  previewUrl?: string
}

interface StoredTicketMedia {
  key: string
  ticketId: string
  name: string
  type: string
  blob: Blob
}

function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveTicketMediaFiles(ticketId: string, files: File[]): Promise<void> {
  if (typeof window === 'undefined' || files.length === 0) {
    return
  }

  const db = await openMediaDb()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    files.forEach((file) => {
      const record: StoredTicketMedia = {
        key: `${ticketId}::${file.name}`,
        ticketId,
        name: file.name,
        type: file.type,
        blob: file,
      }
      store.put(record)
    })

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })

  db.close()
}

export async function getTicketMediaObjectUrls(ticketId: string): Promise<Record<string, string>> {
  if (typeof window === 'undefined') {
    return {}
  }

  const db = await openMediaDb()

  const records = await new Promise<StoredTicketMedia[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => resolve((request.result as StoredTicketMedia[]) || [])
    request.onerror = () => reject(request.error)
  })

  db.close()

  return records
    .filter((record) => record.ticketId === ticketId)
    .reduce<Record<string, string>>((acc, record) => {
      acc[record.name] = URL.createObjectURL(record.blob)
      return acc
    }, {})
}

export function resolveAttachmentPreviewSource(
  attachment: AttachmentWithPreview,
  mediaByName: Record<string, string>
): string | undefined {
  return attachment.previewUrl || mediaByName[attachment.name]
}

export function revokeMediaObjectUrls(mediaByName: Record<string, string>): void {
  Object.values(mediaByName).forEach((url) => URL.revokeObjectURL(url))
}
