import RegisterForm from '@/components/account/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-8 py-4 border-b border-gray-100 flex items-center">
        <span className="text-lg font-bold text-[#1a237e]">WebACC</span>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <RegisterForm />
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden md:flex flex-col items-center gap-6">
            <img
              src="/register-illustration.png"
              alt="Minh hoạ đăng ký"
              className="w-72 object-contain drop-shadow-sm"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
