import Image from 'next/image'
import Link from 'next/link'
import {
    Monitor, CalendarCheck, DatabaseZap, ScanSearch,
    Megaphone, Headset, Star, CheckCircle2, Users,
    ArrowRight
} from 'lucide-react'
import ProcessTimeline from '@/components/ProcessTimeline'

export const dynamic = 'force-dynamic'

const services = [
    { icon: Monitor,       label: 'Thiết kế Website',         cls: 'yellow' },
    { icon: CalendarCheck, label: 'Checkin sự kiện',           cls: 'purple' },
    { icon: DatabaseZap,   label: 'Chuyển đổi dữ liệu',        cls: 'mint' },
    { icon: ScanSearch,    label: 'Dịch vụ tìm ảnh',           cls: 'peach' },
    { icon: Megaphone,     label: 'Thiết kế trang quảng cáo',  cls: 'yellow' },
    { icon: Headset,       label: 'Hỗ trợ công nghệ & giải pháp', cls: 'purple' },
]

const strengths = [
    { icon: Star,         label: 'Giải pháp chất lượng cao',  desc: 'Công nghệ hiện đại, tối ưu hiệu năng, vận hành ổn định.', cls: 'r-1' },
    { icon: Headset,      label: 'Hỗ trợ 24/7',                desc: 'Luôn sẵn sàng tiếp nhận và xử lý mọi yêu cầu.',          cls: 'r-2' },
    { icon: CheckCircle2, label: 'Cam kết kết quả',            desc: 'Không ngại khó, không giới hạn phạm vi hỗ trợ.',         cls: 'r-3' },
    { icon: Users,        label: 'Đội ngũ kỹ thuật',           desc: 'Chuyên môn cao, linh hoạt và trách nhiệm.',              cls: 'r-4' },
]

export const metadata = {
    title: 'Về chúng tôi',
    description: 'Vạn Sao là đơn vị công nghệ chuyên thiết kế website, tổ chức sự kiện và chuyển dữ liệu web tại TP. Hồ Chí Minh. Giải pháp sáng tạo, chỉn chu và hiệu quả.',
    alternates: { canonical: 'https://vansao.com/gioi-thieu' },
    openGraph: {
        title: 'Về Vạn Sao — Đơn vị công nghệ sáng tạo',
        description: 'Vạn Sao là đơn vị công nghệ chuyên thiết kế website, tổ chức sự kiện và chuyển dữ liệu web tại TP. Hồ Chí Minh.',
        url: 'https://vansao.com/gioi-thieu',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
}

export default function AboutPage() {
    return (
        <main>

            {/* Hero — editorial light, đồng bộ với homepage */}
            <section className="vs-about-hero">
                <div className="hero-bg" aria-hidden="true" />
                <div className="hero-cloud" aria-hidden="true" />
                <div className="vs-shell">
                    <div className="grid">
                        <div className="left">
                            <h1>
                                Chào mừng bạn đến với hệ sinh thái của SAO
                            </h1>
                            <p className="lead">
                                SAO ở đây để giải quyết tất cả yêu cầu của bạn. Chúng tôi sẽ biến ý tưởng
                                và giấc mơ của bạn tỏa sáng nhất.
                            </p>
                            <div className="actions">
                                <Link
                                    href="https://zalo.me/0866631679"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                >
                                    Bắt đầu ngay
                                    <ArrowRight size={15} />
                                </Link>
                                <Link href="#quy-trinh" className="btn-ghost">
                                    Xem quy trình
                                </Link>
                            </div>
                        </div>
                        <div className="right">
                            <div className="logo-frame">
                                <div className="glow" />
                                <Image
                                    src="/logo.png"
                                    alt="Vạn Sao"
                                    width={280}
                                    height={280}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SAO là ai */}
            <section className="vs-about-who">
                <div className="vs-shell">
                    <div className="grid">
                        <div className="text">
                            <h2>
                                Một ngôi sao nhỏ trong lĩnh vực công nghệ
                            </h2>
                            <p>
                                Vạn Sao là một &ldquo;ngôi sao nhỏ&rdquo; trong lĩnh vực công nghệ, với sứ mệnh biến
                                ý tưởng và mong muốn của khách hàng thành những điểm sáng nổi bật.
                            </p>
                            <p>
                                Vạn Sao hướng đến việc đưa các giải pháp công nghệ chất lượng đến nhiều khu vực hơn,
                                không chỉ trung tâm mà cả vùng ven và các tỉnh, với chi phí phù hợp và dễ tiếp cận.
                            </p>
                            <div className="tags">
                                <span><span className="dot" /> Sáng tạo</span>
                                <span><span className="dot purple" /> Chỉn chu</span>
                                <span><span className="dot mint" /> Hiệu quả</span>
                            </div>
                        </div>
                        <div className="visual">
                            <div className="ring" />
                            <Image
                                src="/logo.png"
                                alt="Vạn Sao"
                                width={320}
                                height={320}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SAO làm gì — các lĩnh vực chuyên môn */}
            <section className="vs-about-do">
                <div className="vs-shell">
                    <header className="vs-sec-head">
                        <div className="left">
                            <h2>
                                Những lĩnh vực Vạn Sao đang làm chủ
                            </h2>
                            <p className="desc">
                                Không chỉ website — Vạn Sao mở rộng năng lực sang sự kiện,
                                dữ liệu và các giải pháp công nghệ quanh nhu cầu thực tế của khách hàng.
                            </p>
                        </div>
                    </header>

                    <div className="svc-tiles">
                        {services.map(({ icon: Icon, label, cls }, i) => (
                            <div key={i} className={`tile ${cls}`}>
                                <div className="icon-box">
                                    <Icon size={22} strokeWidth={1.7} />
                                </div>
                                <span className="label">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quy trình 5 SAO — sticky scroll reveal */}
            <ProcessTimeline />

            {/* Tại sao chọn SAO — 4 strengths */}
            <section className="vs-about-why">
                <div className="vs-shell">
                    <header className="vs-sec-head">
                        <div className="left">
                            <h2>
                                Luôn lắng nghe, không giới hạn
                            </h2>
                            <p className="desc">
                                SAO luôn lắng nghe và đáp ứng mọi yêu cầu của khách hàng, từ những nhu cầu
                                đơn giản đến các bài toán phức tạp. Với tinh thần linh hoạt và trách nhiệm,
                                SAO đảm bảo mỗi yêu cầu đều được tiếp nhận và xử lý một cách phù hợp.
                            </p>
                        </div>
                    </header>

                    <div className="vs-reasons">
                        {strengths.map(({ icon: Icon, label, desc, cls }) => (
                            <div key={label} className={`vs-reason ${cls}`}>
                                <div className="icon">
                                    <Icon size={22} strokeWidth={1.8} />
                                </div>
                                <h3>{label}</h3>
                                <p>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA — navy bg với yellow accent */}
            <section className="vs-about-cta">
                <div className="vs-shell">
                    <div className="card">
                        <div className="bg-blob" />
                        <h2>
                            Cùng Vạn Sao biến ý tưởng của bạn thành điểm sáng
                        </h2>
                        <p>
                            Liên hệ Vạn Sao ngay hôm nay để được tư vấn miễn phí trong 24 giờ.
                            Không spam, không cuộc gọi rác.
                        </p>
                        <div className="actions">
                            <Link
                                href="https://zalo.me/0866631679"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                            >
                                Liên hệ qua Zalo
                                <ArrowRight size={15} />
                            </Link>
                            <a href="tel:0866631679" className="btn-ghost">
                                Hotline 08 666 31679
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    )
}
