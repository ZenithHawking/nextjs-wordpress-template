'use client'
import { useState } from 'react'
import { Send, Phone, Mail, MapPin } from 'lucide-react'

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
        <section className="py-24 bg-white">
            <div className="container mx-auto max-w-6xl px-6">

                <div className="text-center mb-14">
          <span className="inline-block rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-600 tracking-wide uppercase mb-4">
            Liên hệ
          </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Bắt đầu dự án cùng <span className="text-purple-600">Vạn Sao</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
                        Để lại thông tin, Vạn Sao sẽ liên hệ tư vấn miễn phí trong vòng 24 giờ.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                    <div className="flex flex-col gap-8">
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Vạn Sao luôn sẵn sàng lắng nghe và đồng hành cùng bạn từ bước đầu tiên
                            đến khi hoàn thành dự án.
                        </p>

                        <div className="flex flex-col gap-5">
                            {[
                                { icon: MapPin, label: 'Địa chỉ',  value: 'TP. Hồ Chí Minh, Việt Nam',   href: null },
                                { icon: Mail,   label: 'Email',     value: 'vansao.contact@gmail.com',     href: 'mailto:vansao.contact@gmail.com' },
                                { icon: Phone,  label: 'Hotline',   value: '08 666 31679',                 href: 'tel:0866631679' },
                            ].map(function(item) {
                                const Icon = item.icon
                                return (
                                    <div key={item.label} className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                                            <Icon size={22} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 font-medium">{item.label}</p>
                                            {item.href ? (
                                                <a href={item.href} className="text-base font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className="text-base font-semibold text-gray-800">{item.value}</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="h-px bg-gradient-to-r from-purple-200 via-yellow-200 to-transparent" />

                        <p className="text-base text-gray-400 italic">
                            &ldquo;Làm gọn – đúng nhu cầu – đúng ngân sách, đồng hành lâu dài.&rdquo;
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm"
                    >
                        <div className="flex flex-col gap-1.5">
                            <label className="text-base font-medium text-gray-700">Họ và tên *</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Nguyễn Văn A"
                                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-base font-medium text-gray-700">Số điện thoại *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                placeholder="0912 345 678"
                                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-base font-medium text-gray-700">Nội dung *</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Bạn cần tư vấn về dịch vụ nào? Mô tả ngắn về dự án..."
                                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-7 py-3.5 text-base font-semibold text-white shadow-md hover:from-purple-700 hover:to-purple-600 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200"
                        >
                            {status === 'loading' ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <Send size={17} />
                                    Gửi liên hệ
                                </>
                            )}
                        </button>

                        {status === 'success' && (
                            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-base text-green-700 font-medium text-center">
                                Gửi thành công! Vạn Sao sẽ liên hệ bạn sớm nhất.
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-base text-red-600 font-medium text-center">
                                Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp.
                            </div>
                        )}
                    </form>

                </div>
            </div>
        </section>
    )
}