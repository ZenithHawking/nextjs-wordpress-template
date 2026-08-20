#!/usr/bin/env node
/**
 * Create the Directus Flow that fills an empty `slug` from `title`.
 *
 * Directus 11 has no built-in "derive this field from that one", so this runs
 * as a blocking filter hook on posts.create / posts.update: the script gets the
 * incoming payload, and whatever it returns is what gets written.
 *
 * Because it sits in the write path, the script never throws — every branch
 * returns the payload, so a surprise in the data can slow nothing down and
 * block nothing. A slug that is already filled in is left exactly as typed,
 * which keeps publish-post.mjs and the autopost script unaffected.
 *
 * Usage:
 *   node scripts/setup-directus-slug-flow.mjs              # dry run
 *   node scripts/setup-directus-slug-flow.mjs --apply      # create it
 *   node scripts/setup-directus-slug-flow.mjs --test       # create a throwaway
 *                                                            draft, check the
 *                                                            slug, delete it
 *   node scripts/setup-directus-slug-flow.mjs --remove --apply
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')
const args = process.argv.slice(2)
const apply = args.includes('--apply')
const remove = args.includes('--remove')
const test = args.includes('--test')

const FLOW_NAME = 'Tự sinh slug từ title'

// `return: '$last'` is the Response Body setting. Without it a filter flow runs,
// resolves, and its result is thrown away — the original payload is written
// unchanged. That failure is silent: the flow log still reads "resolve".
const TRIGGER_OPTIONS = {
    type: 'filter',
    scope: ['items.create', 'items.update'],
    collections: ['posts'],
    return: '$last',
}

// Runs inside the Directus sandbox. Keep it dependency-free and total.
//
// Diacritics are folded with an explicit table instead of String.normalize('NFD')
// so the result does not depend on what the sandbox exposes.
const SCRIPT = `var FOLD = {
    a: 'àáạảãâầấậẩẫăằắặẳẵ',
    e: 'èéẹẻẽêềếệểễ',
    i: 'ìíịỉĩ',
    o: 'òóọỏõôồốộổỗơờớợởỡ',
    u: 'ùúụủũưừứựửữ',
    y: 'ỳýỵỷỹ',
    d: 'đ'
};

function slugify(input) {
    var s = String(input).toLowerCase();
    for (var plain in FOLD) {
        var accented = FOLD[plain];
        for (var i = 0; i < accented.length; i++) {
            s = s.split(accented.charAt(i)).join(plain);
        }
    }
    s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    if (s.length > 80) s = s.slice(0, 80).replace(/-+$/, '');
    return s;
}

module.exports = async function (data) {
    var payload = (data && data.$trigger && data.$trigger.payload) || {};
    try {
        var current = typeof payload.slug === 'string' ? payload.slug.trim() : '';
        if (current) return payload;

        var title = typeof payload.title === 'string' ? payload.title.trim() : '';
        if (!title) return payload;

        var slug = slugify(title);
        if (!slug) return payload;

        var next = Object.assign({}, payload);
        next.slug = slug;
        return next;
    } catch (err) {
        return payload;
    }
};`

async function loadEnv() {
    try {
        const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
        for (const line of raw.split('\n')) {
            const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
            if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
        }
    } catch { /* optional */ }
}

let BASE, HEADERS

async function api(method, endpoint, body) {
    const res = await fetch(`${BASE}${endpoint}`, {
        method, headers: HEADERS, body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    let json = null
    try { json = text ? JSON.parse(text) : null } catch { /* non-JSON */ }
    if (!res.ok) throw new Error(`${method} ${endpoint} → ${res.status}: ${json?.errors?.[0]?.message ?? text.slice(0, 200)}`)
    return json
}

async function findFlow() {
    const r = await api('GET', `/flows?fields=id,name,status&filter[name][_eq]=${encodeURIComponent(FLOW_NAME)}&limit=1`)
    return r?.data?.[0] ?? null
}

async function runTest() {
    console.log('\nTest: tạo bài nháp không điền slug…')
    const title = `ZZ Test Tự Sinh Slug Đức Hòa ${Date.now()}`
    const created = await api('POST', '/items/posts', {
        title, content: '<p>test</p>', excerpt: 'test', status: 'draft',
    })
    const id = created?.data?.id
    const got = created?.data?.slug
    console.log(`  title : ${title}`)
    console.log(`  slug  : ${got ?? '(trống)'}`)

    const ok = typeof got === 'string' && got.startsWith('zz-test-tu-sinh-slug-duc-hoa-')
    console.log(ok ? '  ✓ Flow hoạt động' : '  ✗ Flow KHÔNG sinh slug')

    if (id) {
        await api('DELETE', `/items/posts/${id}`)
        console.log(`  đã xóa bài test (id=${id})`)
    }
    return ok
}

async function main() {
    await loadEnv()
    const { DIRECTUS_URL, DIRECTUS_TOKEN } = process.env
    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
        console.error('Thiếu DIRECTUS_URL hoặc DIRECTUS_TOKEN.')
        process.exit(1)
    }
    BASE = DIRECTUS_URL
    HEADERS = { Authorization: `Bearer ${DIRECTUS_TOKEN}`, 'Content-Type': 'application/json' }

    const existing = await findFlow()

    if (remove) {
        if (!existing) { console.log('Không có Flow nào để xóa.'); return }
        console.log(`Sẽ xóa Flow "${FLOW_NAME}" (id=${existing.id})`)
        if (!apply) { console.log('\nDry run. Thêm --apply để xóa.'); return }
        await api('DELETE', `/flows/${existing.id}`)
        console.log('Đã xóa.')
        return
    }

    if (test) {
        if (!existing) { console.log('Chưa có Flow. Chạy --apply trước.'); process.exit(1) }
        process.exit((await runTest()) ? 0 : 1)
    }

    if (existing) {
        // Re-running should push the current script, not bail out.
        const ops = await api('GET', `/operations?filter[flow][_eq]=${existing.id}&fields=id,key&limit=1`)
        const op = ops?.data?.[0]
        if (!op) {
            console.error(`Flow "${FLOW_NAME}" tồn tại nhưng không có operation. Xóa rồi tạo lại:`)
            console.error('  node scripts/setup-directus-slug-flow.mjs --remove --apply')
            process.exit(1)
        }
        console.log(`Flow đã tồn tại (id=${existing.id}). Sẽ cập nhật script của operation ${op.id}.`)
        if (!apply) { console.log('\nDry run. Thêm --apply để cập nhật.'); return }

        await api('PATCH', `/operations/${op.id}`, { options: { code: SCRIPT } })
        console.log('  ✓ Đã cập nhật script')
        await api('PATCH', `/flows/${existing.id}`, { options: TRIGGER_OPTIONS })
        console.log('  ✓ Đã cập nhật trigger (return: $last)')
        process.exit((await runTest()) ? 0 : 1)
    }

    console.log('Sẽ tạo:')
    console.log(`  · Flow "${FLOW_NAME}" — hook chặn trên posts.create + posts.update`)
    console.log('  · Operation "Sinh slug" (exec) — bỏ qua nếu slug đã có giá trị')
    if (!apply) { console.log('\nDry run. Thêm --apply để tạo.'); return }

    const flow = await api('POST', '/flows', {
        name: FLOW_NAME,
        icon: 'link',
        color: '#7A5BE9',
        description: 'Ô Slug để trống thì sinh từ Title. Slug đã điền thì giữ nguyên.',
        status: 'active',
        accountability: 'all',
        trigger: 'event',
        options: TRIGGER_OPTIONS,
    })
    const flowId = flow.data.id
    console.log(`  ✓ Flow id=${flowId}`)

    const op = await api('POST', '/operations', {
        flow: flowId,
        name: 'Sinh slug',
        key: 'sinh_slug',
        type: 'exec',
        position_x: 19,
        position_y: 1,
        options: { code: SCRIPT },
    })
    console.log(`  ✓ Operation id=${op.data.id}`)

    await api('PATCH', `/flows/${flowId}`, { operation: op.data.id })
    console.log('  ✓ Đã nối operation vào flow')

    const ok = await runTest()
    if (!ok) {
        console.log('\nFlow không chạy đúng. Gỡ bằng:')
        console.log('  node scripts/setup-directus-slug-flow.mjs --remove --apply')
        process.exit(1)
    }
}

main().catch(err => {
    console.error(err.message)
    process.exit(1)
})
