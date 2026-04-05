'use client'

import Link from 'next/link'
import { Monitor, CalendarHeart, DatabaseZap, ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const services = [
    {
        icon: Monitor,
        title: 'Thiết kế Website',
        description: 'Thiết kế website theo yêu cầu, chuẩn hiển thị di động, SEO, dễ quản lý, phù hợp cá nhân và cửa hàng.',
        href: '/dich-vu/dich-vu-thiet-ke-website',
        color: 'purple',
        badge: 'Phổ biến nhất',
    },
    {
        icon: CalendarHeart,
        title: 'Sự kiện – Tiệc cưới',
        description: 'Giải pháp check-in công nghệ, tìm ảnh nhanh, hỗ trợ kỹ thuật và vận hành sự kiện, tiệc cưới hiệu quả, đúng ngân sách.',
        href: '/dich-vu/dich-vu-su-kien-tiec-cuoi',
        color: 'yellow',
        badge: null,
    },
    {
        icon: DatabaseZap,
        title: 'Chuyển dữ liệu web',
        description: 'Hỗ trợ chuyển dữ liệu giữa các website như bài viết, sản phẩm, hình ảnh… đảm bảo đầy đủ, an toàn và hạn chế gián đoạn.',
        href: '/dich-vu/dich-vu-chuyen-du-lieu',
        color: 'blue',
        badge: null,
    },
]

const colorMap = {
    purple: {
        icon: 'bg-purple-100 text-purple-600',
        iconHover: 'group-hover:bg-purple-600 group-hover:text-white',
        border: 'hover:border-purple-300',
        arrow: 'text-purple-500 group-hover:text-purple-700',
        glow: 'group-hover:shadow-purple-200',
        accent: 'from-purple-500 to-purple-400',
        badge: 'bg-purple-100 text-purple-700',
    },
    yellow: {
        icon: 'bg-yellow-100 text-yellow-600',
        iconHover: 'group-hover:bg-yellow-500 group-hover:text-white',
        border: 'hover:border-yellow-300',
        arrow: 'text-yellow-500 group-hover:text-yellow-700',
        glow: 'group-hover:shadow-yellow-200',
        accent: 'from-yellow-400 to-yellow-300',
        badge: 'bg-yellow-100 text-yellow-700',
    },
    blue: {
        icon: 'bg-blue-100 text-blue-600',
        iconHover: 'group-hover:bg-blue-600 group-hover:text-white',
        border: 'hover:border-blue-300',
        arrow: 'text-blue-500 group-hover:text-blue-700',
        glow: 'group-hover:shadow-blue-200',
        accent: 'from-blue-500 to-blue-400',
        badge: 'bg-blue-100 text-blue-700',
    },
}

function useInView() {
    const ref = useRef(null)
    const [inView, setInView] = useState(false)
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true) },
            { threshold: 0.1 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])
    return [ref, inView]
}

export default function ServicesSection() {
    const [headerRef, headerInView] = useInView()
    const [cardsRef, cardsInView] = useInView()

    return (
        <section className="py-28 bg-white relative overflow-hidden">

            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-60" />

            <div className="relative container mx-auto max-w-6xl px-6">

                {/* Header */}
                <div
                    ref={headerRef}
                    className="text-center mb-16 transition-all duration-700"
                    style={{
                        opacity: headerInView ? 1 : 0,
                        transform: headerInView ? 'translateY(0)' : 'translateY(30px)',
                    }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-5 py-2 mb-5">
                        <Sparkles size={14} className="text-purple-600" />
                        <span className="text-sm font-semibold text-purple-600 tracking-wide uppercase">
              Dịch vụ của chúng tôi
            </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Giải pháp toàn diện cho{' '}
                        <span className="text-purple-600">thương hiệu</span> của bạn
                    </h2>
                    <p className="mt-5 text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Vạn Sao cung cấp dịch vụ chuyên nghiệp, sáng tạo và hiệu quả — từ website đến sự kiện và dữ liệu.
                    </p>
                </div>

                {/* Cards */}
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, i) => {
                        const Icon = service.icon
                        const c = colorMap[service.color]
                        return (
                            <div
                                key={service.href}
                                className={`
                  group relative flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white
                  p-10 shadow-sm transition-all duration-500 cursor-pointer
                  hover:-translate-y-2 hover:shadow-2xl ${c.glow} ${c.border}
                `}
                                style={{
                                    opacity: cardsInView ? 1 : 0,
                                    transform: cardsInView ? 'translateY(0)' : 'translateY(40px)',
                                    transitionDelay: cardsInView ? `${i * 150}ms` : '0ms',
                                }}
                            >
                                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${c.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                {service.badge && (
                                    <div className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold ${c.badge}`}>
                                        {service.badge}
                                    </div>
                                )}

                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${c.icon} ${c.iconHover}`}>
                                    <Icon size={30} />
                                </div>

                                <div className="flex flex-col gap-3 flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800">{service.title}</h3>
                                    <p className="text-base text-gray-500 leading-relaxed">{service.description}</p>
                                </div>

                                <div className="h-px bg-gray-100 group-hover:bg-gray-200 transition-colors" />

                                <Link
                                    href={service.href}
                                    className={`inline-flex items-center gap-2 text-base font-semibold transition-all duration-200 ${c.arrow}`}
                                >
                                    Xem chi tiết dịch vụ
                                    <ArrowRight size={17} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                                </Link>
                            </div>
                        )
                    })}
                </div>

                {/* CTA bottom */}
                <div
                    className="text-center mt-14 transition-all duration-700"
                    style={{
                        opacity: cardsInView ? 1 : 0,
                        transitionDelay: cardsInView ? '450ms' : '0ms',
                    }}
                >
                    <Link
                        href="/dich-vu"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-purple-200 bg-white px-8 py-4 text-base font-semibold text-purple-600 shadow-sm hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300"
                    >
                        Xem tất cả dịch vụ
                        <ArrowRight size={17} />
                    </Link>
                </div>

            </div>
        </section>
    )
}