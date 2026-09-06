'use client'

import Link from 'next/link'
import { Monitor, CalendarHeart, DatabaseZap, ArrowUpRight, Star, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Mascot, { MASCOTS } from '@/components/Mascot'

const services = [
    {
        icon: Monitor,
        title: 'Thiết kế Website',
        mascot: MASCOTS.totNghiep,
        description: 'Website đẹp – chuẩn SEO – dễ quản lý, phù hợp cho cá nhân, cửa hàng và doanh nghiệp Việt.',
        href: '/dich-vu/dich-vu-thiet-ke-website',
        variant: 'purple',
        badge: 'Phổ biến nhất',
        features: [
            'Landing page · 7-14 ngày',
            'Website bán hàng · 3-4 tuần',
            'Tích hợp Zalo, Sapo, GHN',
            'Bảo hành dài hạn',
        ],
    },
    {
        icon: CalendarHeart,
        title: 'Sự kiện & Tiệc cưới',
        mascot: MASCOTS.anMung,
        description: 'Check-in công nghệ, tìm ảnh nhanh bằng AI và vận hành sự kiện – tiệc cưới hiệu quả, đúng ngân sách.',
        href: '/dich-vu/dich-vu-su-kien-tiec-cuoi',
        variant: 'yellow',
        badge: null,
        features: [
            'Check-in QR · gửi ảnh tức thì',
            'Tìm ảnh bằng AI khuôn mặt',
            'Màn hình LED, livestream',
            'Nhân sự kỹ thuật trọn gói',
        ],
    },
    {
        icon: DatabaseZap,
        title: 'Chuyển dữ liệu Web',
        mascot: MASCOTS.phuThuy,
        description: 'Chuyển bài viết, sản phẩm, ảnh và khách hàng giữa các nền tảng — WordPress, Shopify, Sapo, Haravan...',
        href: '/dich-vu/dich-vu-chuyen-du-lieu',
        variant: 'mint',
        badge: null,
        features: [
            'Giữ nguyên URL & thứ hạng SEO',
            'Ánh xạ thuộc tính tự động',
            'Chuyển không gián đoạn',
            'Báo cáo trước/sau chi tiết',
        ],
    },
]

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
        <section className="vs-svc-section" id="dich-vu" aria-labelledby="svc-h2">
            <div className="vs-shell">

                {/* Header */}
                <header
                    ref={headerRef}
                    className="vs-sec-head transition-all duration-700"
                    style={{
                        opacity: headerInView ? 1 : 0,
                        transform: headerInView ? 'translateY(0)' : 'translateY(30px)',
                    }}
                >
                    <div className="left">
                        <h2 id="svc-h2">Giải pháp toàn diện cho thương hiệu Việt</h2>
                        <p className="desc">
                            Ba mảng dịch vụ cốt lõi — chuyên sâu, làm gọn, luôn có người đồng hành từ đầu đến cuối.
                        </p>
                    </div>
                </header>

                {/* Cards */}
                <div ref={cardsRef} className="vs-svc-grid">
                    {services.map((service, i) => {
                        const Icon = service.icon
                        return (
                            <article
                                key={service.href}
                                className={`vs-svc-card mascot-host ${service.variant} ${i === 1 ? 'tilt-right' : ''}`}
                                style={{
                                    opacity: cardsInView ? 1 : 0,
                                    transform: cardsInView ? 'translateY(0)' : 'translateY(40px)',
                                    transition: 'opacity 0.6s, transform 0.6s, background 0.25s, box-shadow 0.25s',
                                    transitionDelay: cardsInView ? `${i * 120}ms` : '0ms',
                                }}
                            >
                                {service.badge && (
                                    <span className="badge">
                                        <Star size={11} fill="currentColor" />
                                        {service.badge}
                                    </span>
                                )}

                                <div className="icon-box">
                                    <Icon size={28} strokeWidth={1.7} />
                                </div>

                                <Mascot
                                    name={service.mascot}
                                    size={86}
                                    motion="none"
                                    className="svc-mascot"
                                />

                                <h3>{service.title}</h3>
                                <p>{service.description}</p>

                                <ul className="features">
                                    {service.features.map((f, j) => (
                                        <li key={j}>
                                            <Check size={14} strokeWidth={2.5} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Link href={service.href} className="more">
                                    Xem chi tiết dịch vụ
                                    <ArrowUpRight size={15} className="arrow" />
                                </Link>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
