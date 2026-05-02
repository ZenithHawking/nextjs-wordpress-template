'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Search, Sparkles, X } from 'lucide-react'

const PER_PAGE = 9

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    })
}

function stripHtml(html) {
    return html?.replace(/<[^>]*>/g, '').trim() ?? ''
}

function getPageRange(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const near = new Set(
        [1, total, current - 1, current, current + 1].filter(p => p >= 1 && p <= total)
    )
    const sorted = [...near].sort((a, b) => a - b)
    const result = []
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…')
        result.push(sorted[i])
    }
    return result
}

function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null
    const pages = getPageRange(page, totalPages)
    return (
        <div className="flex items-center justify-center gap-2 mt-16">
            {page > 1 ? (
                <button onClick={() => onChange(page - 1)} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors">
                    <ChevronLeft size={16} />
                </button>
            ) : (
                <span className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 text-gray-300 cursor-not-allowed">
                    <ChevronLeft size={16} />
                </span>
            )}
            {pages.map((p, i) =>
                p === '…' ? (
                    <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm select-none">…</span>
                ) : p === page ? (
                    <span key={p} className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-bold select-none">{p}</span>
                ) : (
                    <button key={p} onClick={() => onChange(p)} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors text-sm font-medium">
                        {p}
                    </button>
                )
            )}
            {page < totalPages ? (
                <button onClick={() => onChange(page + 1)} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors">
                    <ChevronRight size={16} />
                </button>
            ) : (
                <span className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 text-gray-300 cursor-not-allowed">
                    <ChevronRight size={16} />
                </span>
            )}
        </div>
    )
}

export default function BlogClient({ posts, categories }) {
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState(null)
    const [page, setPage] = useState(1)

    const filtered = useMemo(() => {
        let result = posts
        if (activeCategory !== null) {
            result = result.filter(p => p.categories?.includes(activeCategory))
        }
        const q = search.trim().toLowerCase()
        if (q) {
            result = result.filter(p =>
                stripHtml(p.title?.rendered ?? '').toLowerCase().includes(q) ||
                stripHtml(p.excerpt?.rendered ?? '').toLowerCase().includes(q)
            )
        }
        return result
    }, [posts, search, activeCategory])

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    function handleSearch(q) {
        setSearch(q)
        setPage(1)
    }

    function handleCategory(catId) {
        setActiveCategory(catId)
        setPage(1)
    }

    return (
        <main>
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto max-w-6xl px-6">

                    {/* Filter bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => handleCategory(null)}
                                className={`rounded-full px-5 py-2.5 text-base font-semibold transition-all duration-200 ${
                                    activeCategory === null
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                                }`}
                            >
                                Tất cả
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategory(cat.id)}
                                    className={`rounded-full px-5 py-2.5 text-base font-semibold transition-all duration-200 ${
                                        activeCategory === cat.id
                                            ? 'bg-purple-600 text-white shadow-md'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                                    }`}
                                >
                                    {cat.name}
                                    <span className="ml-2 text-xs opacity-60">({cat.count})</span>
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-52 shrink-0">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                                placeholder="Tìm bài viết..."
                                className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => handleSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search info */}
                    {search.trim() && (
                        <p className="text-sm text-gray-500 -mt-6 mb-8">
                            {filtered.length} kết quả cho <span className="font-semibold text-gray-700">&ldquo;{search.trim()}&rdquo;</span>
                        </p>
                    )}

                    {/* Posts grid */}
                    {paginated.length === 0 ? (
                        <div className="text-center py-20 flex flex-col items-center gap-4">
                            <Sparkles size={40} className="text-gray-300" />
                            <p className="text-xl text-gray-400">
                                {search.trim()
                                    ? `Không tìm thấy bài viết nào cho "${search.trim()}".`
                                    : 'Chưa có bài viết nào trong danh mục này.'}
                            </p>
                            {(search || activeCategory) && (
                                <button
                                    onClick={() => { handleSearch(''); setActiveCategory(null) }}
                                    className="text-base text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    Xem tất cả bài viết
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {paginated.map(post => {
                                    const thumbnail = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
                                    const excerpt = stripHtml(post.excerpt?.rendered ?? '')
                                    return (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${post.slug}`}
                                            className="group flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative h-52 w-full overflow-hidden bg-purple-50">
                                                {thumbnail ? (
                                                    <Image
                                                        src={thumbnail}
                                                        alt={stripHtml(post.title?.rendered ?? '')}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50">
                                                        <Sparkles size={40} className="text-purple-300" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col gap-3 p-7 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <CalendarDays size={14} />
                                                        <span>{formatDate(post.date)}</span>
                                                    </div>
                                                    {post._embedded?.['wp:term']?.[0]?.[0]?.name && (
                                                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
                                                            {post._embedded['wp:term'][0][0].name}
                                                        </span>
                                                    )}
                                                </div>
                                                <h2
                                                    className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2"
                                                    dangerouslySetInnerHTML={{ __html: post.title?.rendered ?? '' }}
                                                />
                                                <p className="text-base text-gray-500 leading-relaxed line-clamp-3">{excerpt}</p>
                                                <div className="mt-auto pt-3 flex items-center gap-1.5 text-base font-semibold text-purple-500 group-hover:text-purple-700 transition-colors">
                                                    Đọc thêm
                                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>

                            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                        </>
                    )}

                </div>
            </section>
        </main>
    )
}