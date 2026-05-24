'use client'
import { useState } from 'react'
import { Send, Phone, Mail, MapPin, Sparkles, ArrowRight } from 'lucide-react'

export default function ContactSection() {
    const [form, setForm] = useState({ name: '', phone: '', message: '' })
    const [status, setStatus] = useState(null)

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setStatus('loading')
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setStatus('success')
            setForm({ name: '', phone: '', message: '' })
        } catch {
            setStatus('error')
        }
    }

    return (
        <section className="vs-contact-section" id="lien-he" aria-labelledby="contact-h2">
            <div className="vs-shell">
                <div className="grid">

                    {/* Left — info */}
                    <div className="left">
                        <span className="vs-eyebrow">
                            <Sparkles size={13} className="text-vs-purple" />
                            Liên hệ · Tư vấn miễn phí
                        </span>
                        <h2 id="contact-h2">
                            Bắt đầu dự án cùng <span className="accent">Vạn Sao</span> nào!
                        </h2>
                        <p className="desc">
                            Để lại thông tin, Vạn Sao sẽ liên hệ tư vấn miễn phí trong vòng 24 giờ.
                            Không spam, không cuộc gọi rác — chỉ là một cuộc trò chuyện về dự án của bạn.
                        </p>

                        <div className="vs-contact-cards">
                            <a href="tel:0866631679" className="vs-contact-card">
                                <div className="head">
                                    <span className="ico"><Phone size={18} /></span>
                                    <h4>Hotline 24/7</h4>
                                </div>
                                <span className="val">08 666 31679</span>
                            </a>
                            <a
                                href="https://zalo.me/0866631679"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="vs-contact-card purple"
                            >
                                <div className="head">
                                    <span className="ico"><Sparkles size={16} /></span>
                                    <h4>Zalo</h4>
                                </div>
                                <span className="val">@vansao</span>
                            </a>
                            <a href="mailto:vansao.contact@gmail.com" className="vs-contact-card mint">
                                <div className="head">
                                    <span className="ico"><Mail size={18} /></span>
                                    <h4>Email</h4>
                                </div>
                                <span className="val" style={{ fontSize: 14.5 }}>
                                    vansao.contact@gmail.com
                                </span>
                            </a>
                            <div className="vs-contact-card">
                                <div className="head">
                                    <span className="ico"><MapPin size={18} /></span>
                                    <h4>Văn phòng</h4>
                                </div>
                                <span className="val" style={{ fontSize: 14.5 }}>
                                    TP. Hồ Chí Minh, Việt Nam
                                </span>
                            </div>
                        </div>

                        <div className="vs-quote-block">
                            <span className="qmark">&ldquo;</span>
                            <p className="qbody">
                                Làm gọn — đúng nhu cầu — đúng ngân sách, đồng hành lâu dài thay vì bàn giao xong là hết.
                                <b>— phương châm Vạn Sao</b>
                            </p>
                        </div>
                    </div>

                    {/* Right — form */}
                    <form onSubmit={handleSubmit} className="vs-contact-form">
                        <div className="frm-head">
                            <h3>Gửi yêu cầu tư vấn</h3>
                            <span className="pill">
                                <span className="dot" />
                                Phản hồi trong 24h
                            </span>
                        </div>

                        <div className="field">
                            <label>
                                Họ và tên <span className="req">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Nguyễn Văn A"
                            />
                        </div>

                        <div className="field">
                            <label>
                                Số điện thoại <span className="req">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                placeholder="0912 345 678"
                            />
                        </div>

                        <div className="field">
                            <label>
                                Nội dung tin nhắn <span className="req">*</span>
                            </label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Bạn cần tư vấn về dịch vụ nào? Mô tả ngắn về dự án của bạn..."
                            />
                        </div>

                        <div className="submit-row">
                            <span className="note">
                                Thông tin của bạn được bảo mật tuyệt đối, không chia sẻ cho bên thứ ba.
                            </span>
                            <button type="submit" disabled={status === 'loading'}>
                                {status === 'loading' ? (
                                    <>
                                        <span
                                            style={{
                                                width: 13, height: 13,
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                borderTop: '2px solid #fff', borderRadius: '50%',
                                                animation: 'spin 0.7s linear infinite',
                                            }}
                                        />
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={12} className="star" />
                                        Gửi liên hệ
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </div>

                        {status === 'success' && (
                            <div className="status success">
                                ✓ Cảm ơn bạn! Vạn Sao sẽ liên hệ trong vòng 24 giờ.
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="status error">
                                ✗ Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline 08 666 31679.
                            </div>
                        )}
                    </form>

                </div>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </section>
    )
}
