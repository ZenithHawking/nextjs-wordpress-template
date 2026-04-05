// src/app/layout.js
import { Geist } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'
import { Be_Vietnam_Pro } from 'next/font/google'

const font = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '500', '600', '700'],
})

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
    metadataBase: new URL('https://vansao.com'),
    title: {
        default: 'Vạn Sao — Thiết kế Website, Sự kiện & Chuyển dữ liệu',
        template: '%s | Vạn Sao',
    },
    description: 'Vạn Sao chuyên thiết kế website chuẩn SEO, tổ chức sự kiện tiệc cưới và chuyển dữ liệu web. Giải pháp chuyên nghiệp, đúng ngân sách tại TP. Hồ Chí Minh.',
    keywords: ['thiết kế website', 'tổ chức sự kiện', 'tiệc cưới', 'chuyển dữ liệu web', 'SEO', 'Vạn Sao', 'TP HCM'],
    authors: [{ name: 'Vạn Sao', url: 'https://vansao.com' }],
    creator: 'Vạn Sao',
    openGraph: {
        type: 'website',
        locale: 'vi_VN',
        url: 'https://vansao.com',
        siteName: 'Vạn Sao',
        title: 'Vạn Sao — Thiết kế Website, Sự kiện & Chuyển dữ liệu',
        description: 'Vạn Sao chuyên thiết kế website chuẩn SEO, tổ chức sự kiện tiệc cưới và chuyển dữ liệu web.',
        images: [{
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: 'Vạn Sao',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Vạn Sao — Thiết kế Website, Sự kiện & Chuyển dữ liệu',
        description: 'Vạn Sao chuyên thiết kế website chuẩn SEO, tổ chức sự kiện tiệc cưới và chuyển dữ liệu web.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: 'https://vansao.com',
    },
}

export default function RootLayout({ children }) {
  return (
      <html lang="vi">
      <body className={font.className}>
      <Header/>
      <main>{children}</main>
      <Footer />
      </body>
      </html>
  )
}