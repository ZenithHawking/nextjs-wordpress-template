'use client'

import Image from 'next/image'
import { Sparkles, ArrowUpRight } from 'lucide-react'

export default function BatRadarCard() {
    return (
        <a
            href="https://batradar.vansao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="vs-bat-card group relative flex flex-col gap-5 rounded-3xl p-8 cursor-pointer overflow-hidden"
            style={{
                background: 'var(--vs-navy)',
                color: '#fff',
                boxShadow: 'var(--vs-shadow-card)',
                transition: 'transform .25s, box-shadow .25s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = 'var(--vs-shadow-pop)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = 'var(--vs-shadow-card)'
            }}
        >
            {/* Glow accent */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute', right: -80, top: -80,
                    width: 260, height: 260,
                    background: 'radial-gradient(closest-side, rgba(255,194,60,0.35), transparent)',
                    pointerEvents: 'none',
                }}
            />

            {/* FREE badge */}
            <div className="relative z-10 flex items-center justify-between">
                <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full"
                    style={{ background: 'var(--vs-yellow)', color: 'var(--vs-navy)' }}
                >
                    <Sparkles size={11} />
                    MIỄN PHÍ MÃI MÃI
                </span>
                <span className="text-xs text-white/40">Windows</span>
            </div>

            {/* Icon */}
            <div className="relative z-10 w-16 h-16 rounded-2xl overflow-hidden">
                <Image
                    src="/batradar.png"
                    alt="BatRadar"
                    width={64}
                    height={64}
                    className="object-contain"
                />
            </div>

            {/* Title + description */}
            <div className="relative z-10 flex flex-col gap-3 flex-1">
                <h3 className="text-2xl font-bold tracking-tight">
                    BatRadar<span style={{ color: 'var(--vs-yellow)' }}>.</span>
                </h3>
                <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Ứng dụng máy tính giúp kỹ thuật viên và người dùng AI theo dõi mức sử dụng AI
                    đang chạy trên máy tính — minh bạch, dễ dùng.
                </p>
            </div>

            {/* CTA */}
            <div className="relative z-10 flex items-center justify-between pt-4 mt-2 border-t border-white/10">
                <span
                    className="inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: 'var(--vs-yellow)' }}
                >
                    Truy cập BatRadar
                    <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
            </div>
        </a>
    )
}
