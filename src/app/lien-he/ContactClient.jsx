'use client'

import { useState } from 'react'
import { Phone, MapPin, Send, MessageCircle, Clock, Sparkles, Star } from 'lucide-react'

function FacebookIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
    )
}

function ZaloIcon() {
    return (
        <span style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 }}>Z</span>
    )
}

export default function ContactClient() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setStatus('loading')

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, message }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setStatus('success')
            setName('')
            setPhone('')
            setMessage('')
        } catch (err) {
            console.error(err)
            setStatus('error')
        }
    }

    return (
        <main className="vs-contact-page">

            {/* Hero */}
            <section className="vs-contact-hero">
                <div className="vs-shell">
                    <span className="vs-eyebrow yellow">
                        <MessageCircle size={13} />
                        Liên hệ với Vạn Sao
                    </span>
                    <h1>
                        Bắt đầu dự án cùng <span className="hl-yellow">SAO</span>.
                    </h1>
                    <p className="lead">
                        Để lại thông tin, Sao sẽ liên hệ tư vấn miễn phí trong vòng 24 giờ.
                        Không ràng buộc, không chi phí ẩn.
                    </p>
                    <div className="perks">
                        <span><Star size={13} /> Tư vấn miễn phí</span>
                        <span><Star size={13} /> Phản hồi trong 24 giờ</span>
                        <span><Star size={13} /> Hỗ trợ lâu dài</span>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="vs-contact-body">
                <div className="vs-shell">
                    <div className="vs-contact-grid">

                        {/* Left — Info + Social */}
                        <div className="vs-contact-info">

                            <div className="info-card">
                                <h2>Thông tin liên hệ</h2>

                                <div className="info-row">
                                    <div className="icon-box"><MapPin size={20} /></div>
                                    <div>
                                        <span className="label">Địa chỉ</span>
                                        <span className="value">TP. Hồ Chí Minh, Việt Nam</span>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="icon-box"><Phone size={20} /></div>
                                    <div>
                                        <span className="label">Hotline</span>
                                        <a href="tel:0866631679" className="value link">08 666 31679</a>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="icon-box green"><Clock size={20} /></div>
                                    <div>
                                        <span className="label">Giờ hỗ trợ</span>
                                        <span className="value">Luôn online 24/7</span>
                                        <span className="status-online">
                                            <span className="dot" />
                                            Đang hoạt động
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="social-card">
                                <h2>Kết nối với chúng tôi</h2>
                                <div className="social-links">
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61576379972366"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link fb"
                                    >
                                        <span className="icon-box"><FacebookIcon /></span>
                                        <div>
                                            <span className="name">Facebook</span>
                                            <span className="desc">Nhắn tin qua Facebook</span>
                                        </div>
                                    </a>
                                    <a
                                        href="https://zalo.me/0866631679"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link zalo"
                                    >
                                        <span className="icon-box"><ZaloIcon /></span>
                                        <div>
                                            <span className="name">Zalo</span>
                                            <span className="desc">Chat Zalo: 08 666 31679</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right — Form */}
                        <div className="vs-contact-form-card">
                            <h2>Gửi yêu cầu tư vấn</h2>
                            <p className="subtitle">Điền thông tin bên dưới, chúng tôi sẽ liên hệ sớm nhất.</p>

                            <form onSubmit={handleSubmit} className="vs-contact-form">
                                <div className="field">
                                    <label>Họ và tên <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Trần Thanh Sao"
                                    />
                                </div>

                                <div className="field">
                                    <label>Số điện thoại <span className="req">*</span></label>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="08 666 31679"
                                    />
                                </div>

                                <div className="field">
                                    <label>Nội dung <span className="req">*</span></label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder="Bạn cần tư vấn về dịch vụ nào? Mô tả ngắn về yêu cầu..."
                                    />
                                </div>

                                <button type="submit" disabled={status === 'loading'} className="submit-btn">
                                    <Send size={16} />
                                    {status === 'loading' ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
                                </button>

                                {status === 'success' && (
                                    <div className="msg success">
                                        <p className="title">Gửi thành công!</p>
                                        <p>Vạn Sao sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="msg error">
                                        <p>Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ qua Zalo.</p>
                                    </div>
                                )}
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    )
}
