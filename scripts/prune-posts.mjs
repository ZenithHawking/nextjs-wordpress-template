#!/usr/bin/env node
/**
 * Move low-value posts out of the public index by flipping status to `draft`.
 *
 * Nothing is deleted — `draft` posts drop out of getAllPosts(), the blog list
 * and the sitemap, but the rows stay in Directus and can be flipped back with
 * --restore.
 *
 * Usage:
 *   node scripts/prune-posts.mjs 1,2,3            # dry run: show what would change
 *   node scripts/prune-posts.mjs 1,2,3 --apply    # set status=draft
 *   node scripts/prune-posts.mjs 1,2,3 --restore --apply   # set status=publish
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')

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

async function main() {
    const args = process.argv.slice(2)
    const ids = (args.find(a => /^[\d,]+$/.test(a)) ?? '')
        .split(',').filter(Boolean).map(Number)
    const apply = args.includes('--apply')
    const restore = args.includes('--restore')
    const target = restore ? 'publish' : 'draft'

    if (!ids.length) {
        console.error('Usage: node scripts/prune-posts.mjs <id,id,id> [--apply] [--restore]')
        process.exit(1)
    }

    await loadEnv()
    const { DIRECTUS_URL, DIRECTUS_TOKEN } = process.env
    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
        console.error('Thiếu DIRECTUS_URL hoặc DIRECTUS_TOKEN.')
        process.exit(1)
    }
    const headers = { Authorization: `Bearer ${DIRECTUS_TOKEN}`, 'Content-Type': 'application/json' }

    const res = await fetch(
        `${DIRECTUS_URL}/items/posts?filter[id][_in]=${ids.join(',')}&fields=id,title,slug,status&limit=-1`,
        { headers },
    )
    if (!res.ok) throw new Error(`Directus ${res.status}`)
    const posts = (await res.json())?.data ?? []

    console.log(`Sẽ đổi status → "${target}" cho ${posts.length} bài:\n`)
    for (const p of posts) {
        console.log(`  ${String(p.id).padStart(3)}  [${p.status}]  ${(p.title ?? '').slice(0, 58)}`)
    }

    const missing = ids.filter(id => !posts.some(p => p.id === id))
    if (missing.length) console.log(`\nKhông tìm thấy id: ${missing.join(', ')}`)

    if (!apply) {
        console.log('\nDry run. Thêm --apply để thực hiện.')
        return
    }

    let ok = 0
    for (const p of posts) {
        const r = await fetch(`${DIRECTUS_URL}/items/posts/${p.id}`, {
            method: 'PATCH', headers, body: JSON.stringify({ status: target }),
        })
        if (r.ok) ok++
        else console.error(`  Lỗi id=${p.id}: ${r.status} ${await r.text()}`)
    }

    console.log(`\nXong: ${ok}/${posts.length} bài đã chuyển sang "${target}".`)
    console.log('Sitemap tự cập nhật sau tối đa 1 giờ (revalidate).')
    if (!restore) {
        console.log('Hoàn tác: thêm --restore --apply với cùng danh sách id.')
    }
}

main().catch(err => {
    console.error(err.message)
    process.exit(1)
})
