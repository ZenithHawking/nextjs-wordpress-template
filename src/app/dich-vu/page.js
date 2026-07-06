import Link from 'next/link'
import Image from 'next/image'
import { Monitor, CalendarHeart, DatabaseZap, ArrowRight, ArrowUpRight, Star } from 'lucide-react'
import BatRadarCard from '@/components/BatRadarCard'
import QRCard from '@/components/QRCard'
import UniAPICard from '@/components/UniAPICard'
import WebSamplesCard from '@/components/WebSamplesCard'

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
        variant: 'purple',
        badge: 'Phổ biến nhất',
        num: '01',
    },
    {
        icon: CalendarHeart,
        title: 'Sự kiện – Tiệc cưới',
        desc: 'Giải pháp check-in công nghệ, tìm ảnh nhanh, hỗ trợ vận hành sự kiện đúng ngân sách.',
        href: '/dich-vu/dich-vu-su-kien-tiec-cuoi',
        variant: 'yellow',
        badge: null,
        num: '02',
    },
    {
        icon: DatabaseZap,
        title: 'Chuyển dữ liệu web',
        desc: 'Chuyển bài viết, sản phẩm, hình ảnh giữa các website an toàn, đầy đủ, không gián đoạn.',
        href: '/dich-vu/dich-vu-chuyen-du-lieu',
        variant: 'mint',
        badge: null,
        num: '03',
    },
]

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Giá cả của Vạn Sao có thật sự rẻ không?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Giá cả của Vạn Sao được tư vấn rõ ràng và minh bạch ngay từ buổi đầu tiên. Mọi hạng mục đều được liệt kê cụ thể, không có chi phí ẩn — để khách hàng chủ động hoàn toàn về ngân sách.',
            },
        },
        {
            '@type': 'Question',
            name: 'Công nghệ của Vạn Sao khác gì các công ty khác tại Việt Nam?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Hầu hết các công ty tại Việt Nam hiện chỉ áp dụng công nghệ cũ và thay đổi giao diện. Những đơn vị sở hữu công nghệ hiện đại thường có giá rất cao. Vạn Sao là đơn vị tiên phong ứng dụng công nghệ mới — mạnh hơn, nhanh hơn, đẹp hơn — với mức giá phù hợp mọi đối tượng khách hàng.',
            },
        },
        {
            '@type': 'Question',
            name: 'Tại sao nên tin tưởng và chọn dịch vụ của Vạn Sao?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Vạn Sao là những người tiên phong ứng dụng công nghệ mới tại Việt Nam: nhanh hơn, mạnh hơn và đẹp hơn so với các giải pháp truyền thống, nhưng với mức giá mà mọi khách hàng đều có thể tiếp cận được.',
            },
        },
        {
            '@type': 'Question',
            name: 'Chính sách bảo hành của Vạn Sao như thế nào?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Vạn Sao bảo hành 2 năm cho toàn bộ phần mềm và dịch vụ. Trong quá trình tư vấn, nếu nhu cầu của khách không phù hợp với chuyên môn của chúng tôi, chúng tôi sẽ giới thiệu đơn vị uy tín đúng chuyên ngành — hoàn toàn miễn phí, không thu thêm bất kỳ khoản phí nào.',
            },
        },
    ],
}

export default function ServicesPage() {
    return (
        <main className="vs-services-page">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Hero */}
            <section className="vs-services-hero">
                <div className="vs-shell">
                    <h1>
                        Giải pháp toàn diện cho thương hiệu của bạn
                    </h1>
                    <p className="lead">
                        Từ website đến sự kiện và dữ liệu — Vạn Sao đồng hành lâu dài, làm gọn, đúng nhu cầu, đúng ngân sách.
                    </p>
                </div>
            </section>

            {/* Cards */}
            <section className="vs-services-grid-section">
                <div className="vs-shell">
                    <div className="vs-services-grid">
                        {services.map(({ icon: Icon, title, desc, href, variant, badge, num, external, logo }) => {
                            const cardContent = (
                                <>
                                    <span className="num-ghost">{num}</span>
                                    {badge && (
                                        <span className="badge">
                                            <Star size={11} fill="currentColor" />
                                            {badge}
                                        </span>
                                    )}
                                    <div className="icon-box">
                                        {logo ? (
                                            <Image src={logo} alt={title} width={32} height={32} className="object-contain" />
                                        ) : (
                                            <Icon size={28} strokeWidth={1.7} />
                                        )}
                                    </div>
                                    <h2>{title}</h2>
                                    <p>{desc}</p>
                                    <span className="more">
                                        {external ? 'Truy cập ngay' : 'Xem chi tiết'}
                                        {external ? <ArrowUpRight size={15} /> : <ArrowRight size={15} />}
                                    </span>
                                </>
                            )
                            return external ? (
                                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={`vs-service-card ${variant}`}>
                                    {cardContent}
                                </a>
                            ) : (
                                <Link key={href} href={href} className={`vs-service-card ${variant}`}>
                                    {cardContent}
                                </Link>
                            )
                        })}
                        <WebSamplesCard />
                        <QRCard />
                        <BatRadarCard />
                        <UniAPICard />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="vs-services-cta">
                <div className="vs-shell">
                    <div className="card">
                        <div className="bg-blob" />
                        <h2>
                            Liên hệ Vạn Sao để được tư vấn miễn phí
                        </h2>
                        <p>Không mất phí, không ràng buộc — chỉ cần cho chúng tôi biết bạn cần gì.</p>
                        <div className="actions">
                            <Link
                                href="https://zalo.me/0866631679"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                            >
                                Tư vấn miễn phí
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
