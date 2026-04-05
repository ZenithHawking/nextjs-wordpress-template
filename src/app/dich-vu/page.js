import Link from 'next/link'
import { Monitor, CalendarHeart, DatabaseZap, ArrowRight, Sparkles } from 'lucide-react'

export const metadata = {
    title: 'Dịch vụ',
    description: 'Vạn Sao cung cấp dịch vụ thiết kế website chuẩn SEO, tổ chức sự kiện tiệc cưới công nghệ và chuyển dữ liệu web an toàn tại TP. Hồ Chí Minh.',
    alternates: { canonical: 'https://vansao.com/dich-vu' },
    openGraph: {
        title: 'Dịch vụ của Vạn Sao — Website, Sự kiện & Dữ liệu',
        description: 'Giải pháp thiết kế website, sự kiện tiệc cưới và chuyển dữ liệu chuyên nghiệp.',
        url: 'https://vansao.com/dich-vu',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
}

const services = [
    {
        icon: Monitor,
        title: 'Thiết kế Website',
        desc: 'Thiết kế theo yêu cầu, chuẩn SEO, tối ưu tốc độ, phù hợp cá nhân và doanh nghiệp.',
        href: '/dich-vu/dich-vu-thiet-ke-website',
        color: 'purple',
    },
    {
        icon: CalendarHeart,
        title: 'Sự kiện – Tiệc cưới',
        desc: 'Giải pháp check-in công nghệ, tìm ảnh nhanh, hỗ trợ vận hành sự kiện đúng ngân sách.',
        href: '/dich-vu/dich-vu-su-kien-tiec-cuoi',
        color: 'yellow',
    },
    {
        icon: DatabaseZap,
        title: 'Chuyển dữ liệu web',
        desc: 'Chuyển bài viết, sản phẩm, hình ảnh giữa các website an toàn, đầy đủ, không gián đoạn.',
        href: '/dich-vu/dich-vu-chuyen-du-lieu',
        color: 'blue',
    },
]
const colorMap = {
    purple: { icon: 'bg-purple-100 text-purple-600', border: 'hover:border-purple-300', arrow: 'text-purple-500 group-hover:text-purple-700', glow: 'group-hover:shadow-purple-100' },
    yellow: { icon: 'bg-yellow-100 text-yellow-600', border: 'hover:border-yellow-300', arrow: 'text-yellow-500 group-hover:text-yellow-700', glow: 'group-hover:shadow-yellow-100' },
    blue:   { icon: 'bg-blue-100 text-blue-600',     border: 'hover:border-blue-300',   arrow: 'text-blue-500 group-hover:text-blue-700',   glow: 'group-hover:shadow-blue-100'   },
}

export default function ServicesPage() {
    return (
        <main>
            {/* Hero */}
            <section className="py-24 bg-gray-950">
                <div className="container mx-auto max-w-4xl px-6 text-center flex flex-col items-center gap-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2">
                        <Sparkles size={14} className="text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-300">Dịch vụ của Vạn Sao</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Giải pháp <span className="text-yellow-400">toàn diện</span> cho thương hiệu của bạn
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                        Từ website đến sự kiện và dữ liệu — Vạn Sao đồng hành lâu dài, làm gọn, đúng nhu cầu, đúng ngân sách.
                    </p>
                </div>
            </section>

            {/* Cards */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map(({ icon: Icon, title, desc, href, color }) => {
                        const c = colorMap[color]
                        return (
                            <div
                                key={href}
                                className={`group relative flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.glow} ${c.border}`}
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${c.icon}`}>
                                    <Icon size={28} />
                                </div>
                                <div className="flex flex-col gap-3 flex-1">
                                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                                    <p className="text-base text-gray-500 leading-relaxed">{desc}</p>
                                </div>
                                <Link
                                    href={href}
                                    className={`inline-flex items-center gap-2 text-base font-semibold transition-all duration-200 ${c.arrow}`}
                                >
                                    Xem chi tiết
                                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-purple-700 to-purple-600">
                <div className="container mx-auto max-w-3xl px-6 text-center flex flex-col items-center gap-6">
                    <h2 className="text-4xl font-bold text-white">Chưa biết chọn gói nào?</h2>
                    <p className="text-lg text-purple-100">Liên hệ Vạn Sao để được tư vấn miễn phí — không mất phí, không ràng buộc.</p>
                    <Link
                        href="https://zalo.me/0866631679"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-purple-700 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 shadow-lg"
                    >
                        <Sparkles size={17} />
                        Tư vấn miễn phí
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </section>
        </main>
    )
}