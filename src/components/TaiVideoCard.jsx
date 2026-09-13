'use client'

import { Sparkles, ArrowUpRight } from 'lucide-react'
import Mascot, { MASCOTS } from '@/components/Mascot'

export default function TaiVideoCard() {
    return (
        <a
            href="https://tai.vansao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="vs-featured-card vs-taivideo-card mascot-host group"
        >
            <div className="glow" aria-hidden="true" />

            <div className="relative z-10 flex items-center justify-between">
                <span className="badge">
                    <Sparkles size={11} />
                    MIỄN PHÍ
                </span>
                <span className="tag">Web App</span>
            </div>

            <div className="relative z-10 icon-box">
                <Mascot name={MASCOTS.phuThuy} size={44} motion="none" />
            </div>

            <div className="relative z-10 flex flex-col gap-3 flex-1">
                <h3 className="title">
                    Tải video<span className="dot">.</span>
                </h3>
                <p className="desc">
                    Tải video từ YouTube, TikTok, Facebook, Instagram, X và nhiều nền tảng
                    khác — không watermark, chọn chất lượng, miễn phí.
                </p>
            </div>

            <div className="relative z-10 cta-row">
                <span className="cta">
                    Dùng miễn phí
                    <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
            </div>
        </a>
    )
}
