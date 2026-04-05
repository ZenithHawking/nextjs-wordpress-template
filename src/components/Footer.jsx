import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail, Phone, ChevronRight, Sparkles } from 'lucide-react'

const navLinks = [
    { href: '/',            label: 'Trang chủ' },
    { href: '/gioi-thieu', label: 'Giới thiệu' },
    { href: '/dich-vu',    label: 'Dịch vụ' },
    { href: '/blog',       label: 'Blog' },
    { href: '/lien-he',    label: 'Liên hệ' },
]

const contacts = [
    { icon: MapPin, label: 'TP Hồ Chí Minh',              href: null },
    { icon: Mail,   label: 'vansao.contact@gmail.com',     href: 'mailto:vansao.contact@gmail.com' },
    { icon: Phone,  label: '08 666 31679',                 href: 'tel:0866631679' },
]

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-400">

            <div className="h-[2px] w-full bg-gradient-to-r from-purple-800 via-yellow-400 to-purple-800" />

            <div className="container mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* Cột 1 — Brand */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-3 w-fit group">
                        <Image
                            src="/logo.png"
                            alt="Vạn Sao"
                            width={44}
                            height={44}
                            className="object-contain"
                        />
                        <span className="text-white text-2xl font-bold tracking-tight group-hover:text-yellow-400 transition-colors">
              Vạn Sao
            </span>
                    </Link>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Vạn Sao là đơn vị thiết kế website chuyên nghiệp, tổ chức sự kiện và dịch vụ
                        tiệc cưới, phục vụ doanh nghiệp, cửa hàng và khách hàng cá nhân với giải pháp
                        sáng tạo, chỉn chu và hiệu quả.
                    </p>
                    <div className="flex items-center gap-3">
                        <a
                            href="https://www.facebook.com/profile.php?id=61576379972366"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-110"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                            </svg>
                        </a>
                        <a
                            href="https://zalo.me/0866631679"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all duration-200 hover:scale-110"
                        >
                                    <span style={{
                                        fontSize: '18px',
                                        fontWeight: 900,
                                        letterSpacing: '-1px',
                                        lineHeight: 1
                                    }}>
      Z
    </span>
                        </a>
                        <a
                            href="tel:0866631679"
                            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all duration-200 hover:scale-110"
                        >
                            <Phone size={15} />
                        </a>
                    </div>
                </div>

                {/* Cột 2 — Điều hướng */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-semibold text-sm uppercase tracking-widest">
                        Trang
                    </h3>
                    <ul className="flex flex-col gap-3">
                        {navLinks.map(link => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-yellow-400 transition-colors group"
                                >
                                    <ChevronRight size={14} className="text-purple-500 group-hover:text-yellow-400 transition-colors shrink-0" />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cột 3 — Liên hệ */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-semibold text-sm uppercase tracking-widest">
                        Liên hệ
                    </h3>
                    <ul className="flex flex-col gap-3">
                        {contacts.map(function(item) {
                            const Icon = item.icon
                            return (
                                <li key={item.label} className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-yellow-400 shrink-0">
                    <Icon size={15} />
                  </span>
                                    {item.href ? (
                                        <a href={item.href} className="text-sm hover:text-yellow-400 transition-colors">
                                            {item.label}
                                        </a>
                                    ) : (
                                        <span className="text-sm">{item.label}</span>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>

            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto max-w-6xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
                    <p>© {new Date().getFullYear()} Vạn Sao. Tất cả quyền được bảo lưu.</p>
                    <p className="flex items-center gap-1.5">
                        Thiết kế với <Sparkles size={12} className="text-yellow-400" /> tại Việt Nam
                    </p>
                </div>
            </div>

        </footer>
    )
}
