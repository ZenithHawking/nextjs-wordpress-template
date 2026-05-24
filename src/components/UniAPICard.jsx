'use client'

import Image from 'next/image'
import { Sparkles, ArrowUpRight } from 'lucide-react'

export default function UniAPICard() {
    return (
        <a
            href="https://school.vansao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="vs-uniapi-card group relative flex flex-col gap-5 rounded-3xl p-8 cursor-pointer overflow-hidden"
        >
            {/* Glow accent */}
            <div className="glow" aria-hidden="true" />

            {/* Badge */}
            <div className="relative z-10 flex items-center justify-between">
                <span className="badge">
                    <Sparkles size={11} />
                    OPEN API
                </span>
                <span className="version">Miễn phí</span>
            </div>

            {/* Icon */}
            <div className="relative z-10 w-16 h-16 rounded-2xl overflow-hidden">
                <Image
                    src="/uniapi.png"
                    alt="UniAPI"
                    width={64}
                    height={64}
                    className="object-contain"
                />
            </div>

            {/* Title + description */}
            <div className="relative z-10 flex flex-col gap-3 flex-1">
                <h3 className="title">
                    UniAPI<span className="dot">.</span>
                </h3>
                <p className="desc">
                    Open API tra cứu thông tin trường đại học & cao đẳng Việt Nam —
                    tên trường, khoa, ngành học. Dành cho developer và ứng dụng giáo dục.
                </p>
            </div>

            {/* CTA */}
            <div className="relative z-10 flex items-center justify-between pt-4 mt-2 border-t border-white/10">
                <span className="cta">
                    Xem API docs
                    <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
            </div>
        </a>
    )
}
