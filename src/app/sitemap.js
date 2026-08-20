import { getAllPosts } from '@/lib/directus'
import { SITE_URL } from '@/lib/seo'

// Must render per request: the CI build container cannot reach the Directus
// host, so prerendering this at build time ships a sitemap containing only the
// static routes. The underlying getAllPosts() fetch is itself cached for an
// hour, so this costs one upstream call per hour, not one per crawl.
export const dynamic = 'force-dynamic'

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
