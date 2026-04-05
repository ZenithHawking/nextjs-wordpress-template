import { getAllPages, getAllPosts } from '@/lib/wordpress'

export default async function sitemap() {
    const baseUrl = 'https://vansao.com'

    const staticRoutes = [
        { url: baseUrl,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
        { url: `${baseUrl}/gioi-thieu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/dich-vu`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/blog`,       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
        { url: `${baseUrl}/lien-he`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/dich-vu/dich-vu-thiet-ke-website`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/dich-vu/dich-vu-su-kien-tiec-cuoi`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/dich-vu/dich-vu-chuyen-du-lieu`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ]

    // Blog posts từ WordPress
    const posts = await getAllPosts()
    const postRoutes = posts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    return [...staticRoutes, ...postRoutes]
}