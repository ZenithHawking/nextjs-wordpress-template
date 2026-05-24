'use client'

import Image from 'next/image'
import { Sparkles, ArrowUpRight } from 'lucide-react'

export default function UniAPICard() {
    return (
        <a
            href="https://school.vansao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="vs-featured-card vs-uniapi-card group"
        >
            <div className="glow" aria-hidden="true" />

            <div className="relative z-10 flex items-center justify-between">
                <span className="badge">
                    <Sparkles size={11} />
                    OPEN API
                </span>
                <span className="tag">Miễn phí</span>
            </div>

            <div className="relative z-10 icon-box">
                <Image
                    src="/uniapi.png"
                    alt="UniAPI"
                    width={32}
                    height={32}
                    className="object-contain"
                />
            </div>

            <div className="relative z-10 flex flex-col gap-3 flex-1">
                <h3 className="title">
                    UniAPI<span className="dot">.</span>
                </h3>
                <p className="desc">
                    Open API tra cứu thông tin trường đại học & cao đẳng Việt Nam —
                    tên trường, khoa, ngành học. Dành cho developer.
                </p>
            </div>

            <div className="relative z-10 cta-row">
                <span className="cta">
                    Xem API docs
                    <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
            </div>
        </a>
    )
}
