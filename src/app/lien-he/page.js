import ContactClient from './ContactClient'

export const metadata = {
    title: 'Liên hệ',
    description: 'Liên hệ Vạn Sao để được tư vấn miễn phí về thiết kế website, sự kiện và chuyển dữ liệu. Phản hồi trong 24 giờ, không chi phí ẩn.',
    alternates: { canonical: 'https://vansao.com/lien-he' },
    openGraph: {
        title: 'Liên hệ Vạn Sao — Tư vấn miễn phí',
        description: 'Gửi yêu cầu tư vấn miễn phí. Vạn Sao phản hồi trong 24 giờ — không ràng buộc, không chi phí ẩn.',
        url: 'https://vansao.com/lien-he',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
}

export default function ContactPage() {
    return <ContactClient />
}
