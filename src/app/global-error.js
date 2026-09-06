'use client'

/**
 * Last-resort boundary: an error thrown by the root layout itself.
 *
 * This replaces the whole document, so it ships its own <html>/<body> and
 * inlines its styles — whatever broke the layout may well have taken the
 * stylesheet with it, and a fallback that depends on the thing that failed is
 * not a fallback.
 */
export default function GlobalError({ error, reset }) {
    return (
        <html lang="vi">
            <body style={{ margin: 0, background: '#FBFAF6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <main
                    style={{
                        minHeight: '100vh', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: 18, padding: '48px 24px', textAlign: 'center', color: '#3A3F58',
                    }}
                >
                    {/* Plain <img>: next/image needs the runtime that just failed. */}
                    <img
                        src="/mascot/ngoi-sao-ngac-nhien.png"
                        alt=""
                        width={150}
                        style={{ height: 150, width: 'auto' }}
                    />

                    <h1 style={{ margin: 0, fontSize: 26, lineHeight: 1.25, color: '#1B1F3A' }}>
                        Chưa tải được nội dung
                    </h1>
                    <p style={{ margin: 0, maxWidth: 420, lineHeight: 1.65 }}>
                        Đường truyền có vẻ đang chậm. Bạn thử tải lại giúp nhé, thường là xong ngay.
                    </p>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
                        <button
                            type="button"
                            onClick={reset}
                            style={{
                                padding: '11px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                background: '#7A5BE9', color: '#fff', fontWeight: 600, fontSize: 15,
                            }}
                        >
                            Tải lại trang
                        </button>
                        {/* A plain anchor on purpose: next/link routes through the
                            client router, which is part of what may have failed
                            here. This forces a full document load. */}
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a
                            href="/"
                            style={{
                                padding: '11px 22px', borderRadius: 10, textDecoration: 'none',
                                border: '1px solid #ECE8DD', color: '#3A3F58', fontWeight: 600, fontSize: 15,
                            }}
                        >
                            Về trang chủ
                        </a>
                    </div>

                    <p style={{ margin: '8px 0 0', fontSize: 14, color: '#6B7088' }}>
                        Cần gấp? Gọi{' '}
                        <a href="tel:0866631679" style={{ color: '#7A5BE9', fontWeight: 600, textDecoration: 'none' }}>
                            08 666 31679
                        </a>{' '}
                        hoặc{' '}
                        <a
                            href="https://zalo.me/0866631679"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#7A5BE9', fontWeight: 600, textDecoration: 'none' }}
                        >
                            nhắn Zalo
                        </a>.
                    </p>
                </main>
            </body>
        </html>
    )
}
