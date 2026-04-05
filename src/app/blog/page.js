import { getPosts, getCategories } from '@/lib/wordpress'
import BlogClient from './BlogClient'

export const metadata = {
    title: 'Blog',
    description: 'Chia sẻ kiến thức về thiết kế website, công nghệ sự kiện và giải pháp số từ Vạn Sao.',
    alternates: { canonical: 'https://vansao.com/blog' },
    openGraph: {
        title: 'Blog Vạn Sao — Kiến thức & Góc nhìn',
        description: 'Chia sẻ về thiết kế website, công nghệ sự kiện và giải pháp số từ đội ngũ Vạn Sao.',
        url: 'https://vansao.com/blog',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
}

export default async function BlogPage() {
    const [{ posts, total }, categories] = await Promise.all([
        getPosts(1, 100),
        getCategories(),
    ])

    const filteredCategories = categories.filter(c => c.slug !== 'uncategorized')

    return <BlogClient posts={posts} total={total} categories={filteredCategories} />
}