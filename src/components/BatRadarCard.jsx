'use client'

import { useState } from 'react'
import { Radar, Download } from 'lucide-react'

export default function BatRadarCard() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogStep, setDialogStep] = useState(1)
    const [releases, setReleases] = useState([])
    const [loadingReleases, setLoadingReleases] = useState(false)
    const [selectedRelease, setSelectedRelease] = useState(null)
    const [fetchError, setFetchError] = useState(false)

    function openDialog() {
        setDialogOpen(true)
        setDialogStep(1)
        setSelectedRelease(null)
        setReleases([])
        setFetchError(false)
    }

    function closeDialog() {
        setDialogOpen(false)
    }

    async function handleConfirm() {
        setDialogStep(2)
        setLoadingReleases(true)
        setFetchError(false)
        try {
            const res = await fetch('https://api.github.com/repos/ZenithHawking/BatRadar/releases')
            const data = await res.json()
            const filtered = data.filter(r => r.assets?.some(a => a.name.endsWith('.exe')))
            setReleases(filtered)
            if (filtered.length > 0) setSelectedRelease(filtered[0])
        } catch {
            setFetchError(true)
        } finally {
            setLoadingReleases(false)
        }
    }

    function handleDownload() {
        if (!selectedRelease) return
        const asset = selectedRelease.assets.find(a => a.name.endsWith('.exe'))
        if (asset) window.open(asset.browser_download_url, '_blank')
    }

    return (
        <>
            {/* Card */}
            <div
                onClick={openDialog}
                className="group relative flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 group-hover:shadow-indigo-100 cursor-pointer"
            >
                <div className="absolute -top-px -right-px">
                    <div className="bg-green-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-2xl flex items-center gap-1.5 leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                        FREE
                    </div>
                </div>

                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-indigo-100 text-indigo-600">
                    <Radar size={28} />
                </div>

                <div className="flex flex-col gap-3 flex-1">
                    <h2 className="text-xl font-bold text-gray-900">BatRadar</h2>
                    <p className="text-base text-gray-500 leading-relaxed">
                        Ứng dụng máy tính giúp kỹ thuật viên và người dùng AI theo dõi mức sử dụng AI đang chạy trên máy tính.
                    </p>
                </div>

                <span className="inline-flex items-center gap-2 text-base font-semibold text-indigo-500 group-hover:text-indigo-700 transition-all duration-200">
                    Tải về ngay
                    <Download size={17} className="group-hover:translate-y-0.5 transition-transform duration-200" />
                </span>
            </div>

            {/* Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDialog} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

                        {dialogStep === 1 ? (
                            <>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                                        <Radar size={24} className="text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">BatRadar</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-8">
                                    BatRadar là ứng dụng trên máy tính dành cho kỹ thuật viên và người dùng AI, giúp kiểm tra mức sử dụng AI đang chạy trên máy tính. Bạn có chắc muốn tải về không?
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={closeDialog}
                                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Không
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        Có, tiếp tục
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                                        <Download size={24} className="text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Chọn phiên bản</h3>
                                </div>

                                {loadingReleases ? (
                                    <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
                                        Đang tải danh sách phiên bản...
                                    </div>
                                ) : fetchError ? (
                                    <p className="text-red-500 text-sm py-4">Không thể kết nối GitHub. Vui lòng thử lại sau.</p>
                                ) : releases.length === 0 ? (
                                    <p className="text-gray-400 text-sm py-4">Chưa có phiên bản nào được xuất bản.</p>
                                ) : (
                                    <div className="flex flex-col gap-2 mb-6">
                                        {releases.map(r => (
                                            <button
                                                key={r.id}
                                                onClick={() => setSelectedRelease(r)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                                                    selectedRelease?.id === r.id
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-gray-100 hover:border-indigo-200'
                                                }`}
                                            >
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedRelease?.id === r.id ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                                                <span className="font-semibold text-gray-900">{r.tag_name}</span>
                                                {r.name && r.name !== r.tag_name && (
                                                    <span className="text-gray-400 text-sm truncate">{r.name}</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={closeDialog}
                                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Huỷ
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        disabled={!selectedRelease || loadingReleases}
                                        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                                    >
                                        <Download size={16} />
                                        Tải về
                                    </button>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            )}
        </>
    )
}
