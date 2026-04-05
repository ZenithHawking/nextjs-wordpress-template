import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const alt = 'Vạn Sao'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
    // Đọc logo từ public/ folder trực tiếp
    const logoData = await readFile(join(process.cwd(), 'public/logo.png'))
    const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

    return new ImageResponse(
        (
            <div style={{
                width: '1200px', height: '630px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #030712 100%)',
                position: 'relative', overflow: 'hidden',
                fontFamily: 'sans-serif',
            }}>

                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                    background: 'linear-gradient(to right, #7c3aed, #f5c842, #7c3aed)',
                    display: 'flex',
                }} />

                <div style={{
                    position: 'absolute', top: '-120px', right: '-120px',
                    width: '500px', height: '500px', borderRadius: '50%',
                    background: 'rgba(124,58,237,0.2)', display: 'flex',
                }} />

                <div style={{
                    position: 'absolute', bottom: '-80px', left: '-80px',
                    width: '400px', height: '400px', borderRadius: '50%',
                    background: 'rgba(245,200,66,0.1)', display: 'flex',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                    <img src={logoBase64} width={80} height={80} style={{ objectFit: 'contain' }} />
                    <span style={{ fontSize: '68px', fontWeight: 900, color: '#ffffff', letterSpacing: '-2px' }}>
            Vạn Sao
          </span>
                </div>

                <div style={{ display: 'flex', fontSize: '26px', color: '#c4b5fd', marginBottom: '40px' }}>
                    Thiết kế Website · Sự kiện · Chuyển dữ liệu
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    {['🌐 Website', '🎉 Sự kiện', '🔄 Dữ liệu'].map(item => (
                        <div key={item} style={{
                            display: 'flex',
                            background: 'rgba(124,58,237,0.25)',
                            border: '1px solid rgba(167,139,250,0.4)',
                            borderRadius: '100px',
                            padding: '10px 24px',
                            color: '#e9d5ff', fontSize: '20px',
                        }}>
                            {item}
                        </div>
                    ))}
                </div>

                <div style={{
                    position: 'absolute', bottom: '36px', display: 'flex',
                    color: '#6b7280', fontSize: '18px', letterSpacing: '2px',
                }}>
                    vansao.com
                </div>

            </div>
        ),
        { ...size }
    )
}