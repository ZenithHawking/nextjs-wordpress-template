'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarDays, Sparkles } from 'lucide-react'

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    })
}

function stripHtml(html) {
    return html?.replace(/<[^>]*>/g, '').trim() ?? ''
}

export default function BlogClient({ posts, total, categories }) {
    const [activeCategory, setActiveCategory] = useState(null)

    const filtered = activeCategory
        ? posts.filter(p => p.categories?.includes(activeCategory))
        : posts

    return (
        <main>

            {/* Hero */}
            <section className="relative py-24 bg-gray-950 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-gray-950 to-gray-950" />
                <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl" />
                <div className="relative container mx-auto max-w-4xl px-6 text-center flex flex-col items-center gap-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2">
                        <Sparkles size={14} className="text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-300">Blog & Chia sẻ</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Kiến thức & <span className="text-yellow-400">Góc nhìn</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                        Chia sẻ về thiết kế website, công nghệ sự kiện và giải pháp số từ đội ngũ Vạn Sao.
                    </p>
                    <p className="text-sm text-gray-500">{total} bài viết</p>
                </div>
            </section>

            {/* Filter + Posts */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto max-w-6xl px-6">

                    {/* Category filter */}
                    <div className="flex flex-wrap items-center gap-3 mb-12">
                        <button
                            onClick={() => setActiveCategory(null)}
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
                                onClick={() => setActiveCategory(cat.id)}
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

                    {/* Posts grid */}
                    {filtered.length === 0 ? (
                        <div className="text-center py-20 flex flex-col items-center gap-4">
                            <Sparkles size={40} className="text-gray-300" />
                            <p className="text-xl text-gray-400">Chưa có bài viết nào trong danh mục này.</p>
                            <button
                                onClick={() => setActiveCategory(null)}
                                className="text-base text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Xem tất cả bài viết
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {filtered.map(post => {
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
                                                {/* Category badge */}
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
                    )}

                </div>
            </section>

        </main>
    )
}