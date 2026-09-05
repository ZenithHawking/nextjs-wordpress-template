#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing, Cốc Cốc, Yandex, Seznam).
 *
 * publish-post.mjs already pings the single post it just wrote. This script is
 * for the bulk cases: seeding the whole archive once, or re-submitting after a
 * batch change such as unpublishing a set of posts.
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs                       # dry run over the sitemap
 *   node scripts/indexnow-ping.mjs --send                # submit every sitemap URL
 *   node scripts/indexnow-ping.mjs <url> [<url>...] --send
 */

import process from 'node:process'

const SITE = 'https://vansao.com'
// Must match src/lib/indexnow.js and public/<key>.txt.
const KEY = '4a26b328f5a407e35d13345d5cc2eb70'

async function sitemapUrls() {
    const res = await fetch(`${SITE}/sitemap.xml`, {
        headers: { 'User-Agent': 'vansao-indexnow/1.0' },
    })
    if (!res.ok) throw new Error(`Không tải được sitemap: HTTP ${res.status}`)
    const xml = await res.text()
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim())
}

async function main() {
    const args = process.argv.slice(2)
    const send = args.includes('--send')
    const explicit = args.filter(a => a.startsWith('http'))

    const urls = explicit.length ? explicit : await sitemapUrls()
    if (!urls.length) {
        console.error('Không có URL nào để gửi.')
        process.exit(1)
    }

    console.log(`Nguồn : ${explicit.length ? 'tham số dòng lệnh' : `${SITE}/sitemap.xml`}`)
    console.log(`Số URL: ${urls.length}`)
    console.log(`Key   : ${SITE}/${KEY}.txt`)

    // The key file has to resolve publicly or the whole batch is rejected.
    const keyRes = await fetch(`${SITE}/${KEY}.txt`, { headers: { 'User-Agent': 'vansao-indexnow/1.0' } })
    const keyBody = keyRes.ok ? (await keyRes.text()).trim() : ''
    const keyOk = keyRes.ok && keyBody === KEY
    console.log(`Key file: ${keyOk ? 'OK' : `LỖI (HTTP ${keyRes.status}, nội dung "${keyBody.slice(0, 40)}")`}`)

    if (!keyOk) {
        console.error('\nDừng: IndexNow từ chối nếu file key không truy cập được. Deploy trước đã.')
        process.exit(1)
    }

    if (!send) {
        console.log('\n' + urls.slice(0, 8).map(u => `  ${u}`).join('\n'))
        if (urls.length > 8) console.log(`  … và ${urls.length - 8} URL nữa`)
        console.log('\nDry run. Thêm --send để gửi thật.')
        return
    }

    const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            host: new URL(SITE).host,
            key: KEY,
            keyLocation: `${SITE}/${KEY}.txt`,
            urlList: urls,
        }),
    })

    const body = await res.text()
    if (res.status === 200 || res.status === 202) {
        console.log(`\nĐã gửi ${urls.length} URL. HTTP ${res.status}${res.status === 202 ? ' (đang xác minh key)' : ''}`)
    } else {
        console.error(`\nLỗi: HTTP ${res.status} ${body.slice(0, 300)}`)
        process.exit(1)
    }
}

main().catch(err => {
    console.error(err.message)
    process.exit(1)
})
