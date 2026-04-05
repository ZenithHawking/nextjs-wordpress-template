'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HeroSection() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">

            {/* Background image + overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/banner.jpg"
                    alt="Vạn Sao banner"
                    fill
                    priority
                    className="object-cover object-center"
                />
                {/* Overlay làm mờ */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-900/70 to-gray-950/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto max-w-6xl px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Cột trái — Chữ */}
                    <div
                        className={`flex flex-col gap-6 transition-all duration-700 ${
                            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 w-fit rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-1.5">
                            <Sparkles size={13} className="text-yellow-400" />
                            <span className="text-xs font-medium text-yellow-300 tracking-wide">
                Giải pháp chuyên nghiệp
              </span>
                        </div>

                        {/* Tiêu đề chính */}
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-md">
                            Thiết Kế Website{' '}
                            <span className="text-yellow-400">Dịch vụ Sự kiện</span>{' '}
                            Xử lý dữ liệu
                        </h1>

                        {/* Mô tả */}
                        <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-lg"
                           style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                        >
                            Vạn Sao chuyên thiết kế website, tổ chức sự kiện và tiệc cưới trọn gói,
                            mang đến giải pháp chuyên nghiệp giúp thương hiệu và khoảnh khắc của bạn
                            tỏa sáng.
                        </p>

                        {/* CTA buttons */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link
                                href="https://zalo.me/0866631679"
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-purple-700 hover:to-purple-600 hover:scale-105 transition-all duration-200"
                            >
                                <Sparkles size={15} />
                                Liên hệ ngay
                            </Link>
                            <Link
                                href="/bang-gia"
                                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-200"
                            >
                                Xem bảng giá
                                <ChevronRight size={15} />
                            </Link>
                        </div>
                    </div>

                    {/* Cột phải — Logo wobble */}
                    <div
                        className={`flex items-center justify-center transition-all duration-700 delay-300 ${
                            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    >
                        <div className="relative">
                            {/* Vòng sáng phía sau logo */}
                            <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-3xl scale-110" />

                            {/* Logo với wobble */}
                            <Image
                                src="/logo.png"
                                alt="Vạn Sao Logo"
                                width={340}
                                height={340}
                                priority
                                className="
                  relative object-contain drop-shadow-2xl
                  animate-wobble
                  hover:[animation-play-state:paused]
                  hover:scale-110
                  transition-transform duration-300
                  cursor-pointer
                "
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40">
                <span className="text-xs tracking-widest uppercase">Cuộn xuống</span>
                <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
            </div>

        </section>
    )
}