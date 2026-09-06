import Link from 'next/link'
import { ArrowRight, Home } from 'lucide-react'
import Mascot, { MASCOTS } from '@/components/Mascot'

export const metadata = {
    title: 'Không tìm thấy trang',
    // A 404 must never be indexed, or Google files it as a real page.
    robots: { index: false, follow: true },
}

export default function NotFound() {
    return (
        <main className="vs-state">
            <div className="inner">
                <span className="mascot-host">
                    <Mascot name={MASCOTS.buon} size={180} motion="float" priority />
                </span>

                <p className="code">Lỗi 404</p>
                <h1>Không tìm thấy trang này</h1>
                <p className="desc">
                    Có thể đường dẫn đã thay đổi, hoặc gõ nhầm một ký tự.
                </p>

                <div className="actions">
                    <Link href="/" className="btn-primary">
                        <Home size={15} />
                        Về trang chủ
                    </Link>
                    <Link href="/blog" className="btn-ghost">
                        Xem tất cả bài viết
                        <ArrowRight size={14} />
                    </Link>
                </div>

                <p className="help">
                    Cần tư vấn? Gọi <a href="tel:0866631679">08 666 31679</a> hoặc{' '}
                    <a href="https://zalo.me/0866631679" target="_blank" rel="noopener noreferrer">nhắn Zalo</a>.
                </p>
            </div>
        </main>
    )
}
