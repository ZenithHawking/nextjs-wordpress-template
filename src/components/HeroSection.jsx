'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ArrowRight, ArrowUpRight, Monitor, CalendarHeart, DatabaseZap } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HeroSection() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <section className="vs-hero" aria-labelledby="hero-h1">
            <div className="vs-shell">
                <div className="grid">
                    {/* Left — content */}
                    <div
                        className={`transition-all duration-700 ${
                            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    >
                        <span className="vs-eyebrow">
                            <span className="star">★</span> Công ty công nghệ · từ 2022
                        </span>
                        <h1 id="hero-h1">
                            Website, sự kiện <span className="hl">&amp; dữ liệu</span>
                            <br />
                            — <span className="accent">làm gọn</span>, đúng nhu cầu.
                        </h1>
                        <p className="lead">
                            Vạn Sao giúp bạn thiết kế website, tổ chức sự kiện – tiệc cưới và chuyển dữ liệu,
                            với báo giá rõ ràng và triển khai đúng hạn. Không công nghệ phức tạp —
                            chỉ giải pháp gọn gàng.
                        </p>

                        <div className="actions">
                            <Link
                                href="https://zalo.me/0866631679"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                            >
                                <Sparkles size={14} className="star" />
                                Tư vấn miễn phí qua Zalo
                                <ArrowRight size={15} />
                            </Link>
                            <Link href="/dich-vu" className="btn-ghost">
                                Xem bảng giá
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>

                        <div className="trust">
                            <div className="avatars">
                                <span className="av">M</span>
                                <span className="av">L</span>
                                <span className="av">P</span>
                                <span className="av">H</span>
                            </div>
                            <span><b>100+</b> khách hàng đã chọn Vạn Sao</span>
                            <span style={{ color: 'var(--vs-ink-4)' }}>•</span>
                            <span className="stars-row">★★★★★ <b style={{ marginLeft: 4 }}>5.0</b></span>
                        </div>
                    </div>

                    {/* Right — Star scene */}
                    <div
                        className={`vs-hero-scene transition-all duration-700 delay-300 ${
                            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                        aria-hidden="true"
                    >
                        <div className="blob" />
                        <div className="ring ring-2" />
                        <div className="ring ring-1" />

                        {/* Big star — your /public/logo.png */}
                        <div className="big-star">
                            <Image
                                src="/logo.png"
                                alt=""
                                width={220}
                                height={220}
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>

                        <div className="orbit orbit-a">
                            <div className="chip">
                                <span className="ico"><Monitor size={16} /></span>
                                Website chuẩn SEO
                            </div>
                        </div>
                        <div className="orbit orbit-b">
                            <div className="chip yellow">
                                <span className="ico"><CalendarHeart size={16} /></span>
                                Check-in sự kiện
                            </div>
                        </div>
                        <div className="orbit orbit-c">
                            <div className="chip mint">
                                <span className="ico"><DatabaseZap size={16} /></span>
                                Chuyển dữ liệu an toàn
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
