import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { getPostBySlug } from '@/lib/wordpress'

export const alt = 'Vạn Sao Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }) {
    const { slug } = await params
    const [post, logoData] = await Promise.all([
        getPostBySlug(slug),
        readFile(join(process.cwd(), 'public/logo.png')),
    ])

    const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`
    const title = post?.title?.rendered?.replace(/<[^>]*>/g, '') ?? 'Vạn Sao Blog'
    const category = post?._embedded?.['wp:term']?.[0]?.[0]?.name ?? null

    return new ImageResponse(
        (
            <div style={{
                width: '1200px', height: '630px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #030712 100%)',
                position: 'relative', overflow: 'hidden',
                fontFamily: 'sans-serif',
                padding: '60px',
            }}>

                {/* Accent line top */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                    background: 'linear-gradient(to right, #7c3aed, #f5c842, #7c3aed)',
                    display: 'flex',
                }} />

                {/* Vòng tròn trang trí */}
                <div style={{
                    position: 'absolute', top: '-100px', right: '-100px',
                    width: '500px', height: '500px', borderRadius: '50%',
                    background: 'rgba(124,58,237,0.2)', display: 'flex',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-80px', left: '-80px',
                    width: '350px', height: '350px', borderRadius: '50%',
                    background: 'rgba(245,200,66,0.08)', display: 'flex',
                }} />

                {/* Category badge */}
                {category && (
                    <div style={{
                        display: 'flex', marginBottom: '20px',
                        background: 'rgba(124,58,237,0.3)',
                        border: '1px solid rgba(167,139,250,0.4)',
                        borderRadius: '100px',
                        padding: '8px 20px',
                        color: '#c4b5fd', fontSize: '18px',
                        width: 'fit-content',
                    }}>
                        {category}
                    </div>
                )}

                {/* Tiêu đề bài viết */}
                <div style={{
                    display: 'flex',
                    fontSize: title.length > 60 ? '38px' : title.length > 40 ? '46px' : '54px',
                    fontWeight: 900,
                    color: '#ffffff',
                    lineHeight: 1.2,
                    marginBottom: '36px',
                    maxWidth: '1000px',
                }}>
                    {title}
                </div>

                {/* Footer — logo + domain */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={logoBase64} width={44} height={44} style={{ objectFit: 'contain' }} />
                        <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>Vạn Sao</span>
                    </div>
                    <span style={{ fontSize: '18px', color: '#6b7280', letterSpacing: '1px' }}>
            vansao.com/blog
          </span>
                </div>

            </div>
        ),
        { ...size }
    )
}
