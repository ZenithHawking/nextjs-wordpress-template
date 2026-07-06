'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, Search, Sparkles, X } from 'lucide-react'

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

const thumbVariants = ['', 'alt-1', 'alt-2']

export default function BlogClient({ posts, categories }) {
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState(null)
    const [page, setPage] = useState(1)

    const filtered = useMemo(() => {
        let result = posts
        if (activeCategory !== null) {
            result = result.filter(p =>
                p.categories?.some(c => c.categories_id?.id === activeCategory)
            )
        }
        const q = search.trim().toLowerCase()
        if (q) {
            result = result.filter(p =>
                (p.title ?? '').toLowerCase().includes(q) ||
                stripHtml(p.excerpt ?? '').toLowerCase().includes(q)
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
        <main className="vs-blog-page">

            {/* Hero */}
            <section className="vs-blog-hero">
                <div className="vs-shell">
                    <h1>
                        Kiến thức thật — từ dự án thật
                    </h1>
                    <p className="lead">
                        Chia sẻ kinh nghiệm thiết kế website, công nghệ sự kiện và giải pháp số từ đội ngũ Vạn Sao.
                    </p>
                </div>
            </section>

            {/* Filter + Content */}
            <section className="vs-blog-body">
                <div className="vs-shell">

                    {/* Filter bar */}
                    <div className="vs-blog-filters">
                        <div className="cats">
                            <button
                                onClick={() => handleCategory(null)}
                                className={`pill ${activeCategory === null ? 'active' : ''}`}
                            >
                                Tất cả
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategory(cat.id)}
                                    className={`pill ${activeCategory === cat.id ? 'active' : ''}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="search-box">
                            <Search size={15} className="icon" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                                placeholder="Tìm bài viết..."
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => handleSearch('')}
                                    className="clear"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search info */}
                    {search.trim() && (
                        <p className="vs-blog-search-info">
                            {filtered.length} kết quả cho &ldquo;{search.trim()}&rdquo;
                        </p>
                    )}

                    {/* Posts grid */}
                    {paginated.length === 0 ? (
                        <div className="vs-blog-empty">
                            <Sparkles size={40} />
                            <p>
                                {search.trim()
                                    ? `Không tìm thấy bài viết nào cho "${search.trim()}".`
                                    : 'Chưa có bài viết nào trong danh mục này.'}
                            </p>
                            {(search || activeCategory) && (
                                <button onClick={() => { handleSearch(''); setActiveCategory(null) }} className="reset">
                                    Xem tất cả bài viết
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="vs-blog-grid">
                                {paginated.map((post, i) => {
                                    const thumbnail = post.featured_image ?? null
                                    const excerpt = stripHtml(post.excerpt ?? '')
                                    const variant = thumbVariants[i % thumbVariants.length]
                                    const catName = post.categories?.[0]?.categories_id?.name ?? null

                                    return (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${post.slug}`}
                                            className="vs-post-card"
                                        >
                                            <div className={`thumb ${thumbnail ? '' : variant}`}>
                                                {thumbnail ? (
                                                    <Image
                                                        src={thumbnail}
                                                        alt={post.title ?? ''}
                                                        fill
                                                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                                                        className="object-cover"
                                                        style={{ position: 'absolute', inset: 0 }}
                                                    />
                                                ) : null}
                                            </div>

                                            <div className="meta">
                                                <span className="cat">{catName ?? 'Vạn Sao'}</span>
                                                <span className="sep" />
                                                <span>{formatDate(post.date_created)}</span>
                                            </div>

                                            <h3>{post.title ?? ''}</h3>

                                            {excerpt && <p className="excerpt">{excerpt}</p>}

                                            <span className="more">
                                                Đọc bài viết
                                                <ArrowRight size={14} />
                                            </span>
                                        </Link>
                                    )
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="vs-blog-pagination">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page <= 1}
                                        className="pg-btn"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    {getPageRange(page, totalPages).map((p, i) =>
                                        p === '…' ? (
                                            <span key={`dots-${i}`} className="dots">…</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`pg-btn ${p === page ? 'active' : ''}`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}

                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= totalPages}
                                        className="pg-btn"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </section>
        </main>
    )
}
