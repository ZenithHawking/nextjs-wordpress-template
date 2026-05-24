'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Sparkles, Search, ArrowRight } from 'lucide-react'

const navLinks = [
    { href: '/',            label: 'Trang chủ' },
    { href: '/gioi-thieu', label: 'Giới thiệu' },
    { href: '/dich-vu',    label: 'Dịch vụ' },
    { href: '/blog',       label: 'Bài viết' },
    { href: '/lien-he',    label: 'Liên hệ' },
]

export default function Header() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* Topbar — friendly greeting + hotline */}
            <div className="vs-topbar">
                <div className="inner">
                    <span className="greet">
                        <Sparkles size={13} />
                        Chào bạn, Vạn Sao đang nhận dự án năm 2026
                    </span>
                    <span className="grow" />
                    <span className="hidden md:inline">Hotline: <a href="tel:0866631679"><b>08 666 31679</b></a></span>
                    <span className="sep hidden md:inline">•</span>
                    <span>Zalo: <a href="https://zalo.me/0866631679" target="_blank" rel="noopener noreferrer"><b>@vansao</b></a></span>
                </div>
            </div>

            <header className="vs-hdr">
                <div className="inner">
                    {/* Logo */}
                    <Link href="/" className="brand" aria-label="Vạn Sao — Trang chủ">
                        <Image
                            src="/logo.png"
                            alt="Vạn Sao"
                            width={36}
                            height={36}
                            className="object-contain"
                            loading="eager"
                            priority
                        />
                        <span className="wordmark">Vạn Sao</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav aria-label="Điều hướng chính">
                        {navLinks.map(link => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={isActive ? 'active' : ''}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* CTA + mobile toggle */}
                    <div className="actions">
                        <button className="ghost hidden md:inline-flex" aria-label="Tìm kiếm">
                            <Search size={16} />
                        </button>
                        <Link
                            href="https://zalo.me/0866631679"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta hidden md:inline-flex"
                        >
                            <Sparkles size={13} className="star" />
                            Liên hệ ngay
                            <ArrowRight size={14} />
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden p-2 rounded-md text-vs-ink-2 hover:bg-vs-bg-2"
                            onClick={() => setOpen(!open)}
                            aria-label="Menu"
                        >
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                {open ? (
                                    <>
                                        <line x1="4" y1="4" x2="18" y2="18"/>
                                        <line x1="18" y1="4" x2="4" y2="18"/>
                                    </>
                                ) : (
                                    <>
                                        <line x1="3" y1="7" x2="19" y2="7"/>
                                        <line x1="3" y1="11" x2="19" y2="11"/>
                                        <line x1="3" y1="15" x2="19" y2="15"/>
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {open && (
                    <div className="md:hidden border-t border-vs-line bg-white px-6 pb-5 pt-2">
                        {navLinks.map(link => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={`
                                        flex items-center gap-2 py-3 text-base font-medium
                                        border-b border-vs-line/50 last:border-0 transition-colors
                                        ${isActive ? 'text-vs-purple' : 'text-vs-ink-2 hover:text-vs-purple'}
                                    `}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-vs-yellow' : 'bg-vs-ink-4'}`} />
                                    {link.label}
                                </Link>
                            )
                        })}
                        <Link
                            href="https://zalo.me/0866631679"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpen(false)}
                            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-vs-ink-1 px-5 py-3 text-sm font-semibold text-white"
                        >
                            <Sparkles size={14} />
                            Liên hệ ngay
                        </Link>
                    </div>
                )}
            </header>
        </>
    )
}
