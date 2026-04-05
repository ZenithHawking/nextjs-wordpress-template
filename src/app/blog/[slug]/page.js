import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, Share2, ChevronRight } from 'lucide-react'
import { getPostBySlug, getLatestPosts } from '@/lib/wordpress'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    if (!post) return {}
    const title = post.title?.rendered?.replace(/<[^>]*>/g, '') ?? ''
    const description = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim().slice(0, 160) ?? ''
    const thumbnail = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
    return {
        title: `${title} | Vạn Sao`,
        description,
        openGraph: {
            title, description, type: 'article',
            locale: 'vi_VN',
            siteName: 'Vạn Sao',
            publishedTime: post.date, modifiedTime: post.modified,
            images: thumbnail ? [{ url: thumbnail, width: 1200, height: 630, alt: title }] : [],
        },
        twitter: { card: 'summary_large_image', title, description, images: thumbnail ? [thumbnail] : [] },
        alternates: { canonical: `https://vansao.com/blog/${slug}` },
    }
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
}

function stripHtml(html) {
    return html?.replace(/<[^>]*>/g, '').trim() ?? ''
}

function readingTime(content) {
    const words = stripHtml(content).split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200))
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params
    const [post, relatedPosts] = await Promise.all([getPostBySlug(slug), getLatestPosts(3)])
    if (!post) notFound()

    const thumbnail = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
    const title = post.title?.rendered?.replace(/<[^>]*>/g, '') ?? ''
    const minutes = readingTime(post.content?.rendered ?? '')
    const related = relatedPosts.filter(p => p.slug !== slug).slice(0, 2)
    const categoryName = post._embedded?.['wp:term']?.[0]?.[0]?.name ?? null

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: stripHtml(post.excerpt?.rendered ?? '').slice(0, 160),
        image: thumbnail ?? undefined,
        datePublished: post.date,
        dateModified: post.modified,
        author: { '@type': 'Organization', name: 'Vạn Sao' },
        publisher: { '@type': 'Organization', name: 'Vạn Sao', logo: { '@type': 'ImageObject', url: 'https://vansao.com/logo.png' } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://vansao.com/blog/${slug}` },
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <main className="bg-white min-h-screen">

                {/* ── Hero full width ── */}
                <section className="relative bg-gray-950 overflow-hidden" style={{ minHeight: '520px' }}>

                    {thumbnail ? (
                        <>
                            <Image src={thumbnail} alt={title} fill priority className="object-cover" style={{ opacity: 0.25 }} />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(3,7,18,0.4) 0%, rgba(3,7,18,0.8) 60%, rgba(3,7,18,0.97) 100%)' }} />
                        </>
                    ) : (
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #030712 100%)' }} />
                    )}

                    <div className="relative container mx-auto max-w-4xl px-6 flex flex-col items-center justify-center text-center" style={{ minHeight: '520px' }}>

                        {/* Badge danh mục */}
                        {categoryName && (
                            <span className="inline-block rounded-full bg-purple-600/30 border border-purple-500/40 px-4 py-1.5 text-xs font-bold text-purple-300 tracking-widest uppercase mb-6">
        {categoryName}
      </span>
                        )}

                        {/* Tiêu đề */}
                        <h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-8"
                            dangerouslySetInnerHTML={{ __html: post.title?.rendered ?? '' }}
                        />

                        {/* Meta */}
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
      <span className="flex items-center gap-2">
        <Calendar size={15} className="text-purple-400" />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </span>
                            <span className="flex items-center gap-2">
        <Clock size={15} className="text-purple-400" />
                                {minutes} phút đọc
      </span>
                        </div>

                    </div>
                </section>

                {/* ── Article Body + Sidebar ── */}
                <section className="py-14 bg-white">
                    <div className="container mx-auto max-w-6xl px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">

                            {/* Nội dung chính */}
                            <div>
                                {/* Tiêu đề lặp lại bên dưới cho content */}
                                <div className="mb-10 pb-8 border-b border-gray-100">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        {categoryName && (
                                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
                        {categoryName}
                      </span>
                                        )}
                                        <span className="text-sm text-gray-400 flex items-center gap-1.5">
                      <Calendar size={13} />
                                            {formatDate(post.date)}
                    </span>
                                        <span className="text-sm text-gray-400 flex items-center gap-1.5">
                      <Clock size={13} />
                                            {minutes} phút đọc
                    </span>
                                    </div>
                                    <h2
                                        className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug"
                                        dangerouslySetInnerHTML={{ __html: post.title?.rendered ?? '' }}
                                    />
                                </div>

                                <article
                                    className="
                    prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900
                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-gray-800
                    prose-p:text-gray-600 prose-p:leading-[1.85] prose-p:text-[1.05rem] prose-p:mb-5
                    prose-ul:text-gray-600 prose-ul:space-y-2 prose-ul:my-5
                    prose-ol:text-gray-600 prose-ol:space-y-2 prose-ol:my-5
                    prose-li:leading-[1.8]
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-a:text-purple-600 prose-a:no-underline hover:prose-a:text-purple-700
                    prose-blockquote:border-l-4 prose-blockquote:border-purple-400 prose-blockquote:bg-purple-50 prose-blockquote:rounded-r-xl prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic prose-blockquote:text-gray-700
                    prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
                    prose-hr:border-gray-200 prose-hr:my-10
                  "
                                    dangerouslySetInnerHTML={{ __html: post.content?.rendered ?? '' }}
                                />

                                {/* Share bottom */}
                                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4 flex-wrap">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Share2 size={15} />
                    Chia sẻ
                  </span>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=https://vansao.com/blog/${slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full border border-gray-200 px-5 py-2 text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                    >
                                        Facebook
                                    </a>
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=https://vansao.com/blog/${slug}&text=${encodeURIComponent(title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full border border-gray-200 px-5 py-2 text-sm text-gray-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all"
                                    >
                                        X / Twitter
                                    </a>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <aside className="flex flex-col gap-6 sticky top-24">

                                {/* CTA */}
                                <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 p-6 flex flex-col gap-4 text-white">
                                    <p className="text-xs font-semibold tracking-widest uppercase text-purple-200">Vạn Sao</p>
                                    <h3 className="text-lg font-bold leading-snug">Cần tư vấn về dịch vụ?</h3>
                                    <p className="text-sm text-purple-100 leading-relaxed">Đội ngũ Vạn Sao sẵn sàng hỗ trợ miễn phí, không ràng buộc.</p>
                                    <Link
                                        href="/lien-he"
                                        className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-purple-700 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200"
                                    >
                                        Liên hệ ngay
                                    </Link>
                                </div>

                                {/* Bài liên quan */}
                                {related.length > 0 && (
                                    <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
                                        <h3 className="text-base font-bold text-gray-900">Bài viết liên quan</h3>
                                        <div className="flex flex-col gap-4">
                                            {related.map(function(p) {
                                                const img = p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
                                                return (
                                                    <Link key={p.id} href={`/blog/${p.slug}`} className="group flex gap-3 hover:opacity-80 transition-opacity">
                                                        {img && (
                                                            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                                <Image src={img} alt={stripHtml(p.title?.rendered ?? '')} fill className="object-cover" />
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col gap-1 min-w-0">
                                                            <p className="text-xs text-gray-400">{formatDate(p.date)}</p>
                                                            <h4
                                                                className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug"
                                                                dangerouslySetInnerHTML={{ __html: p.title?.rendered ?? '' }}
                                                            />
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Dịch vụ */}
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 flex flex-col gap-4">
                                    <h3 className="text-base font-bold text-gray-900">Dịch vụ của Vạn Sao</h3>
                                    <div className="flex flex-col gap-1">
                                        <Link href="/dich-vu/dich-vu-thiet-ke-website" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors py-2 border-b border-gray-100">
                                            <ChevronRight size={14} className="text-purple-400 shrink-0" />
                                            Thiết kế Website
                                        </Link>
                                        <Link href="/dich-vu/dich-vu-su-kien-tiec-cuoi" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors py-2 border-b border-gray-100">
                                            <ChevronRight size={14} className="text-purple-400 shrink-0" />
                                            Sự kiện – Tiệc cưới
                                        </Link>
                                        <Link href="/dich-vu/dich-vu-chuyen-du-lieu" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors py-2">
                                            <ChevronRight size={14} className="text-purple-400 shrink-0" />
                                            Chuyển dữ liệu web
                                        </Link>
                                    </div>
                                </div>

                                {/* Share sidebar */}
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
                                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        <Share2 size={16} className="text-gray-400" />
                                        Chia sẻ bài viết
                                    </h3>
                                    <div className="flex gap-2">
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=https://vansao.com/blog/${slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                        >
                                            Facebook
                                        </a>
                                        <a
                                            href={`https://twitter.com/intent/tweet?url=https://vansao.com/blog/${slug}&text=${encodeURIComponent(title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all"
                                        >
                                            X / Twitter
                                        </a>
                                    </div>
                                </div>

                            </aside>
                        </div>
                    </div>
                </section>

                {/* CTA bottom */}
                <section className="py-16 bg-gray-950">
                    <div className="container mx-auto max-w-2xl px-6 text-center">
                        <p className="text-xs font-semibold tracking-widest uppercase text-purple-400 mb-3">Vạn Sao</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Cần tư vấn thêm?</h2>
                        <p className="text-gray-400 mb-8">Đội ngũ Vạn Sao sẵn sàng hỗ trợ bạn miễn phí.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/lien-he" className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-7 py-3.5 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">
                                Liên hệ ngay
                            </Link>
                            <Link href="/blog" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-700 px-7 py-3.5 text-sm font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition-colors">
                                <ArrowLeft size={15} />
                                Tất cả bài viết
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}