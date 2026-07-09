import { useEffect, useState } from 'react'
import { Database, Globe, Mail, RefreshCw, Shield, Users } from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'
import { getSystemInfo, type SystemInfoResponse } from '@/services/admin.service'

function formatUptime(seconds?: number) {
  if (!seconds) return '0 phút'
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days} ngày ${hours} giờ ${minutes} phút`
  if (hours > 0) return `${hours} giờ ${minutes} phút`
  return `${minutes} phút`
}

export default function SystemSettingsPage() {
  const [info, setInfo] = useState<SystemInfoResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadInfo = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await getSystemInfo()
      setInfo(res.data?.data ?? null)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải thông tin hệ thống.')
      setInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInfo()
  }, [])

  return (
    <AdminLayout title="Quản lý hệ thống">
      <section className="mx-auto w-full max-w-[1840px] space-y-6 font-sans text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Quản lý hệ thống</h1>
            <p className="mt-1 text-sm text-slate-400">
              Theo dõi thông tin vận hành, quyền truy cập và trạng thái hệ thống.
            </p>
          </div>

          <button
            type="button"
            onClick={loadInfo}
            className="flex h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500 cursor-pointer"
          >
            <RefreshCw size={18} />
            Tải lại
          </button>
        </div>

        {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-blue-955/20 text-blue-400 border border-blue-500/20 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#909AAB]">Tổng người dùng</p>
              <Users className="text-blue-400" size={22} />
            </div>
            <p className="mt-4 text-3xl font-bold text-white">
              {(info?.stats?.total_users ?? 0).toLocaleString('vi-VN')}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-955/20 text-emerald-400 border border-emerald-500/20 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#909AAB]">Tổng sản phẩm</p>
              <Database className="text-emerald-400" size={22} />
            </div>
            <p className="mt-4 text-3xl font-bold text-white">
              {(info?.stats?.total_products ?? 0).toLocaleString('vi-VN')}
            </p>
          </div>

          <div className="rounded-2xl bg-amber-955/20 text-amber-400 border border-amber-500/20 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#909AAB]">Số role</p>
              <Shield className="text-amber-400" size={22} />
            </div>
            <p className="mt-4 text-3xl font-bold text-white">{info?.roles?.length ?? 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <main className="rounded-2xl border border-white/10 bg-[#2A2F3B] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-white">Thông tin runtime</h2>
            {isLoading ? (
              <p className="mt-4 text-sm text-slate-400">Đang tải thông tin hệ thống...</p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#181B22] p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                    <Globe size={18} />
                    Node version
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">
                    {info?.system?.node_version ?? '-'}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#181B22] p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                    <Database size={18} />
                    Memory heap
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">
                    {info?.system?.memory_mb ?? 0} MB
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#181B22] p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                    <RefreshCw size={18} />
                    Uptime
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">
                    {formatUptime(info?.system?.uptime_seconds)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#181B22] p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                    <Mail size={18} />
                    Email/SMTP
                  </div>
                  <p className="mt-2 text-sm text-slate-450">
                    Chưa có cấu hình email công khai để hiển thị.
                  </p>
                </div>
              </div>
            )}
          </main>

          <aside className="rounded-2xl border border-white/10 bg-[#2A2F3B] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-white">Role hệ thống</h2>
            <div className="mt-4 space-y-3">
              {(info?.roles ?? []).length === 0 ? (
                <p className="text-sm text-slate-400">Chưa có dữ liệu role.</p>
              ) : (
                info?.roles?.map((role) => (
                  <div key={role._id} className="rounded-xl border border-white/5 bg-[#181B22] p-3">
                    <p className="font-bold text-white">{role.name}</p>
                    <p className="mt-1 text-xs text-[#909AAB]">{role.description || role._id}</p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>
    </AdminLayout>
  )
}
