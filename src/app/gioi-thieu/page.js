import Image from 'next/image'
import Link from 'next/link'
import {
    Monitor, CalendarCheck, DatabaseZap, ScanSearch,
    Megaphone, Headset, Star, CheckCircle2, Users,
    ArrowRight, Sparkles
} from 'lucide-react'
import { getAllPosts } from '@/lib/wordpress'

const services = [
    { icon: Monitor,       label: 'Thiết kế Website' },
    { icon: CalendarCheck, label: 'Checkin sự kiện' },
    { icon: DatabaseZap,   label: 'Chuyển đổi dữ liệu' },
    { icon: ScanSearch, label: 'Dịch vụ tìm ảnh' },
    { icon: Megaphone,     label: 'Thiết kế trang quảng cáo' },
    { icon: Headset,       label: 'Hỗ trợ công nghệ & giải pháp' },
]

const steps = [
    { num: '01', title: 'Tư vấn & đề xuất',      desc: 'Lắng nghe nhu cầu, mục tiêu và ngân sách. Đưa ra giải pháp phù hợp, tối ưu chi phí và hiệu quả.' },
    { num: '02', title: 'Báo giá rõ ràng',        desc: 'Thống nhất chi phí, phạm vi công việc, không phát sinh mập mờ.' },
    { num: '03', title: 'Thiết kế & phát triển',  desc: 'Triển khai website hoặc setup sự kiện theo yêu cầu đã duyệt.' },
    { num: '04', title: 'Kiểm tra & bàn giao',    desc: 'Test kỹ, chỉnh sửa theo feedback trước khi bàn giao hoàn chỉnh.' },
    { num: '05', title: 'Hỗ trợ & bảo hành',      desc: 'Đồng hành lâu dài, hỗ trợ kỹ thuật và xử lý khi cần.' },
]

const strengths = [
    { icon: Star,         label: 'Giải pháp chất lượng cao',  desc: 'Công nghệ hiện đại, tối ưu hiệu năng, vận hành ổn định.' },
    { icon: Headset,      label: 'Hỗ trợ 24/7',               desc: 'Luôn sẵn sàng tiếp nhận và xử lý mọi yêu cầu.' },
    { icon: CheckCircle2, label: 'Cam kết kết quả',            desc: 'Không ngại khó, không giới hạn phạm vi hỗ trợ.' },
    { icon: Users,        label: 'Đội ngũ kỹ thuật',          desc: 'Chuyên môn cao, linh hoạt và trách nhiệm.' },
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

export default async function AboutPage() {
    const posts = await getAllPosts()
    const postCount = posts.length

    const stats = [
        { value: '100+',         label: 'Doanh nghiệp hợp tác' },
        { value: '1000+',        label: 'Sự tin tưởng khách hàng' },
        { value: `${postCount}`, label: 'Bài viết & chia sẻ' },
        { value: '5 ⭐',         label: 'Chuẩn 5 sao' },
    ]

    return (
        <main>

            {/* Hero */}
            <section className="relative py-28 bg-gray-950 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-950/60 via-gray-950 to-gray-950" />
                <div className="relative container mx-auto max-w-4xl px-6 text-center flex flex-col items-center gap-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2">
                        <Sparkles size={14} className="text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-300">Hệ sinh thái của SAO</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        Chào mừng bạn đến với{' '}
                        <span className="text-yellow-400">hệ sinh thái của SAO</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
                        SAO ở đây để giải quyết tất cả yêu cầu của bạn. Chúng tôi sẽ biến ý tưởng
                        và giấc mơ của bạn tỏa sáng nhất.
                    </p>
                    <Link
                        href="https://zalo.me/0866631679"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg hover:scale-105 transition-all duration-200"
                    >
                        <Sparkles size={16} />
                        Bắt đầu ngay
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-white border-b border-gray-100">
                <div className="container mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map(({ value, label }) => (
                        <div key={label} className="flex flex-col items-center gap-2 text-center">
                            <span className="text-4xl font-bold text-purple-600">{value}</span>
                            <span className="text-base text-gray-500">{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* SAO là ai */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col gap-6">
            <span className="inline-block w-fit rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-600 uppercase tracking-wide">
              SAO là ai?
            </span>
                        <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                            Một <span className="text-purple-600">ngôi sao nhỏ</span> trong lĩnh vực công nghệ
                        </h2>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Vạn Sao là một &ldquo;ngôi sao nhỏ&rdquo; trong lĩnh vực công nghệ, với sứ mệnh biến
                            ý tưởng và mong muốn của khách hàng thành những điểm sáng nổi bật.
                        </p>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Vạn Sao hướng đến việc đưa các giải pháp công nghệ chất lượng đến nhiều khu vực hơn,
                            không chỉ trung tâm mà cả vùng ven và các tỉnh, với chi phí phù hợp và dễ tiếp cận.
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-3xl scale-110" />
                            <Image
                                src="/logo.png"
                                alt="Vạn Sao"
                                width={280}
                                height={280}
                                className="relative object-contain drop-shadow-2xl animate-wobble"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SAO làm gì */}
            <section className="py-24 bg-white">
                <div className="container mx-auto max-w-6xl px-6">
                    <div className="text-center mb-14">
            <span className="inline-block rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-600 uppercase tracking-wide mb-4">
              SAO làm gì?
            </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Dịch vụ <span className="text-purple-600">đa dạng</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {services.map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 hover:border-purple-200 hover:bg-purple-50 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                            >
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                                    <Icon size={22} className="text-purple-600" />
                                </div>
                                <span className="text-base font-semibold text-gray-800">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quy trình 5 SAO */}
            <section className="py-24 bg-gray-950">
                <div className="container mx-auto max-w-6xl px-6">
                    <div className="text-center mb-14">
            <span className="inline-block rounded-full bg-yellow-400/20 px-5 py-2 text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-4">
              Quy trình
            </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            Quy trình <span className="text-yellow-400">5 SAO</span>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-5">
                        {steps.map((step, i) => (
                            <div
                                key={step.num}
                                className="flex items-start gap-6 rounded-2xl border border-gray-800 bg-gray-900 p-8 hover:border-purple-700 transition-all duration-200"
                            >
                                <span className="text-4xl font-bold text-purple-500 shrink-0 w-12">{step.num}</span>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                                    <p className="text-base text-gray-400 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tại sao chọn SAO */}
            <section className="py-24 bg-white">
                <div className="container mx-auto max-w-6xl px-6">
                    <div className="text-center mb-14">
            <span className="inline-block rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-600 uppercase tracking-wide mb-4">
              Tại sao chọn SAO?
            </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Luôn lắng nghe,{' '}
                            <span className="text-purple-600">không giới hạn</span>
                        </h2>
                        <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            SAO luôn lắng nghe và đáp ứng mọi yêu cầu của khách hàng, từ những nhu cầu
                            đơn giản đến các bài toán phức tạp. Với tinh thần linh hoạt và trách nhiệm,
                            SAO đảm bảo mỗi yêu cầu đều được tiếp nhận và xử lý một cách phù hợp.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {strengths.map(({ icon: Icon, label, desc }) => (
                            <div
                                key={label}
                                className="flex items-start gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-8 hover:border-purple-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                            >
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                                    <Icon size={22} className="text-purple-600" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-xl font-bold text-gray-900">{label}</h3>
                                    <p className="text-base text-gray-500 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-purple-700 to-purple-600">
                <div className="container mx-auto max-w-3xl px-6 text-center flex flex-col items-center gap-6">
                    <h2 className="text-4xl font-bold text-white">Sẵn sàng bắt đầu?</h2>
                    <p className="text-lg text-purple-100">
                        Liên hệ Vạn Sao ngay hôm nay để được tư vấn miễn phí.
                    </p>
                    <Link
                        href="https://zalo.me/0866631679"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-purple-700 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 shadow-lg"
                    >
                        <Sparkles size={17} />
                        Liên hệ ngay
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </section>

        </main>
    )
}