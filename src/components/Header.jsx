'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { Sparkles, Search, ArrowRight, X, FileText, Wrench, Loader2 } from 'lucide-react'

const navLinks = [
    { href: '/',            label: 'Trang chủ' },
    { href: '/gioi-thieu', label: 'Giới thiệu' },
    { href: '/dich-vu',    label: 'Dịch vụ' },
    { href: '/blog',       label: 'Bài viết' },
    { href: '/lien-he',    label: 'Liên hệ' },
]

// Kept in sync with the service cards on /dich-vu — used for local search matching only.
const services = [
    { title: 'Thiết kế Website', desc: 'Thiết kế theo yêu cầu, chuẩn SEO, tối ưu tốc độ.', href: '/dich-vu/dich-vu-thiet-ke-website' },
    { title: 'Sự kiện – Tiệc cưới', desc: 'Check-in công nghệ, tìm ảnh nhanh, hỗ trợ vận hành sự kiện.', href: '/dich-vu/dich-vu-su-kien-tiec-cuoi' },
    { title: 'Chuyển dữ liệu web', desc: 'Chuyển bài viết, sản phẩm, hình ảnh giữa các website an toàn.', href: '/dich-vu/dich-vu-chuyen-du-lieu' },
]

function normalize(str) {
    return str
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
}

function useSearch() {
    const [query, setQuery] = useState('')
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const debounceRef = useRef(null)
    const abortRef = useRef(null)

    const matchedServices = query.trim()
        ? services.filter(s => normalize(`${s.title} ${s.desc}`).includes(normalize(query.trim())))
        : []

    useEffect(() => {
        clearTimeout(debounceRef.current)
        const q = query.trim()

        if (!q) {
            setPosts([])
            setLoading(false)
            return
        }

        setLoading(true)
        debounceRef.current = setTimeout(async () => {
            abortRef.current?.abort()
            const controller = new AbortController()
            abortRef.current = controller
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
                const data = await res.json()
                setPosts(data.posts ?? [])
            } catch {
                // ignore aborted/failed requests
            } finally {
                setLoading(false)
            }
        }, 350)

        return () => clearTimeout(debounceRef.current)
    }, [query])

    return { query, setQuery, posts, matchedServices, loading }
}

function SearchPanel({ onClose }) {
    const { query, setQuery, posts, matchedServices, loading } = useSearch()
    const router = useRouter()
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [onClose])

    function goToBlogSearch() {
        if (!query.trim()) return
        router.push(`/blog?search=${encodeURIComponent(query.trim())}`)
        onClose()
    }

    const hasResults = posts.length > 0 || matchedServices.length > 0
    const showEmpty = query.trim() && !loading && !hasResults

    return (
        <div className="vs-search-panel">
            <div className="vs-shell vs-search-panel-inner">
                <div className="row">
                    <Search size={18} className="lead-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && goToBlogSearch()}
                        placeholder="Tìm bài viết, dịch vụ..."
                    />
                    {loading && <Loader2 size={16} className="spin" />}
                    <button className="close" onClick={onClose} aria-label="Đóng tìm kiếm">
                        <X size={18} />
                    </button>
                </div>

                {(hasResults || showEmpty) && (
                    <div className="results">
                        {matchedServices.length > 0 && (
                            <div className="group">
                                <span className="group-label"><Wrench size={12} /> Dịch vụ</span>
                                {matchedServices.map(s => (
                                    <Link key={s.href} href={s.href} onClick={onClose} className="result">
                                        <span className="t">{s.title}</span>
                                        <span className="d">{s.desc}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {posts.length > 0 && (
                            <div className="group">
                                <span className="group-label"><FileText size={12} /> Bài viết</span>
                                {posts.map(p => (
                                    <Link key={p.slug} href={`/blog/${p.slug}`} onClick={onClose} className="result">
                                        <span className="t">{p.title}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {showEmpty && (
                            <p className="empty">Không tìm thấy kết quả cho “{query.trim()}”.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function Header() {
    const [open, setOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
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
                    <Link href="/" className="brand" aria-label="Vạn Sao — Trang chủ" onClick={() => setSearchOpen(false)}>
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
                                    onClick={() => setSearchOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* CTA + mobile toggle */}
                    <div className="actions">
                        <button
                            className={`ghost hidden md:inline-flex ${searchOpen ? 'is-active' : ''}`}
                            aria-label="Tìm kiếm"
                            aria-expanded={searchOpen}
                            onClick={() => setSearchOpen(v => !v)}
                        >
                            {searchOpen ? <X size={16} /> : <Search size={16} />}
                        </button>
                        <Link
                            href="https://zalo.me/0866631679"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta hidden md:inline-flex"
                        >
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

                {/* Desktop search panel */}
                {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}

                {/* Mobile menu */}
                {open && (
                    <div className="md:hidden border-t border-vs-line bg-white px-6 pb-5 pt-4">
                        <MobileSearch onNavigate={() => setOpen(false)} />
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
                            Liên hệ ngay
                        </Link>
                    </div>
                )}
            </header>
        </>
    )
}

function MobileSearch({ onNavigate }) {
    const router = useRouter()
    const [value, setValue] = useState('')

    function submit() {
        const q = value.trim()
        if (!q) return
        router.push(`/blog?search=${encodeURIComponent(q)}`)
        onNavigate()
    }

    return (
        <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-vs-ink-4 pointer-events-none" />
            <input
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="Tìm bài viết, dịch vụ..."
                className="w-full rounded-full border border-vs-line bg-vs-bg py-2.5 pl-9 pr-4 text-sm text-vs-ink-1 placeholder-vs-ink-4 outline-none focus:border-vs-purple"
            />
        </div>
    )
}
