'use client'

import { useState } from 'react'
import { Phone, MapPin, Send, MessageCircle, Clock, Star } from 'lucide-react'

function FacebookIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
    )
}

function ZaloIcon() {
    return (
        <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 }}>
      Z
    </span>
    )
}

export default function ContactPage() {
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
        <main>

            {/* Hero */}
            <section className="relative py-28 bg-gray-950 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-gray-950 to-gray-950" />
                <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
                <div className="relative container mx-auto max-w-4xl px-6 text-center flex flex-col items-center gap-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2">
                        <MessageCircle size={14} className="text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-300">Liên hệ với Vạn Sao</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        Bắt đầu dự án cùng<br /><span className="text-yellow-400"> SAO</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                        Để lại thông tin, Sao sẽ liên hệ tư vấn miễn phí trong vòng 24 giờ. Không ràng buộc, không chi phí ẩn.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span>Tư vấn miễn phí</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span>Phản hồi trong 24 giờ</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span>Hỗ trợ lâu dài</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                    {/* Cột trái */}
                    <div className="flex flex-col gap-6">

                        {/* Card thông tin */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col gap-6">
                            <h2 className="text-xl font-bold text-gray-900">Thông tin liên hệ</h2>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                                    <MapPin size={22} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-medium">Địa chỉ</p>
                                    <p className="text-base font-semibold text-gray-800">TP. Hồ Chí Minh, Việt Nam</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                                    <Phone size={22} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-medium">Hotline</p>
                                    <a href="tel:0866631679" className="text-base font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                                        08 666 31679
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                                    <Clock size={22} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-medium">Giờ hỗ trợ</p>
                                    <p className="text-base font-semibold text-gray-800">Luôn online 24/7</p>
                                    <p className="text-sm text-green-600 font-medium flex items-center gap-1.5 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                                        Đang hoạt động
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card mạng xã hội */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col gap-5">
                            <h2 className="text-xl font-bold text-gray-900">Kết nối với chúng tôi</h2>
                            <div className="flex flex-col gap-3">
                                <a
                                    href="https://www.facebook.com/profile.php?id=61576379972366"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 hover:bg-blue-100 hover:border-blue-300 hover:scale-[1.02] transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 text-white group-hover:bg-blue-700 transition-colors">
                                        <FacebookIcon />
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-gray-800">Facebook</p>
                                        <p className="text-sm text-gray-500">Nhắn tin qua Facebook</p>
                                    </div>
                                </a>

                                <a
                                    href="https://zalo.me/0866631679"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 hover:bg-blue-100 hover:border-blue-300 hover:scale-[1.02] transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 text-white group-hover:bg-blue-600 transition-colors">
                                        <ZaloIcon />
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-gray-800">Zalo</p>
                                        <p className="text-sm text-gray-500">Chat Zalo: 08 666 31679</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Cột phải — Form */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Gửi yêu cầu tư vấn</h2>
                            <p className="text-base text-gray-500 mt-1">Điền thông tin bên dưới, chúng tôi sẽ liên hệ sớm nhất.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-base font-medium text-gray-700">Họ và tên *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Trần Thanh Sao"
                                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-base font-medium text-gray-700">Số điện thoại *</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="08 666 31679"
                                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-base font-medium text-gray-700">Nội dung *</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Bạn cần tư vấn về dịch vụ nào? Mô tả ngắn về yêu cầu..."
                                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-7 py-4 text-base font-semibold text-white shadow-md hover:from-purple-700 hover:to-purple-600 hover:scale-105 disabled:opacity-60 disabled:scale-100 transition-all duration-200"
                            >
                                <Send size={17} />
                                {status === 'loading' ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
                            </button>

                            {status === 'success' && (
                                <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-4 text-base text-green-700 font-medium text-center flex flex-col gap-1">
                                    <p className="font-bold">Gửi thành công!</p>
                                    <p className="text-sm font-normal text-green-600">Vạn Sao sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                                </div>
                            )}
                        </form>
                    </div>

                </div>
            </section>

        </main>
    )
}