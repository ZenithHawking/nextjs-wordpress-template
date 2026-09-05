#!/usr/bin/env node
/**
 * Publish (or update) a hand-written article from content/blog/ into Directus.
 *
 * Usage:
 *   node scripts/publish-post.mjs <slug>              # dry run, prints the payload
 *   node scripts/publish-post.mjs <slug> --publish    # actually writes to Directus
 *
 * Re-running with --publish on an existing slug PATCHes that post instead of
 * creating a duplicate, and refreshes date_updated so the sitemap lastmod moves.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content', 'blog')

// src/lib/indexnow.js imports SITE_URL through the '@/lib/seo' alias, which
// only resolves inside the Next.js build, so the call is inlined here. The key
// must stay identical to the one there and to public/<key>.txt.
const INDEXNOW_KEY = '4a26b328f5a407e35d13345d5cc2eb70'

async function submitToIndexNow(urls) {
    try {
        const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
                host: 'vansao.com',
                key: INDEXNOW_KEY,
                keyLocation: `https://vansao.com/${INDEXNOW_KEY}.txt`,
                urlList: urls,
            }),
        })
        return { ok: res.status === 200 || res.status === 202, status: res.status }
    } catch (err) {
        return { ok: false, error: err.message }
    }
}

async function loadEnv() {
    try {
        const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
        for (const line of raw.split('\n')) {
            const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
            if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
        }
    } catch {
        // .env.local is optional when the vars are already exported.
    }
}

async function main() {
    const [slug, ...flags] = process.argv.slice(2)
    if (!slug) {
        console.error('Usage: node scripts/publish-post.mjs <slug> [--publish]')
        process.exit(1)
    }
    const live = flags.includes('--publish')

    await loadEnv()
    const { DIRECTUS_URL, DIRECTUS_TOKEN } = process.env
    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
        console.error('Thiếu DIRECTUS_URL hoặc DIRECTUS_TOKEN.')
        process.exit(1)
    }

    const meta = JSON.parse(await fs.readFile(path.join(CONTENT_DIR, `${slug}.json`), 'utf8'))
    const content = await fs.readFile(path.join(CONTENT_DIR, meta.content_file), 'utf8')

    const payload = {
        title: meta.title,
        slug: meta.slug,
        excerpt: meta.excerpt,
        content,
        status: meta.status ?? 'publish',
    }
    if (meta.featured_image) payload.featured_image = meta.featured_image

    const headers = {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json',
    }

    const existingRes = await fetch(
        `${DIRECTUS_URL}/items/posts?filter[slug][_eq]=${encodeURIComponent(meta.slug)}&fields=id&limit=1`,
        { headers },
    )
    const existing = (await existingRes.json())?.data?.[0]

    console.log(`slug        : ${meta.slug}`)
    console.log(`title       : ${meta.title}  (${meta.title.length} ký tự)`)
    console.log(`excerpt     : ${meta.excerpt.length} ký tự`)
    console.log(`content     : ${content.length} ký tự HTML`)
    console.log(`featured    : ${meta.featured_image ?? '(chưa có — nên thêm ảnh bìa)'}`)
    console.log(`đã tồn tại  : ${existing ? `có, id=${existing.id} → sẽ PATCH` : 'chưa → sẽ POST'}`)

    if (!live) {
        console.log('\nDry run. Thêm --publish để đăng thật.')
        return
    }

    let postId
    if (existing) {
        payload.date_updated = new Date().toISOString()
        const res = await fetch(`${DIRECTUS_URL}/items/posts/${existing.id}`, {
            method: 'PATCH', headers, body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`PATCH thất bại: ${res.status} ${await res.text()}`)
        postId = existing.id
        console.log(`\nĐã cập nhật post id=${postId}`)
    } else {
        payload.date_created = new Date().toISOString()
        const res = await fetch(`${DIRECTUS_URL}/items/posts`, {
            method: 'POST', headers, body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`POST thất bại: ${res.status} ${await res.text()}`)
        postId = (await res.json())?.data?.id
        console.log(`\nĐã tạo post id=${postId}`)
    }

    if (meta.category_id) {
        const linked = await fetch(
            `${DIRECTUS_URL}/items/posts_categories?filter[posts_id][_eq]=${postId}&filter[categories_id][_eq]=${meta.category_id}&limit=1`,
            { headers },
        )
        const already = (await linked.json())?.data?.length
        if (!already) {
            const res = await fetch(`${DIRECTUS_URL}/items/posts_categories`, {
                method: 'POST', headers,
                body: JSON.stringify({ posts_id: postId, categories_id: meta.category_id }),
            })
            console.log(res.ok ? 'Đã gắn category.' : `Gắn category lỗi: ${res.status}`)
        } else {
            console.log('Category đã gắn sẵn.')
        }
    }

    const url = `https://vansao.com/blog/${meta.slug}`
    console.log(`\nXem tại: ${url}`)

    // Nudge Bing / Cốc Cốc / Yandex to recrawl now rather than on their own
    // schedule. Never fatal: the post is already live either way.
    const ping = await submitToIndexNow([url])
    console.log(ping.ok
        ? `IndexNow: đã gửi (HTTP ${ping.status})`
        : `IndexNow: không gửi được — ${ping.error ?? 'HTTP ' + ping.status}`)
}

main().catch(err => {
    console.error(err.message)
    process.exit(1)
})
