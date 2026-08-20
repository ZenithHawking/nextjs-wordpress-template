import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail, Phone, Clock, Sparkles } from 'lucide-react'
import { BUSINESS } from '@/lib/seo'

const navLinks = [
    { href: '/',            label: 'Trang chủ' },
    { href: '/gioi-thieu', label: 'Giới thiệu' },
    { href: '/dich-vu',    label: 'Dịch vụ' },
    { href: '/blog',       label: 'Blog' },
    { href: '/lien-he',    label: 'Liên hệ' },
]

const serviceLinks = [
    { href: '/dich-vu/dich-vu-thiet-ke-website',  label: 'Thiết kế Website' },
    { href: '/dich-vu/dich-vu-su-kien-tiec-cuoi', label: 'Sự kiện & Tiệc cưới' },
    { href: '/dich-vu/dich-vu-chuyen-du-lieu',    label: 'Chuyển dữ liệu web' },
]

// NAP must match localBusinessSchema and the Google Business Profile exactly —
// any mismatch weakens local ranking.
const contacts = [
    { icon: MapPin, label: 'Văn phòng',    value: BUSINESS.addressLine,        href: null },
    { icon: Clock,  label: 'Giờ làm việc', value: BUSINESS.openingHoursDisplay, href: null },
    { icon: Mail,   label: 'Gửi email',    value: BUSINESS.email,              href: `mailto:${BUSINESS.email}` },
    { icon: Phone,  label: 'Hotline 24/7', value: BUSINESS.phoneDisplay,       href: `tel:${BUSINESS.phone}` },
]

export default function Footer() {
    return (
        <footer className="vs-ftr">
            <div className="vs-shell">
                <div className="grid">

                    {/* Brand */}
                    <div className="brand-block">
                        <div className="brand-row">
                            <Image
                                src="/logo.png"
                                alt="Vạn Sao"
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                            <span className="wordmark">Vạn Sao</span>
                        </div>
                        <p>
                            Vạn Sao là đơn vị thiết kế website, tổ chức sự kiện và dịch vụ
                            tiệc cưới, phục vụ doanh nghiệp, cửa hàng và khách hàng cá nhân
                            với giải pháp sáng tạo, chỉn chu và hiệu quả.
                        </p>
                        <div className="socials">
                            <a
                                href="https://www.facebook.com/profile.php?id=61576379972366"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            </a>
                            <a
                                href="https://zalo.me/0866631679"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Zalo"
                            >
                                <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: '-0.04em' }}>Zalo</span>
                            </a>
                            <a href="tel:0866631679" aria-label="Hotline"><Phone size={15} /></a>
                            <a href="mailto:vansao.contact@gmail.com" aria-label="Email"><Mail size={15} /></a>
                        </div>
                    </div>

                    {/* Pages */}
                    <div>
                        <h5>Khám phá</h5>
                        <ul>
                            {navLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h5>Dịch vụ</h5>
                        <ul>
                            {serviceLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h5>Liên hệ Vạn Sao</h5>
                        <div className="contact-mini">
                            {contacts.map(item => {
                                const Icon = item.icon
                                return (
                                    <div key={item.label} className="item">
                                        <span className="icon"><Icon size={15} /></span>
                                        <div>
                                            <small>{item.label}</small>
                                            {item.href ? (
                                                <a href={item.href}>{item.value}</a>
                                            ) : (
                                                <span>{item.value}</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

                <div className="bottom">
                    <span>© {new Date().getFullYear()} Vạn Sao. Tất cả quyền được bảo lưu.</span>
                    <div className="right">
                        <Link href="/dieu-khoan">Điều khoản</Link>
                        <span className="sep">·</span>
                        <Link href="/bao-mat">Bảo mật</Link>
                        <span className="sep">·</span>
                        <span className="made">
                            <Sparkles size={11} />
                            Made in Vietnam
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
