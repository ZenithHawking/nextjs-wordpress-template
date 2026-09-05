// IndexNow — tells Bing, Yandex and Seznam that a URL changed, instead of
// waiting for them to re-crawl on their own schedule. Free, documented, and
// vendor-neutral. Google does not participate, but Cốc Cốc runs on Bing's
// index, which is what makes this worth wiring up for a Vietnamese audience.
//
// The key is public by design: ownership is proved by serving it as plain text
// at /<key>.txt, which is why it lives here as a constant and as a matching
// file in public/. Keeping both in one commit means they cannot drift apart —
// a submission whose key file does not resolve is rejected.
//
// To rotate: generate a new value, rename public/<key>.txt to match, deploy.

import { SITE_URL } from '@/lib/seo'

export const INDEXNOW_KEY = '4a26b328f5a407e35d13345d5cc2eb70'

const ENDPOINT = 'https://api.indexnow.org/indexnow'

/**
 * Submit one or more URLs.
 *
 * Returns a result object instead of throwing: publishing a post must never
 * fail because a search engine ping did.
 *
 * IndexNow accepts up to 10,000 URLs per request.
 */
export async function submitToIndexNow(urls) {
    const list = (Array.isArray(urls) ? urls : [urls]).filter(Boolean)
    if (!list.length) return { ok: false, skipped: true, reason: 'không có URL' }

    try {
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
                host: new URL(SITE_URL).host,
                key: INDEXNOW_KEY,
                keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
                urlList: list,
            }),
        })

        // 200 accepted; 202 accepted while the key file is still being checked.
        return { ok: res.status === 200 || res.status === 202, status: res.status, count: list.length }
    } catch (err) {
        return { ok: false, error: err.message }
    }
}
