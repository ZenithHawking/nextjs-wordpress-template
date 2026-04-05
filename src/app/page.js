import HeroSection from '@/components/HeroSection'
import ServicesSection from '@/components/ServicesSection'
import WhyUsSection from '@/components/WhyUsSection'
import BlogSection from '@/components/BlogSection'
import ContactSection from '@/components/ContactSection'

export const metadata = {
    title: 'Trang chủ',
    description: 'Vạn Sao chuyên thiết kế website chuẩn SEO, tổ chức sự kiện tiệc cưới và chuyển dữ liệu web. Giải pháp chuyên nghiệp tại TP. Hồ Chí Minh.',
    alternates: { canonical: 'https://vansao.com' },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Vạn Sao',
    url: 'https://vansao.com',
    telephone: '0866631679',
    email: 'vansao.contact@gmail.com',
    logo: 'https://vansao.com/logo.png',
    image: 'https://vansao.com/logo.png',
    description: 'Vạn Sao chuyên thiết kế website, tổ chức sự kiện tiệc cưới và chuyển dữ liệu web tại TP. Hồ Chí Minh.',
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'TP. Hồ Chí Minh',
        addressCountry: 'VN',
    },
    sameAs: ['https://www.facebook.com/profile.php?id=61576379972366'],
    priceRange: '$$',
    openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        opens: '00:00',
        closes: '23:59',
    },
}

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <ServicesSection />
            <WhyUsSection />
            <BlogSection />
            <ContactSection />

        </>
    )
}
