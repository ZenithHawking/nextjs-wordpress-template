import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { getServiceBySlug } from '@/lib/directus'
import { notFound } from 'next/navigation'

const allowedSlugs = [
    'dich-vu-thiet-ke-website',
    'dich-vu-su-kien-tiec-cuoi',
    'dich-vu-chuyen-du-lieu',
]

function parseContent(html) {
    if (!html) return { intro: [], includes: [], pricing: [], faq: [] }

    const getText = (str) => str.replace(/<[^>]*>/g, '').trim()
    const paragraphs = html.match(/<p[^>]*>.*?<\/p>/gs) ?? []
    const lists = html.match(/<ul[^>]*>.*?<\/ul>/gs) ?? []

    const includeItems = lists[0]
        ? (lists[0].match(/<li[^>]*>(.*?)<\/li>/gs) ?? []).map(li => getText(li))
        : []

    const pricingItems = lists[1]
        ? (lists[1].match(/<li[^>]*>(.*?)<\/li>/gs) ?? []).map(li => getText(li))
        : []

    const faqItems = []
    let inFaq = false
    for (const p of paragraphs) {
        const text = getText(p)
        if (text.includes('Câu hỏi thường gặp')) { inFaq = true; continue }
        if (inFaq && text) {
            if (text.includes('?') || (!faqItems.length || faqItems[faqItems.length - 1].answer)) {
                faqItems.push({ question: text, answer: '' })
            } else if (faqItems.length) {
                faqItems[faqItems.length - 1].answer = text
            }
        }
    }

    const intro = paragraphs
        .slice(0, 2)
        .map(p => getText(p))
        .filter(Boolean)

    return { intro, includes: includeItems, pricing: pricingItems, faq: faqItems }
}

export async function generateMetadata({ params }) {
    const { slug } = await params
    const service = await getServiceBySlug(slug)
    if (!service) return {}
    return {
        title: service.title,
        description: (service.excerpt ?? '').replace(/<[^>]*>/g, '').trim().slice(0, 160),
        alternates: { canonical: `https://vansao.com/dich-vu/${slug}` },
        openGraph: {
            title: service.title,
            description: (service.excerpt ?? '').replace(/<[^>]*>/g, '').trim().slice(0, 160),
            url: `https://vansao.com/dich-vu/${slug}`,
            images: [{ url: '/og-image.png', width: 1200, height: 630 }],
        },
    }
}

export default async function ServiceDetailPage({ params }) {
    const { slug } = await params
    if (!allowedSlugs.includes(slug)) notFound()

    const service = await getServiceBySlug(slug)

    if (!service) {
        return (
            <main className="vs-svc-detail-empty">
                <div className="vs-shell">
                    <p className="emoji">🔧</p>
                    <h1>Đang bảo trì</h1>
                    <p>Nội dung tạm thời không khả dụng.</p>
                    <Link href="/dich-vu" className="btn-primary">
                        <ArrowLeft size={16} /> Quay lại dịch vụ
                    </Link>
                </div>
            </main>
        )
    }

    const { intro, includes, pricing, faq } = parseContent(service.content)

    return (
        <main className="vs-svc-detail">

            {/* Hero */}
            <section className="vs-svc-detail-hero">
                <div className="vs-shell">
                    <Link href="/dich-vu" className="back-link">
                        <ArrowLeft size={16} /> Tất cả dịch vụ
                    </Link>
                    <h1>{service.title}</h1>
                    {intro[0] && <p className="lead">{intro[0]}</p>}
                </div>
            </section>

            {/* Mô tả + Dịch vụ bao gồm */}
            <section className="vs-svc-detail-about">
                <div className="vs-shell">
                    <div className="grid">
                        <div className="text-col">
                            <h2>Về dịch vụ này</h2>
                            {intro.map((text, i) => (
                                <p key={i}>{text}</p>
                            ))}
                        </div>

                        {includes.length > 0 && (
                            <div className="includes-col">
                                <h2>Dịch vụ bao gồm</h2>
                                <ul>
                                    {includes.map((item, i) => (
                                        <li key={i}>
                                            <CheckCircle2 size={20} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Bảng giá */}
            {pricing.length > 0 && (
                <section className="vs-svc-detail-pricing">
                    <div className="vs-shell">
                        <header className="vs-sec-head center">
                            <div className="left">
                                <h2>Gói dịch vụ tham khảo</h2>
                                <p className="desc">Liên hệ để được báo giá chính xác theo nhu cầu thực tế.</p>
                            </div>
                        </header>

                        <div className="pricing-grid">
                            {pricing.map((item, i) => {
                                const colonIdx = item.indexOf(':')
                                const title = colonIdx > -1 ? item.slice(0, colonIdx).trim() : item
                                const desc = colonIdx > -1 ? item.slice(colonIdx + 1).trim() : ''
                                const isMiddle = i === 1
                                return (
                                    <div key={i} className={`pricing-card ${isMiddle ? 'featured' : ''}`}>
                                        {isMiddle && <span className="pop-badge">Phổ biến</span>}
                                        <h3>{title}</h3>
                                        {desc && <p>{desc}</p>}
                                        <Link href="/lien-he" className="btn">Tư vấn ngay</Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ */}
            {faq.length > 0 && (
                <section className="vs-svc-detail-faq">
                    <div className="vs-shell">
                        <header className="vs-sec-head center">
                            <div className="left">
                                <h2>Câu hỏi thường gặp</h2>
                            </div>
                        </header>

                        <div className="faq-list">
                            {faq.map((item, i) => (
                                <div key={i} className="faq-item">
                                    <div className="q">
                                        <span className="badge">Q</span>
                                        <h3>{item.question}</h3>
                                    </div>
                                    {item.answer && (
                                        <div className="a">
                                            <span className="badge green">A</span>
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="vs-svc-detail-cta">
                <div className="vs-shell">
                    <div className="card">
                        <div className="bg-blob" />
                        <h2>Quan tâm dịch vụ này?</h2>
                        <p>Liên hệ Vạn Sao để được tư vấn và báo giá miễn phí.</p>
                        <div className="actions">
                            <Link href="/lien-he" className="btn-primary">
                                Liên hệ ngay
                                <ArrowRight size={15} />
                            </Link>
                            <Link href="/dich-vu" className="btn-ghost">
                                <ArrowLeft size={14} />
                                Tất cả dịch vụ
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    )
}
