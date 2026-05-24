'use client'

import { useRef, useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

const steps = [
    { num: '01', title: 'Tư vấn & đề xuất', desc: 'Lắng nghe nhu cầu, mục tiêu và ngân sách. Đưa ra giải pháp phù hợp, tối ưu chi phí và hiệu quả.' },
    { num: '02', title: 'Báo giá rõ ràng', desc: 'Thống nhất chi phí, phạm vi công việc, không phát sinh mập mờ.' },
    { num: '03', title: 'Thiết kế & phát triển', desc: 'Triển khai website hoặc setup sự kiện theo yêu cầu đã duyệt.' },
    { num: '04', title: 'Kiểm tra & bàn giao', desc: 'Test kỹ, chỉnh sửa theo feedback trước khi bàn giao hoàn chỉnh.' },
    { num: '05', title: 'Hỗ trợ & bảo hành', desc: 'Đồng hành lâu dài, hỗ trợ kỹ thuật và xử lý khi cần.' },
]

export default function ProcessTimeline() {
    const containerRef = useRef(null)
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        function handleScroll() {
            const rect = container.getBoundingClientRect()
            const scrolled = -rect.top
            const totalScroll = container.offsetHeight - window.innerHeight

            if (scrolled <= 0) {
                setActiveIndex(0)
                return
            }
            if (scrolled >= totalScroll) {
                setActiveIndex(steps.length - 1)
                return
            }

            const progress = scrolled / totalScroll
            const index = Math.min(
                steps.length - 1,
                Math.floor(progress * steps.length)
            )
            setActiveIndex(index)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <section
            ref={containerRef}
            className="vs-process-sticky"
            id="quy-trinh"
            style={{ height: `${steps.length * 60}vh` }}
        >
            <div className="vs-process-inner">
                <div className="vs-shell">
                    <header className="vs-sec-head dark">
                        <div className="left">
                            <span className="vs-eyebrow yellow">
                                <Sparkles size={13} />
                                Quy trình
                            </span>
                            <h2>
                                Quy trình <span className="hl-yellow">5 SAO</span>
                            </h2>
                        </div>
                    </header>

                    <div className="vs-process-layout">
                        {/* Progress bar bên trái */}
                        <div className="vs-process-nav">
                            {steps.map((step, i) => (
                                <div
                                    key={step.num}
                                    className={`nav-dot ${i < activeIndex ? 'done' : ''} ${i === activeIndex ? 'active' : ''}`}
                                >
                                    <span className="num">{step.num}</span>
                                    <span className="title">{step.title}</span>
                                </div>
                            ))}
                            <div
                                className="nav-progress"
                                style={{ height: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                            />
                        </div>

                        {/* Nội dung step hiện tại */}
                        <div className="vs-process-content">
                            <div className="step-num">{steps[activeIndex].num}</div>
                            <h3 className="step-title">{steps[activeIndex].title}</h3>
                            <p className="step-desc">{steps[activeIndex].desc}</p>
                            <div className="step-counter">
                                Bước {activeIndex + 1} / {steps.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
