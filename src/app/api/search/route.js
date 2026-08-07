import { NextResponse } from 'next/server'
import { getPosts } from '@/lib/directus'

export async function GET(request) {
    const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
    if (!q) return NextResponse.json({ posts: [] })

    const { posts } = await getPosts(1, 5, q)

    return NextResponse.json({
        posts: posts.map(p => ({
            slug: p.slug,
            title: p.title,
            featured_image: p.featured_image,
        })),
    })
}
