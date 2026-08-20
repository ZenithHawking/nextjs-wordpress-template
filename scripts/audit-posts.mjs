#!/usr/bin/env node
/**
 * Read-only audit of the Directus `posts` collection.
 *
 * Flags the auto-generated filler that dilutes topical authority: articles with
 * no connection to what Vạn Sao sells (website / sự kiện / chuyển dữ liệu) and
 * no local signal. Prints a keep / prune split plus the exact commands to act
 * on it. Writes nothing.
 *
 * Usage: node scripts/audit-posts.mjs
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')

// Terms tying a post to a service Vạn Sao actually sells.
const COMMERCIAL = [
    'thiết kế web', 'thiet ke web', 'website', 'landing page',
    'sự kiện', 'tiệc cưới', 'check-in', 'chuyển dữ liệu', 'chuyển đổi dữ liệu',
    'migration', 'seo', 'tên miền', 'hosting',
]

// Place names — current and pre-merger — that signal local intent.
const LOCAL = [
    'đức hòa', 'mỹ hạnh', 'hậu nghĩa', 'hòa khánh', 'đức lập',
    'tây ninh', 'long an', 'hồ chí minh', 'tphcm', 'tp.hcm',
]

// Generic tech-blog filler with no commercial intent for this business.
const FILLER = [
    'ai tạo sinh', 'ransomware', 'an ninh mạng', 'thuật toán', 'face matching',
    'iot', 'đạo đức', 'dịch thuật', 'blockchain', 'machine learning',
]

async function loadEnv() {
    try {
        const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
        for (const line of raw.split('\n')) {
            const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
            if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
        }
    } catch {
        // optional
    }
}

const hits = (text, list) => list.filter(term => text.includes(term))

function classify(post) {
    const haystack = `${post.title ?? ''} ${post.excerpt ?? ''}`.toLowerCase()
    const commercial = hits(haystack, COMMERCIAL)
    const local = hits(haystack, LOCAL)
    const filler = hits(haystack, FILLER)

    // Local + commercial posts are the money pages; keep unconditionally.
    if (local.length && commercial.length) return { verdict: 'KEEP', why: 'local + dịch vụ' }
    if (local.length) return { verdict: 'KEEP', why: 'có tín hiệu địa phương' }
    if (commercial.length && !filler.length) return { verdict: 'KEEP', why: 'đúng dịch vụ' }
    if (filler.length && !commercial.length) return { verdict: 'PRUNE', why: `filler: ${filler.join(', ')}` }
    if (filler.length && commercial.length) return { verdict: 'REWRITE', why: 'chủ đề lệch, có nhắc dịch vụ' }
    return { verdict: 'REWRITE', why: 'không rõ chủ đề thương mại' }
}

async function main() {
    await loadEnv()
    const { DIRECTUS_URL, DIRECTUS_TOKEN } = process.env
    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
        console.error('Thiếu DIRECTUS_URL hoặc DIRECTUS_TOKEN.')
        process.exit(1)
    }

    const res = await fetch(
        `${DIRECTUS_URL}/items/posts?fields=id,title,slug,excerpt,status,date_created&limit=-1&sort=date_created`,
        { headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` } },
    )
    if (!res.ok) throw new Error(`Directus ${res.status}`)
    const posts = (await res.json())?.data ?? []

    const buckets = { KEEP: [], REWRITE: [], PRUNE: [] }
    for (const post of posts) {
        const { verdict, why } = classify(post)
        buckets[verdict].push({ ...post, why })
    }

    for (const verdict of ['KEEP', 'REWRITE', 'PRUNE']) {
        const rows = buckets[verdict]
        console.log(`\n${verdict}  (${rows.length}/${posts.length})`)
        console.log('─'.repeat(72))
        for (const row of rows) {
            console.log(`  ${String(row.id).padStart(3)}  ${(row.title ?? '').slice(0, 62)}`)
            console.log(`       ${row.slug}`)
            console.log(`       ${row.why}`)
        }
    }

    const pruneIds = buckets.PRUNE.map(p => p.id)
    console.log('\n' + '═'.repeat(72))
    console.log(`Tổng: ${posts.length} bài — giữ ${buckets.KEEP.length}, viết lại ${buckets.REWRITE.length}, dọn ${buckets.PRUNE.length}`)
    if (pruneIds.length) {
        console.log('\nID cần dọn:')
        console.log(`  ${pruneIds.join(',')}`)
        console.log('\nĐể chuyển sang draft (KHÔNG chạy tự động — cân nhắc trước):')
        console.log(`  node scripts/prune-posts.mjs ${pruneIds.join(',')} --apply`)
    }
}

main().catch(err => {
    console.error(err.message)
    process.exit(1)
})
