'use client'

import { QrCode, Sparkles, ArrowUpRight } from 'lucide-react'

export default function QRCard() {
    return (
        <a
            href="https://qr.vansao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="vs-featured-card vs-qr-card group"
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
                <QrCode size={32} strokeWidth={1.6} />
            </div>

            <div className="relative z-10 flex flex-col gap-3 flex-1">
                <h3 className="title">
                    Tạo mã QR<span className="dot">.</span>
                </h3>
                <p className="desc">
                    Tạo QR từ link web, WiFi, vCard, email, số điện thoại và văn bản.
                    Tùy chỉnh màu sắc, logo theo ý thích.
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
