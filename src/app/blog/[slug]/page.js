import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, ChevronRight } from 'lucide-react'
import { getPostBySlug, getRelatedPosts } from '@/lib/directus'
import { notFound } from 'next/navigation'
import {
    SITE_URL,
    cleanDescription,
    keywordsFromTitle,
    extractFaq,
    faqSchema,
    breadcrumbSchema,
    demoteContentH1,
} from '@/lib/seo'
import Mascot, { MASCOTS } from '@/components/Mascot'

export async function generateMetadata({ params }) {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    if (!post) return {}
    const title = post.title ?? ''
    const description = cleanDescription(post.excerpt, post.content)
    const thumbnail = post.featured_image ?? null
    return {
        title,
        description,
        keywords: keywordsFromTitle(title),
        openGraph: {
            title, description, type: 'article',
            locale: 'vi_VN',
            siteName: 'Vạn Sao',
            url: `${SITE_URL}/blog/${slug}`,
            publishedTime: post.date_created,
            // Fall back to the creation date so the tag is never emitted empty.
            modifiedTime: post.date_updated ?? post.date_created,
            images: thumbnail ? [{ url: thumbnail, width: 1200, height: 630, alt: title }] : [],
        },
        twitter: { card: 'summary_large_image', title, description, images: thumbnail ? [thumbnail] : [] },
        alternates: { canonical: `${SITE_URL}/blog/${slug}` },
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
    const post = await getPostBySlug(slug)
    if (!post) notFound()

    // Related posts are ranked against this post's own title, so the links in
    // the sidebar stay on-topic instead of pointing at whatever is newest.
    const related = await getRelatedPosts(post.title ?? '', { excludeSlug: slug, count: 3 })

    const thumbnail = post.featured_image ?? null
    const title = post.title ?? ''
    const minutes = readingTime(post.content ?? '')
    const categoryName = post.categories?.[0]?.categories_id?.name ?? null

    const pageUrl = `${SITE_URL}/blog/${slug}`

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: cleanDescription(post.excerpt, post.content),
        image: thumbnail ?? undefined,
        datePublished: post.date_created,
        // Google drops articles whose dateModified is null.
        dateModified: post.date_updated ?? post.date_created,
        author: { '@type': 'Organization', name: 'Vạn Sao', url: SITE_URL },
        publisher: { '@id': `${SITE_URL}/#business` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
        inLanguage: 'vi-VN',
    }

    // Posts that contain a "FAQ" section get an FAQPage block, which is what
    // earns the expandable Q&A rich result in Google.
    const faq = faqSchema(extractFaq(post.content ?? ''), pageUrl)

    const breadcrumbs = breadcrumbSchema([
        { name: 'Trang chủ', url: SITE_URL },
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: title, url: pageUrl },
    ])

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
            {faq && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
            )}

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
                                    dangerouslySetInnerHTML={{ __html: demoteContentH1(post.content) }}
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
                                <div className="sidebar-cta mascot-host">
                                    <p className="eyebrow">Vạn Sao</p>
                                    <h3>Cần tư vấn về dịch vụ?</h3>
                                    <p className="desc">Đội ngũ Vạn Sao sẵn sàng hỗ trợ miễn phí, không ràng buộc.</p>
                                    <Link href="/lien-he" className="btn">Liên hệ ngay</Link>
                                    <Mascot
                                        name={MASCOTS.yeuThich}
                                        size={92}
                                        motion="none"
                                        className="cta-mascot"
                                    />
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
