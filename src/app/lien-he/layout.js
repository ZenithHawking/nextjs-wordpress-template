export const metadata = {
    title: 'Liên hệ',
    description: 'Liên hệ Vạn Sao để được tư vấn miễn phí về thiết kế website, tổ chức sự kiện và chuyển dữ liệu web. Hotline: 08 666 31679.',
    alternates: { canonical: 'https://vansao.com/lien-he' },
    openGraph: {
        title: 'Liên hệ Vạn Sao — Tư vấn miễn phí',
        description: 'Liên hệ Vạn Sao để được tư vấn miễn phí. Hotline: 08 666 31679.',
        url: 'https://vansao.com/lien-he',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
}

export default function LienHeLayout({ children }) {
    return children
}