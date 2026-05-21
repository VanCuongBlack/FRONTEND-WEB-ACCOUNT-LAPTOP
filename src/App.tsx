import { Toaster } from 'sonner'
import AppRouter from '@/routes'

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}