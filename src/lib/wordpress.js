// src/lib/wordpress.js
const WP_API = process.env.WORDPRESS_API_URL

if (!WP_API) {
    throw new Error('WORDPRESS_API_URL chưa được set trong .env.local')
}

// Fetch một page theo slug
export async function getPageBySlug(slug) {
    const res = await fetch(`${WP_API}/pages?slug=${slug}&_embed`, {
        next: { revalidate: 3600 } // cache 1 tiếng, tự động revalidate
    })
    if (!res.ok) return null
    const pages = await res.json()
    return pages[0] ?? null
}

// Fetch tất cả pages (dùng cho sitemap, generateStaticParams)
export async function getAllPages() {
    const res = await fetch(`${WP_API}/pages?per_page=100`, {
        next: { revalidate: 3600 }
    })
    if (!res.ok) return []
    return res.json()
}

// Fetch SEO meta từ Yoast (cần plugin Yoast SEO to REST API)
export async function getSeoBySlug(slug) {
    const page = await getPageBySlug(slug)
    if (!page) return null
    return page.yoast_head_json ?? null
}

export async function getLatestPosts(count = 3) {
    const res = await fetch(
        `${process.env.WORDPRESS_API_URL}/posts?per_page=${count}&_embed&orderby=date&order=desc`,
        { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    return res.json()
}

export async function getAllPosts() {
    const res = await fetch(
        `${process.env.WORDPRESS_API_URL}/posts?per_page=100`,
        { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    return res.json()
}
export async function getServiceBySlug(slug) {
    const res = await fetch(
        `${process.env.WORDPRESS_API_URL}/pages?slug=${slug}&_embed`,
        { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const pages = await res.json()
    return pages[0] ?? null
}
export async function getPosts(page = 1, perPage = 9) {
    const res = await fetch(
        `${process.env.WORDPRESS_API_URL}/posts?page=${page}&per_page=${perPage}&_embed&orderby=date&order=desc`,
        { next: { revalidate: 60  } }
    )
    if (!res.ok) return { posts: [], total: 0, totalPages: 0 }
    const posts = await res.json()
    const total = parseInt(res.headers.get('X-WP-Total') ?? '0')
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '0')
    return { posts, total, totalPages }
}

export async function getPostBySlug(slug) {
    const res = await fetch(
        `${process.env.WORDPRESS_API_URL}/posts?slug=${slug}&_embed`,
        { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const posts = await res.json()
    return posts[0] ?? null
}
export async function getCategories() {
    const res = await fetch(
        `${process.env.WORDPRESS_API_URL}/categories?per_page=20`,
        { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    return res.json()
}

export async function getPostsByCategory(categoryId, page = 1, perPage = 9) {
    const res = await fetch(
        `${process.env.WORDPRESS_API_URL}/posts?categories=${categoryId}&page=${page}&per_page=${perPage}&_embed&orderby=date&order=desc`,
        { next: { revalidate: 3600 } }
    )
    if (!res.ok) return { posts: [], total: 0 }
    const posts = await res.json()
    const total = parseInt(res.headers.get('X-WP-Total') ?? '0')
    return { posts, total }
}