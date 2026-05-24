const DIRECTUS_URL = process.env.DIRECTUS_URL
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN

if (!DIRECTUS_URL) {
    throw new Error('DIRECTUS_URL chưa được set trong .env.local')
}

const headers = {
    'Content-Type': 'application/json',
    ...(DIRECTUS_TOKEN && { Authorization: `Bearer ${DIRECTUS_TOKEN}` }),
}

async function directusFetch(path, revalidate = 3600) {
    const res = await fetch(`${DIRECTUS_URL}${path}`, {
        headers,
        next: { revalidate },
    })
    if (!res.ok) return null
    return res.json()
}

function resolveImageUrl(path) {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${DIRECTUS_URL}${path}`
}

function resolvePostImages(posts) {
    return posts.map(p => ({
        ...p,
        featured_image: resolveImageUrl(p.featured_image),
    }))
}

// M2M relation not configured in Directus meta, so we join manually
async function attachCategories(posts) {
    if (!posts.length) return posts
    const postIds = posts.map(p => p.id)

    const junctionData = await directusFetch(
        `/items/posts_categories?filter[posts_id][_in]=${postIds.join(',')}&limit=-1`
    )
    const junctions = junctionData?.data ?? []
    if (!junctions.length) return posts

    const catIds = [...new Set(junctions.map(j => j.categories_id))]
    const catData = await directusFetch(
        `/items/categories?filter[id][_in]=${catIds.join(',')}&limit=-1`
    )
    const catMap = Object.fromEntries((catData?.data ?? []).map(c => [c.id, c]))

    return posts.map(post => {
        const postCats = junctions
            .filter(j => j.posts_id === post.id)
            .map(j => ({ categories_id: catMap[j.categories_id] ?? null }))
            .filter(c => c.categories_id)
        return { ...post, categories: postCats }
    })
}

// ── Posts ──

export async function getLatestPosts(count = 3) {
    const data = await directusFetch(
        `/items/posts?fields=*&sort=-date_created&limit=${count}&filter[status][_eq]=publish`
    )
    return attachCategories(resolvePostImages(data?.data ?? []))
}

export async function getAllPosts() {
    const data = await directusFetch(
        `/items/posts?fields=*&sort=-date_created&limit=-1&filter[status][_eq]=publish`
    )
    return attachCategories(resolvePostImages(data?.data ?? []))
}

export async function getPosts(page = 1, perPage = 9, search = '') {
    const offset = (page - 1) * perPage
    const q = search ? `&search=${encodeURIComponent(search)}` : ''
    const data = await directusFetch(
        `/items/posts?fields=*&sort=-date_created&limit=${perPage}&offset=${offset}&meta=filter_count&filter[status][_eq]=publish${q}`,
        search ? 30 : 60
    )
    if (!data) return { posts: [], total: 0, totalPages: 0 }
    const total = data.meta?.filter_count ?? 0
    const totalPages = Math.ceil(total / perPage)
    const posts = await attachCategories(resolvePostImages(data.data ?? []))
    return { posts, total, totalPages }
}

export async function getPostBySlug(slug) {
    const data = await directusFetch(
        `/items/posts?fields=*&filter[slug][_eq]=${encodeURIComponent(slug)}&filter[status][_eq]=publish`
    )
    const posts = await attachCategories(resolvePostImages(data?.data ?? []))
    return posts[0] ?? null
}

export async function getPostsByCategory(categoryId, page = 1, perPage = 9) {
    const offset = (page - 1) * perPage
    const junctionData = await directusFetch(
        `/items/posts_categories?filter[categories_id][_eq]=${categoryId}&fields=posts_id&limit=-1`
    )
    const postIds = (junctionData?.data ?? []).map(j => j.posts_id)
    if (!postIds.length) return { posts: [], total: 0, totalPages: 0 }

    const data = await directusFetch(
        `/items/posts?fields=*&sort=-date_created&limit=${perPage}&offset=${offset}&meta=filter_count&filter[status][_eq]=publish&filter[id][_in]=${postIds.join(',')}`
    )
    if (!data) return { posts: [], total: 0, totalPages: 0 }
    const total = data.meta?.filter_count ?? 0
    const totalPages = Math.ceil(total / perPage)
    const posts = await attachCategories(resolvePostImages(data.data ?? []))
    return { posts, total, totalPages }
}

// ── Categories ──

export async function getCategories() {
    const data = await directusFetch(`/items/categories?limit=-1`, 60)
    return data?.data ?? []
}

// ── Services ──

export async function getServiceBySlug(slug) {
    const data = await directusFetch(
        `/items/services?fields=*&filter[slug][_eq]=${encodeURIComponent(slug)}&filter[status][_eq]=publish`
    )
    return data?.data?.[0] ?? null
}

// ── For sitemap ──

export async function getAllServices() {
    const data = await directusFetch(
        `/items/services?fields=slug,date_updated&filter[status][_eq]=publish&limit=-1`
    )
    return data?.data ?? []
}
