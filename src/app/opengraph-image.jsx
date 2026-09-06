import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const alt = 'Vạn Sao — Thiết kế Website, Sự kiện & Chuyển dữ liệu'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
    // Satori has no filesystem, so both images are inlined as data URIs.
    const [logoData, mascotData] = await Promise.all([
        readFile(join(process.cwd(), 'public/logo.png')),
        readFile(join(process.cwd(), 'public/mascot/ngoi-sao-vay-tay.png')),
    ])
    const logo = `data:image/png;base64,${logoData.toString('base64')}`
    const mascot = `data:image/png;base64,${mascotData.toString('base64')}`

    return new ImageResponse(
        (
            <div style={{
                width: '1200px', height: '630px',
                display: 'flex', alignItems: 'center',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #030712 100%)',
                position: 'relative', overflow: 'hidden',
                fontFamily: 'sans-serif',
            }}>

                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '5px',
                    background: 'linear-gradient(to right, #7c3aed, #f5c842, #7c3aed)',
                    display: 'flex',
                }} />

                <div style={{
                    position: 'absolute', top: '-140px', right: '-100px',
                    width: '520px', height: '520px', borderRadius: '50%',
                    background: 'rgba(124,58,237,0.22)', display: 'flex',
                }} />

                <div style={{
                    position: 'absolute', bottom: '-110px', left: '-90px',
                    width: '420px', height: '420px', borderRadius: '50%',
                    background: 'rgba(245,200,66,0.12)', display: 'flex',
                }} />

                {/* Left: wordmark and claim */}
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    padding: '0 0 0 76px', width: '700px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '26px' }}>
                        <img src={logo} width={64} height={64} style={{ objectFit: 'contain' }} />
                        <span style={{ fontSize: '58px', fontWeight: 900, color: '#ffffff', letterSpacing: '-2px' }}>
                            Vạn Sao
                        </span>
                    </div>

                    <div style={{ display: 'flex', fontSize: '38px', lineHeight: 1.25, color: '#ffffff', fontWeight: 700, marginBottom: '18px' }}>
                        Mỗi ý tưởng là một ngôi sao
                    </div>

                    <div style={{ display: 'flex', fontSize: '24px', color: '#c4b5fd', marginBottom: '32px' }}>
                        Thiết kế Website · Sự kiện · Chuyển dữ liệu
                    </div>

                    <div style={{ display: 'flex', gap: '14px' }}>
                        {['Chuẩn SEO', 'Bàn giao 5–10 ngày', 'Bảo hành 2 năm'].map(item => (
                            <div key={item} style={{
                                display: 'flex',
                                background: 'rgba(124,58,237,0.28)',
                                border: '1px solid rgba(167,139,250,0.45)',
                                borderRadius: '100px',
                                padding: '10px 22px',
                                color: '#e9d5ff', fontSize: '20px',
                            }}>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: the mascot doing the greeting.
                    Satori does not derive the missing dimension from the source
                    aspect ratio, so both are given explicitly — the artwork is
                    230x235, and 352x360 keeps that ratio. */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '420px' }}>
                    <img src={mascot} width={352} height={360} />
                </div>

                <div style={{
                    position: 'absolute', bottom: '34px', left: '78px', display: 'flex',
                    color: '#6b7280', fontSize: '18px', letterSpacing: '2px',
                }}>
                    vansao.com
                </div>

            </div>
        ),
        { ...size }
    )
}
