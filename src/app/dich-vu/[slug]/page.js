import Link from 'next/link'
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react'
import { getServiceBySlug } from '@/lib/wordpress'
import { notFound } from 'next/navigation'

const allowedSlugs = [
    'dich-vu-thiet-ke-website',
    'dich-vu-su-kien-tiec-cuoi',
    'dich-vu-chuyen-du-lieu',
]

// Parse HTML content thành các sections
function parseContent(html) {
    if (!html) return { intro: [], includes: [], pricing: [], faq: [] }

    // Lấy text từ HTML
    const getText = (str) => str.replace(/<[^>]*>/g, '').trim()

    // Tách thành các đoạn <p> và <ul>
    const paragraphs = html.match(/<p[^>]*>.*?<\/p>/gs) ?? []
    const lists = html.match(/<ul[^>]*>.*?<\/ul>/gs) ?? []

    // Lấy các <li> từ list đầu tiên (dịch vụ bao gồm)
    const includeItems = lists[0]
        ? (lists[0].match(/<li[^>]*>(.*?)<\/li>/gs) ?? []).map(li => getText(li))
        : []

    // Lấy các <li> từ list thứ hai (bảng giá)
    const pricingItems = lists[1]
        ? (lists[1].match(/<li[^>]*>(.*?)<\/li>/gs) ?? []).map(li => getText(li))
        : []

    // Lấy FAQ — các cặp <p> câu hỏi + trả lời sau "Câu hỏi thường gặp"
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

    // Intro — 2 đoạn đầu tiên
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
        title: service.title.rendered,
        description: service.excerpt.rendered.replace(/<[^>]*>/g, '').trim().slice(0, 160),
        alternates: { canonical: `https://vansao.com/dich-vu/${slug}` },
        openGraph: {
            title: service.title.rendered,
            description: service.excerpt.rendered.replace(/<[^>]*>/g, '').trim().slice(0, 160),
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
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center flex flex-col items-center gap-4 px-6">
                    <p className="text-6xl">🔧</p>
                    <h1 className="text-2xl font-bold text-gray-900">Đang bảo trì</h1>
                    <p className="text-base text-gray-500">Nội dung tạm thời không khả dụng.</p>
                    <Link href="/dich-vu" className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-base font-semibold text-white hover:bg-purple-700 transition-colors">
                        <ArrowLeft size={16} /> Quay lại dịch vụ
                    </Link>
                </div>
            </main>
        )
    }

    const { intro, includes, pricing, faq } = parseContent(service.content?.rendered)

    return (
        <main>

            {/* Hero */}
            <section className="py-20 bg-gray-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-gray-950 to-gray-950" />
                <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl" />
                <div className="relative container mx-auto max-w-4xl px-6 flex flex-col gap-6">
                    <Link href="/dich-vu" className="inline-flex items-center gap-2 text-base text-gray-400 hover:text-white transition-colors w-fit">
                        <ArrowLeft size={16} /> Tất cả dịch vụ
                    </Link>
                    <div className="inline-flex items-center gap-2 w-fit rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2">
                        <Sparkles size={14} className="text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-300">Dịch vụ</span>
                    </div>
                    <h1
                        className="text-4xl md:text-5xl font-bold text-white leading-tight"
                        dangerouslySetInnerHTML={{ __html: service.title.rendered }}
                    />
                    {intro[0] && (
                        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">{intro[0]}</p>
                    )}
                </div>
            </section>

            {/* Mô tả + Dịch vụ bao gồm */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

                    {/* Trái — Mô tả */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-bold text-gray-900">Về dịch vụ này</h2>
                        {intro.map((text, i) => (
                            <p key={i} className="text-base text-gray-500 leading-relaxed">{text}</p>
                        ))}
                    </div>

                    {/* Phải — Dịch vụ bao gồm */}
                    {includes.length > 0 && (
                        <div className="flex flex-col gap-5">
                            <h2 className="text-3xl font-bold text-gray-900">Dịch vụ bao gồm</h2>
                            <ul className="flex flex-col gap-3">
                                {includes.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 size={20} className="text-purple-500 shrink-0 mt-0.5" />
                                        <span className="text-base text-gray-600 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            {/* Bảng giá */}
            {pricing.length > 0 && (
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto max-w-6xl px-6">
                        <div className="text-center mb-12">
              <span className="inline-block rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-600 uppercase tracking-wide mb-4">
                Bảng giá
              </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Gói dịch vụ tham khảo</h2>
                            <p className="mt-3 text-base text-gray-500">Liên hệ để được báo giá chính xác theo nhu cầu thực tế.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {pricing.map((item, i) => {
                                const colonIdx = item.indexOf(':')
                                const title = colonIdx > -1 ? item.slice(0, colonIdx).trim() : item
                                const desc = colonIdx > -1 ? item.slice(colonIdx + 1).trim() : ''
                                const isMiddle = i === 1
                                return (
                                    <div
                                        key={i}
                                        className={`relative flex flex-col gap-4 rounded-2xl p-8 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
                      ${isMiddle
                                            ? 'bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-200'
                                            : 'bg-white border-gray-200 text-gray-900'
                                        }`}
                                    >
                                        {isMiddle && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold text-gray-900">
                        Phổ biến
                      </span>
                                        )}
                                        <h3 className={`text-xl font-bold ${isMiddle ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                                        {desc && <p className={`text-base leading-relaxed ${isMiddle ? 'text-purple-100' : 'text-gray-500'}`}>{desc}</p>}
                                        <Link
                                            href="/lien-he"
                                            className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-all duration-200
                        ${isMiddle
                                                ? 'bg-white text-purple-700 hover:bg-yellow-400 hover:text-gray-900'
                                                : 'bg-purple-600 text-white hover:bg-purple-700'
                                            }`}
                                        >
                                            Tư vấn ngay
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ */}
            {faq.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto max-w-3xl px-6">
                        <div className="text-center mb-12">
              <span className="inline-block rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-600 uppercase tracking-wide mb-4">
                FAQ
              </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Câu hỏi thường gặp</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            {faq.map((item, i) => (
                                <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-7 flex flex-col gap-3 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200">
                                    <div className="flex items-start gap-3">
                                        <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">Q</span>
                                        <h3 className="text-base font-bold text-gray-900 leading-relaxed">{item.question}</h3>
                                    </div>
                                    {item.answer && (
                                        <div className="flex items-start gap-3 pl-0">
                                            <span className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">A</span>
                                            <p className="text-base text-gray-500 leading-relaxed">{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-purple-700 to-purple-600">
                <div className="container mx-auto max-w-3xl px-6 text-center flex flex-col items-center gap-6">
                    <h2 className="text-4xl font-bold text-white">Quan tâm dịch vụ này?</h2>
                    <p className="text-lg text-purple-100">Liên hệ Vạn Sao để được tư vấn và báo giá miễn phí.</p>
                    <Link
                        href="/lien-he"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-purple-700 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 shadow-lg"
                    >
                        <Sparkles size={17} />
                        Liên hệ ngay
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </section>

        </main>
    )
}