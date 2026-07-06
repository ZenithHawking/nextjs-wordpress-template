'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowUpRight, ExternalLink, X } from 'lucide-react'

// Hardcoded website samples revealed when the card is opened
const samples = [
    {
        name: 'Thuê xe',
        img: '/thuexe.png',
        desc: 'Web chuyên cho thuê xe, giới thiệu xe phong cách hiện đại.',
        href: 'https://thuexe.vansao.com',
    },
    {
        name: 'Dolphy',
        img: '/dolphy.png',
        desc: 'Mạng xã hội đăng các bài viết tin tức thời sự.',
        href: 'https://dolphy.vansao.com',
    },
]

export default function WebSamplesCard() {
    const [open, setOpen] = useState(false)

    // Close on Esc + lock body scroll while the modal is open
    useEffect(() => {
        if (!open) return
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
        document.addEventListener('keydown', onKey)
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = prev
        }
    }, [open])

    return (
        <>
            <div
                role="button"
                tabIndex={0}
                className="vs-service-card yellow web-samples-trigger"
                onClick={() => setOpen(true)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true) } }}
            >
                <span className="num-ghost">04</span>
                <span className="badge">Web mẫu</span>
                <div className="icon-box">
                    <Image src="/webmau.png" alt="Web mẫu" width={32} height={32} className="object-contain" />
                </div>
                <h2>Các web mẫu</h2>
                <p>Xem qua một vài website Vạn Sao đã xây dựng cho khách hàng.</p>
                <span className="more">
                    Xem web mẫu
                    <ArrowUpRight size={15} />
                </span>
            </div>

            {open && (
                <div
                    className="vs-web-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Web mẫu"
                    onClick={() => setOpen(false)}
                >
                    <div className="panel" onClick={(e) => e.stopPropagation()}>
                        <header className="panel-head">
                            <h3>Các web mẫu</h3>
                            <button type="button" className="close" onClick={() => setOpen(false)} aria-label="Đóng">
                                <X size={18} />
                            </button>
                        </header>

                        <div className="cards">
                            {samples.map((s) => (
                                <article key={s.name} className="card">
                                    <div className="thumb">
                                        <Image src={s.img} alt={s.name} width={72} height={72} className="object-contain" />
                                    </div>
                                    <div className="body">
                                        <h4>{s.name}</h4>
                                        <p>{s.desc}</p>
                                    </div>
                                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="try">
                                        Xem thử
                                        <ExternalLink size={14} />
                                    </a>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
