'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'

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
        <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="container mx-auto flex h-18 items-center justify-between px-6 max-w-6xl">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <Image
                        src="/logo.png"
                        alt="Vạn Sao"
                        width={60}
                        height={60}
                        className="object-contain"
                        loading="eager"
                        priority
                    />
                    <span className="text-xl font-bold tracking-tight text-gray-800 group-hover:text-purple-700 transition-colors">
            Vạn Sao
          </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-0.5">
                    {navLinks.map(link => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
    relative px-4 py-2 text-base font-medium rounded-md transition-all duration-200
    group
    ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}
  `}
                            >
                                {/* Background hover */}
                                <span className="absolute inset-0 rounded-md bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                {/* Underline — để ngoài overflow */}
                                <span
                                    className={`
      absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-yellow-400
      transition-transform duration-300 origin-left
      ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
    `}
                                />

                                <span className="relative">{link.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* CTA button */}
                <Link
                    href="https://zalo.me/0866631679"
                    className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-purple-200 hover:from-purple-700 hover:to-purple-600 hover:scale-105 transition-all duration-200"
                >
                    <Sparkles size={14} />
                    Liên hệ ngay
                </Link>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
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

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-5 pt-2">
                    {navLinks.map(link => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={`
                  flex items-center gap-2 py-3 text-base font-medium border-b border-gray-50 last:border-0 transition-colors
                  ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}
                `}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                                {link.label}
                            </Link>
                        )
                    })}
                    <Link
                        href="https://zalo.me/0866631679"
                        onClick={() => setOpen(false)}
                        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white"
                    >
                        <Sparkles size={14} />
                        Liên hệ ngay
                    </Link>
                </div>
            )}
        </header>
    )
}