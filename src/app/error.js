'use client'

import Link from 'next/link'
import { RotateCw, Home } from 'lucide-react'
import Mascot, { MASCOTS } from '@/components/Mascot'

/**
 * Route-level error boundary.
 *
 * Catches the realistic failure for this site: Directus not answering, so a
 * page cannot get its data. The copy stays out of the way — it tells the
 * visitor what to do rather than naming a server, and keeps the phone number
 * on screen so a broken page still converts.
 *
 * A total loss of connectivity is the browser's own error page; nothing here
 * runs in that case.
 */
export default function Error({ error, reset }) {
    return (
        <main className="vs-state">
            <div className="inner">
                <span className="mascot-host">
                    <Mascot name={MASCOTS.ngacNhien} size={180} motion="bob" priority />
                </span>

                <h1>Chưa tải được nội dung</h1>
                <p className="desc">
                    Đường truyền có vẻ đang chậm. Bạn thử tải lại giúp nhé, thường là xong ngay.
                </p>

                <div className="actions">
                    <button type="button" onClick={reset} className="btn-primary">
                        <RotateCw size={15} />
                        Tải lại trang
                    </button>
                    <Link href="/" className="btn-ghost">
                        <Home size={14} />
                        Về trang chủ
                    </Link>
                </div>

                <p className="help">
                    Cần gấp? Gọi <a href="tel:0866631679">08 666 31679</a> hoặc{' '}
                    <a href="https://zalo.me/0866631679" target="_blank" rel="noopener noreferrer">nhắn Zalo</a>.
                </p>
            </div>
        </main>
    )
}
