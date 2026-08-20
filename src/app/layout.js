// src/app/layout.js
import { Geist } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'
import { localBusinessSchema, BUSINESS, SITE_URL } from '@/lib/seo'
import { Be_Vietnam_Pro } from 'next/font/google'

const font = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '500', '600', '700'],
})

const geist = Geist({ subsets: ['latin'] })

const SITE_TITLE = 'Vạn Sao — Thiết kế Website, Sự kiện & Chuyển dữ liệu'
const SITE_DESC =
    'Vạn Sao thiết kế website chuẩn SEO, tổ chức sự kiện – tiệc cưới và chuyển dữ liệu web. ' +
    'Phục vụ doanh nghiệp tại xã Mỹ Hạnh, Đức Hòa (Tây Ninh) và TP. Hồ Chí Minh. Giá minh bạch, bảo hành 2 năm.'

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: '%s | Vạn Sao',
    },
    description: SITE_DESC,
    keywords: [
        'thiết kế website Đức Hòa',
        'thiết kế website Mỹ Hạnh',
        'thiết kế website Tây Ninh',
        'thiết kế web Long An',
        'thiết kế website chuẩn SEO',
        'tổ chức sự kiện',
        'tiệc cưới',
        'chuyển dữ liệu web',
        'Vạn Sao',
    ],
    authors: [{ name: 'Vạn Sao', url: SITE_URL }],
    creator: 'Vạn Sao',
    openGraph: {
        type: 'website',
        locale: 'vi_VN',
        url: SITE_URL,
        siteName: 'Vạn Sao',
        title: SITE_TITLE,
        description: SITE_DESC,
        images: [{
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: 'Vạn Sao',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_TITLE,
        description: SITE_DESC,
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
        canonical: SITE_URL,
    },
}

// Declares the site as a searchable entity and ties every page back to the
// business node defined in localBusinessSchema.
const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BUSINESS.name,
    inLanguage: 'vi-VN',
    publisher: { '@id': `${SITE_URL}/#business` },
}

export default function RootLayout({ children }) {
  return (
      <html lang="vi">
      <body className={font.className}>
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Header/>
      <main>{children}</main>
      <Footer />
      </body>
      </html>
  )
}