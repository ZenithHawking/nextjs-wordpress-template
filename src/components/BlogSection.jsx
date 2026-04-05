import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import { getLatestPosts } from '@/lib/wordpress'

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

function stripHtml(html) {
    return html?.replace(/<[^>]*>/g, '').trim() ?? ''
}

export default async function BlogSection() {
    const posts = await getLatestPosts(3)

    if (!posts.length) return null

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto max-w-6xl px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                    <div className="flex flex-col gap-4">
            <span className="inline-block w-fit rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-600 tracking-wide uppercase">
              Blog & Tin tức
            </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Bài viết{' '}
                            <span className="text-purple-600">mới nhất</span>
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 w-fit rounded-full border border-purple-200 bg-white px-6 py-3 text-base font-semibold text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shrink-0"
                    >
                        Xem tất cả
                        <ArrowRight size={17} />
                    </Link>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => {
                        const thumbnail = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
                        const excerpt = stripHtml(post.excerpt?.rendered ?? '')
                        const slug = post.slug

                        return (
                            <Link
                                key={post.id}
                                href={`/blog/${slug}`}
                                className="group flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-52 w-full overflow-hidden bg-purple-50">
                                    {thumbnail ? (
                                        <Image
                                            src={thumbnail}
                                            alt={post.title?.rendered ?? ''}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50">
                                            <span className="text-4xl">✦</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-3 p-7 flex-1">
                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                        {formatDate(post.date)}
                    </span>
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: post.title?.rendered ?? '' }}
                                    />

                                    {/* Excerpt */}
                                    <p className="text-base text-gray-500 leading-relaxed line-clamp-3">
                                        {excerpt}
                                    </p>

                                    {/* Read more */}
                                    <div className="mt-auto pt-3 flex items-center gap-1.5 text-base font-semibold text-purple-500 group-hover:text-purple-700 transition-colors">
                                        Đọc thêm
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}