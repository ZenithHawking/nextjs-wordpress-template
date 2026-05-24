import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, ChevronRight, Sparkles } from 'lucide-react'
import { getPostBySlug, getLatestPosts } from '@/lib/directus'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    if (!post) return {}
    const title = post.title ?? ''
    const description = (post.excerpt ?? '').replace(/<[^>]*>/g, '').trim().slice(0, 160)
    const thumbnail = post.featured_image ?? null
    return {
        title: `${title} | Vạn Sao`,
        description,
        openGraph: {
            title, description, type: 'article',
            locale: 'vi_VN',
            siteName: 'Vạn Sao',
            publishedTime: post.date_created, modifiedTime: post.date_updated,
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

    const thumbnail = post.featured_image ?? null
    const title = post.title ?? ''
    const minutes = readingTime(post.content ?? '')
    const related = relatedPosts.filter(p => p.slug !== slug).slice(0, 2)
    const categoryName = post.categories?.[0]?.categories_id?.name ?? null

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: stripHtml(post.excerpt ?? '').slice(0, 160),
        image: thumbnail ?? undefined,
        datePublished: post.date_created,
        dateModified: post.date_updated,
        author: { '@type': 'Organization', name: 'Vạn Sao' },
        publisher: { '@type': 'Organization', name: 'Vạn Sao', logo: { '@type': 'ImageObject', url: 'https://vansao.com/logo.png' } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://vansao.com/blog/${slug}` },
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <main className="vs-post-detail">

                {/* Hero */}
                <section className="vs-post-hero">
                    {thumbnail && (
                        <>
                            <Image src={thumbnail} alt={title} fill priority className="object-cover hero-bg" />
                            <div className="overlay" />
                        </>
                    )}
                    {!thumbnail && <div className="overlay-solid" />}

                    <div className="vs-shell inner">
                        {categoryName && (
                            <span className="cat-badge">{categoryName}</span>
                        )}
                        <h1>{title}</h1>
                        <div className="meta">
                            <span><Calendar size={15} /> <time dateTime={post.date_created}>{formatDate(post.date_created)}</time></span>
                            <span><Clock size={15} /> {minutes} phút đọc</span>
                        </div>
                    </div>
                </section>

                {/* Body + Sidebar */}
                <section className="vs-post-body">
                    <div className="vs-shell">
                        <div className="layout">

                            {/* Article */}
                            <div className="article-col">
                                <article
                                    className="vs-prose prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
                                />

                                {/* Share */}
                                <div className="share-bar">
                                    <span className="label"><Share2 size={15} /> Chia sẻ</span>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=https://vansao.com/blog/${slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-btn"
                                    >
                                        Facebook
                                    </a>
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=https://vansao.com/blog/${slug}&text=${encodeURIComponent(title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-btn"
                                    >
                                        X / Twitter
                                    </a>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <aside className="sidebar-col">

                                {/* CTA */}
                                <div className="sidebar-cta">
                                    <p className="eyebrow">Vạn Sao</p>
                                    <h3>Cần tư vấn về dịch vụ?</h3>
                                    <p className="desc">Đội ngũ Vạn Sao sẵn sàng hỗ trợ miễn phí, không ràng buộc.</p>
                                    <Link href="/lien-he" className="btn">Liên hệ ngay</Link>
                                </div>

                                {/* Related */}
                                {related.length > 0 && (
                                    <div className="sidebar-card">
                                        <h3>Bài viết liên quan</h3>
                                        <div className="related-list">
                                            {related.map(function(p) {
                                                const img = p.featured_image ?? null
                                                return (
                                                    <Link key={p.id} href={`/blog/${p.slug}`} className="related-item">
                                                        {img && (
                                                            <div className="thumb">
                                                                <Image src={img} alt={p.title ?? ''} fill className="object-cover" />
                                                            </div>
                                                        )}
                                                        <div className="text">
                                                            <span className="date">{formatDate(p.date_created)}</span>
                                                            <h4>{p.title ?? ''}</h4>
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Services */}
                                <div className="sidebar-card muted">
                                    <h3>Dịch vụ của Vạn Sao</h3>
                                    <div className="svc-links">
                                        <Link href="/dich-vu/dich-vu-thiet-ke-website">
                                            <ChevronRight size={14} /> Thiết kế Website
                                        </Link>
                                        <Link href="/dich-vu/dich-vu-su-kien-tiec-cuoi">
                                            <ChevronRight size={14} /> Sự kiện – Tiệc cưới
                                        </Link>
                                        <Link href="/dich-vu/dich-vu-chuyen-du-lieu">
                                            <ChevronRight size={14} /> Chuyển dữ liệu web
                                        </Link>
                                    </div>
                                </div>
                            </aside>

                        </div>
                    </div>
                </section>

                {/* CTA bottom */}
                <section className="vs-post-cta-bottom">
                    <div className="vs-shell">
                        <div className="card">
                            <div className="bg-blob" />
                            <h2>Cần tư vấn thêm?</h2>
                            <p>Đội ngũ Vạn Sao sẵn sàng hỗ trợ bạn miễn phí.</p>
                            <div className="actions">
                                <Link href="/lien-he" className="btn-primary">
                                    <Sparkles size={14} className="star" />
                                    Liên hệ ngay
                                </Link>
                                <Link href="/blog" className="btn-ghost">
                                    <ArrowLeft size={14} />
                                    Tất cả bài viết
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}
