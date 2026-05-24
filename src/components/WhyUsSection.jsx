'use client'

import Link from 'next/link'
import { BadgeDollarSign, GitPullRequestArrow, ShieldCheck, Rocket, ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const reasons = [
    {
        icon: BadgeDollarSign,
        title: 'Chi phí minh bạch',
        description: 'Báo giá rõ ràng từ đầu, không phát sinh mập mờ trong suốt dự án.',
        cls: 'r-1',
        num: '01',
    },
    {
        icon: GitPullRequestArrow,
        title: 'Quy trình rõ ràng',
        description: 'Trao đổi trực tiếp, cập nhật tiến độ thường xuyên — bạn luôn biết dự án đang ở đâu.',
        cls: 'r-2',
        num: '02',
    },
    {
        icon: ShieldCheck,
        title: 'Bảo hành dài hạn',
        description: 'Hỗ trợ kỹ thuật xuyên suốt quá trình sử dụng, không giới hạn thời gian.',
        cls: 'r-3',
        num: '03',
    },
    {
        icon: Rocket,
        title: 'Triển khai đúng hạn',
        description: 'Tối ưu quy trình, cam kết bàn giao đúng tiến độ đã thỏa thuận.',
        cls: 'r-4',
        num: '04',
    },
]

function useInView() {
    const ref = useRef(null)
    const [inView, setInView] = useState(false)
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true) },
            { threshold: 0.15 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])
    return [ref, inView]
}

export default function WhyUsSection() {
    const [leftRef, leftInView] = useInView()
    const [rightRef, rightInView] = useInView()

    return (
        <section className="vs-why-section" id="vi-sao" aria-labelledby="why-h2">
            <div className="vs-shell">
                <div className="grid">

                    {/* Left */}
                    <div
                        ref={leftRef}
                        className="left transition-all duration-700"
                        style={{
                            opacity: leftInView ? 1 : 0,
                            transform: leftInView ? 'translateX(0)' : 'translateX(-40px)',
                        }}
                    >
                        <span className="vs-eyebrow">
                            <Sparkles size={13} className="text-vs-purple" />
                            Vì sao chọn Vạn Sao
                        </span>
                        <h2 id="why-h2">
                            Làm gọn. <span className="accent">Đúng nhu cầu.</span> Đúng ngân sách.
                        </h2>
                        <p className="desc">
                            Vạn Sao là công ty công nghệ tập trung vào giải pháp website và sự kiện —
                            chúng tôi tin vào việc làm gọn, đúng nhu cầu và đồng hành lâu dài,
                            thay vì bàn giao xong là hết.
                        </p>

                        <div className="vs-stats-strip">
                            <div><b>100<span className="yel">+</span></b><span>Dự án bàn giao</span></div>
                            <div><b>24<span className="yel">/7</span></b><span>Hỗ trợ kỹ thuật</span></div>
                            <div><b>5<span className="yel">★</span></b><span>Đánh giá khách</span></div>
                        </div>

                        <Link
                            href="https://zalo.me/0866631679"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="vs-why-cta"
                        >
                            <Sparkles size={13} className="star" />
                            Đặt lịch tư vấn miễn phí
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    {/* Right — 4 reasons */}
                    <div ref={rightRef} className="vs-reasons">
                        {reasons.map(({ icon: Icon, title, description, cls, num }, i) => (
                            <div
                                key={title}
                                className={`vs-reason ${cls}`}
                                style={{
                                    opacity: rightInView ? 1 : 0,
                                    transform: rightInView ? 'translateY(0)' : 'translateY(30px)',
                                    transition: 'opacity 0.5s, transform 0.5s, box-shadow 0.25s',
                                    transitionDelay: rightInView ? `${i * 100}ms` : '0ms',
                                }}
                            >
                                <span className="num-ghost">{num}</span>
                                <div className="icon">
                                    <Icon size={22} strokeWidth={1.8} />
                                </div>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
