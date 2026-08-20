import { getAllPosts } from '@/lib/directus'
import { SITE_URL } from '@/lib/seo'

// Rebuilt hourly instead of on every crawl. force-dynamic meant a single
// Directus hiccup served Google a sitemap with the blog posts missing.
export const revalidate = 3600

export default async function sitemap() {
    const baseUrl = SITE_URL

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

    // Blog posts from Directus
    const posts = await getAllPosts()
    const postRoutes = posts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date_updated ?? post.date_created),
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    return [...staticRoutes, ...postRoutes]
}
