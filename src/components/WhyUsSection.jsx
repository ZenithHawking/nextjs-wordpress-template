'use client'

import Link from 'next/link'
import { BadgeDollarSign, GitPullRequestArrow, ShieldCheck, Rocket, ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const reasons = [
    {
        icon: BadgeDollarSign,
        title: 'Chi phí minh bạch',
        description: 'Báo giá rõ ràng từ đầu, không phát sinh mập mờ trong suốt dự án.',
        color: 'yellow',
        number: '01',
    },
    {
        icon: GitPullRequestArrow,
        title: 'Quy trình rõ ràng',
        description: 'Trao đổi trực tiếp, cập nhật tiến độ thường xuyên, minh bạch từng bước.',
        color: 'purple',
        number: '02',
    },
    {
        icon: ShieldCheck,
        title: 'Bảo hành dài hạn',
        description: 'Hỗ trợ kỹ thuật xuyên suốt quá trình sử dụng, không giới hạn thời gian.',
        color: 'blue',
        number: '03',
    },
    {
        icon: Rocket,
        title: 'Triển khai đúng hạn',
        description: 'Tối ưu quy trình, cam kết bàn giao đúng tiến độ đã thỏa thuận.',
        color: 'green',
        number: '04',
    },
]

const colorMap = {
    yellow: {
        wrap: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400 hover:shadow-yellow-100',
        icon: 'bg-yellow-100 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white',
        number: 'text-yellow-200 group-hover:text-yellow-300',
    },
    purple: {
        wrap: 'bg-purple-50 border-purple-200 hover:border-purple-400 hover:shadow-purple-100',
        icon: 'bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white',
        number: 'text-purple-200 group-hover:text-purple-300',
    },
    blue: {
        wrap: 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-blue-100',
        icon: 'bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white',
        number: 'text-blue-200 group-hover:text-blue-300',
    },
    green: {
        wrap: 'bg-green-50 border-green-200 hover:border-green-400 hover:shadow-green-100',
        icon: 'bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white',
        number: 'text-green-200 group-hover:text-green-300',
    },
}

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
        <section className="py-28 bg-gray-50 relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

            <div className="relative container mx-auto max-w-6xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Cột trái — Text */}
                    <div
                        ref={leftRef}
                        className="flex flex-col gap-6 transition-all duration-700"
                        style={{
                            opacity: leftInView ? 1 : 0,
                            transform: leftInView ? 'translateX(0)' : 'translateX(-40px)',
                        }}
                    >
                        <div className="inline-flex items-center gap-2 w-fit rounded-full bg-purple-100 px-5 py-2">
                            <Sparkles size={14} className="text-purple-600" />
                            <span className="text-sm font-semibold text-purple-600 tracking-wide uppercase">
                Vì sao chọn Vạn Sao
              </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Làm gọn.{' '}
                            <span className="text-purple-600">Đúng nhu cầu.</span>{' '}
                            Đúng ngân sách.
                        </h2>

                        <p className="text-lg text-gray-500 leading-relaxed">
                            Vạn Sao là công ty công nghệ tập trung vào giải pháp website và sự kiện,
                            làm gọn – đúng nhu cầu – đúng ngân sách, đồng hành lâu dài thay vì
                            chỉ bàn giao xong là hết.
                        </p>

                        {/* Stats nhỏ */}
                        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
                            {[
                                { value: '100+', label: 'Dự án' },
                                { value: '24/7', label: 'Hỗ trợ' },
                                { value: '5★', label: 'Đánh giá' },
                            ].map(stat => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">{stat.value}</p>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="https://zalo.me/0866631679"
                            className="inline-flex items-center gap-2 w-fit rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-7 py-3.5 text-base font-semibold text-white shadow-md hover:from-purple-700 hover:to-purple-600 hover:scale-105 transition-all duration-200"
                        >
                            Liên hệ ngay
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    {/* Cột phải — 4 ưu điểm */}
                    <div
                        ref={rightRef}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                    >
                        {reasons.map(({ icon: Icon, title, description, color, number }, i) => {
                            const c = colorMap[color]
                            return (
                                <div
                                    key={title}
                                    className={`
                    group relative flex flex-col gap-4 rounded-2xl border p-7
                    transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg overflow-hidden
                    ${c.wrap}
                  `}
                                    style={{
                                        opacity: rightInView ? 1 : 0,
                                        transform: rightInView ? 'translateY(0)' : 'translateY(30px)',
                                        transitionDelay: rightInView ? `${i * 100}ms` : '0ms',
                                    }}
                                >
                                    {/* Background number */}
                                    <span className={`absolute top-2 right-3 text-6xl font-black transition-colors duration-300 select-none ${c.number}`}>
                    {number}
                  </span>

                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${c.icon}`}>
                                        <Icon size={24} />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                                        <p className="text-base text-gray-500 leading-relaxed">{description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </section>
    )
}