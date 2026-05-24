import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { getLatestPosts } from '@/lib/directus'

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

// Variant gradient cho thumbnail khi không có featured_image
const thumbVariants = ['', 'alt-1', 'alt-2']

export default async function BlogSection() {
    const posts = await getLatestPosts(3)

    if (!posts.length) return null

    return (
        <section className="vs-blog-section" id="blog" aria-labelledby="blog-h2">
            <div className="vs-shell">

                {/* Header */}
                <header className="vs-sec-head">
                    <div className="left">
                        <span className="vs-eyebrow">
                            <Sparkles size={13} className="text-vs-purple" />
                            Blog & Ghi chép
                        </span>
                        <h2 id="blog-h2">
                            Bài viết <span className="accent">mới nhất</span> — kinh nghiệm thật từ dự án thật.
                        </h2>
                    </div>
                    <Link href="/blog" className="vs-blog-link-all">
                        Xem tất cả bài viết
                        <ArrowUpRight size={15} />
                    </Link>
                </header>

                {/* Cards */}
                <div className="vs-blog-grid">
                    {posts.map((post, i) => {
                        const thumbnail = post.featured_image ?? null
                        const excerpt = stripHtml(post.excerpt ?? '')
                        const slug = post.slug
                        const variant = thumbVariants[i % thumbVariants.length]

                        return (
                            <Link
                                key={post.id}
                                href={`/blog/${slug}`}
                                className="vs-post-card"
                            >
                                {/* Thumbnail — dùng featured_image nếu có, fallback gradient */}
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

                                {/* Meta */}
                                <div className="meta">
                                    <span className="cat">Vạn Sao</span>
                                    <span className="sep" />
                                    <span>{formatDate(post.date_created)}</span>
                                </div>

                                {/* Title */}
                                <h3>{post.title ?? ''}</h3>

                                {/* Excerpt */}
                                {excerpt && <p className="excerpt">{excerpt}</p>}

                                {/* Read more */}
                                <span className="more">
                                    Đọc bài viết
                                    <ArrowRight size={14} />
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
