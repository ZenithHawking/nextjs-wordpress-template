#!/usr/bin/env node
/**
 * Give the Directus admin a usable form for writing posts by hand.
 *
 * The collections were created through the API without field metadata, so every
 * field falls back to a bare text box: `content` is a raw-HTML textarea, `status`
 * is a free-text field where a typo silently unpublishes a post, and categories
 * do not appear on the form at all.
 *
 * This writes interface metadata only. It does not touch a single row of post
 * content. The one schema change is an additive `featured_file` column (nullable
 * UUID pointing at directus_files) so the image can be uploaded from the form
 * instead of pasted as a path; the existing `featured_image` string column is
 * left exactly as it is and stays the fallback.
 *
 * Usage:
 *   node scripts/setup-directus-ui.mjs            # dry run, prints every change
 *   node scripts/setup-directus-ui.mjs --apply    # write to Directus
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')
const apply = process.argv.includes('--apply')

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

let BASE, HEADERS

async function api(method, endpoint, body) {
    const res = await fetch(`${BASE}${endpoint}`, {
        method,
        headers: HEADERS,
        body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    let json = null
    try { json = text ? JSON.parse(text) : null } catch { /* non-JSON error body */ }
    if (!res.ok) {
        const msg = json?.errors?.[0]?.message ?? text.slice(0, 200)
        throw new Error(`${method} ${endpoint} → ${res.status}: ${msg}`)
    }
    return json
}

// ── Field metadata ────────────────────────────────────────────────────────

const POST_FIELDS = [
    {
        field: 'title',
        meta: {
            interface: 'input', required: true, sort: 1, width: 'full',
            options: { placeholder: 'Thiết Kế Website Đức Hòa – Bảng Giá 2026, Bàn Giao 5–10 Ngày', trim: true },
            note: 'Tiêu đề hiện trên Google. **Tối đa 60 ký tự**, từ khóa chính đặt gần đầu.',
        },
    },
    {
        field: 'slug',
        meta: {
            // Not `required`: field-level validation runs before the filter hook,
            // so a required slug rejects the save before the flow that fills it
            // ever gets to see the payload. See setup-directus-slug-flow.mjs.
            interface: 'input', required: false, sort: 2, width: 'half',
            options: { slug: true, trim: true, placeholder: 'để trống — tự sinh từ Title' },
            note: 'Đường dẫn bài: vansao.com/blog/**slug**. **Để trống thì tự sinh từ Title.** Muốn tự đặt thì gõ vào, ô này tự bỏ dấu. ⚠️ Đăng rồi thì **không đổi** — đổi là mất sạch thứ hạng.',
        },
    },
    {
        field: 'status',
        meta: {
            interface: 'select-dropdown', required: true, sort: 3, width: 'half',
            options: {
                choices: [
                    { text: 'Nháp — chưa hiện trên web', value: 'draft' },
                    { text: 'Đăng — hiện công khai', value: 'publish' },
                ],
            },
            display: 'labels',
            display_options: {
                choices: [
                    { text: 'Nháp', value: 'draft', foreground: '#FFFFFF', background: '#A2B5CD' },
                    { text: 'Đăng', value: 'publish', foreground: '#FFFFFF', background: '#2ECDA7' },
                ],
            },
            note: 'Chỉ bài **Đăng** mới lên website và vào sitemap.',
        },
    },
    {
        field: 'excerpt',
        meta: {
            interface: 'input-multiline', required: true, sort: 4, width: 'full',
            options: { placeholder: 'Thiết kế website tại Đức Hòa (nay là xã Mỹ Hạnh, tỉnh Tây Ninh): bảng giá từ 1 triệu, bàn giao 5–10 ngày, chuẩn SEO từ nền tảng.', trim: true },
            note: 'Đây là **mô tả hiện dưới tiêu đề trên Google**, không phải ghi chú nội bộ. Viết **140–158 ký tự**, một câu hoàn chỉnh, có từ khóa chính, đừng chép lại câu đầu bài.',
        },
    },
    {
        field: 'content',
        meta: {
            interface: 'input-rich-text-html', required: true, sort: 5, width: 'full',
            options: {
                toolbar: [
                    'undo', 'redo', 'bold', 'italic', 'removeformat',
                    'h2', 'h3', 'blockquote',
                    'bullist', 'numlist', 'table',
                    'link', 'image', 'code', 'fullscreen',
                ],
            },
            note: 'Nội dung bài. **Bắt đầu từ Heading 2** — website tự lấy tiêu đề bài làm H1, viết thêm H1 là trang có hai H1. Bắt buộc có mục H2 “Câu hỏi thường gặp” với các H3 câu hỏi để lấy rich result trên Google.',
        },
    },
    {
        field: 'featured_file',
        meta: {
            interface: 'file-image', sort: 6, width: 'half',
            note: 'Ảnh bìa — bấm để tải ảnh lên. Nén dưới 200 KB, tỉ lệ ngang ~1200×630. Ưu tiên ảnh tự chụp thay vì ảnh stock.',
        },
    },
    {
        field: 'featured_image',
        meta: {
            interface: 'input', sort: 7, width: 'half',
            options: { placeholder: '/assets/<uuid>' },
            note: 'Ảnh bìa kiểu cũ (đường dẫn dạng chữ). Bài mới nên dùng ô **Ảnh bìa** bên trái. Để trống nếu đã chọn ảnh ở đó.',
        },
    },
    {
        field: 'categories',
        meta: {
            interface: 'list-m2m', special: ['m2m'], sort: 8, width: 'full',
            options: { template: '{{categories_id.name}}' },
            note: 'Chọn chuyên mục. Bài dịch vụ chọn **Dịch vụ khách hàng**.',
        },
    },
    // Auto-increment primary key — nothing to fill in, so keep it off the form.
    {
        field: 'id',
        meta: { hidden: true, readonly: true, interface: 'input' },
    },
    // Both timestamps are filled by Directus. `date-updated` also keeps the
    // sitemap's lastmod and the article's dateModified honest whenever a post
    // is edited.
    {
        field: 'date_created',
        meta: {
            interface: 'datetime', special: ['date-created'], readonly: true,
            sort: 9, width: 'half', note: 'Tự điền khi tạo bài.',
        },
    },
    {
        field: 'date_updated',
        meta: {
            interface: 'datetime', special: ['date-updated'], readonly: true,
            sort: 10, width: 'half', note: 'Tự cập nhật mỗi lần lưu. Google dùng mốc này.',
        },
    },
]

const CATEGORY_FIELDS = [
    { field: 'name', meta: { interface: 'input', required: true, sort: 1, width: 'half' } },
    { field: 'slug', meta: { interface: 'input', required: true, sort: 2, width: 'half', options: { slug: true } } },
]

async function main() {
    await loadEnv()
    const { DIRECTUS_URL, DIRECTUS_TOKEN } = process.env
    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
        console.error('Thiếu DIRECTUS_URL hoặc DIRECTUS_TOKEN.')
        process.exit(1)
    }
    BASE = DIRECTUS_URL
    HEADERS = { Authorization: `Bearer ${DIRECTUS_TOKEN}`, 'Content-Type': 'application/json' }

    const plan = []
    const run = async (label, fn) => {
        plan.push(label)
        if (!apply) return
        try {
            await fn()
            console.log(`  ✓ ${label}`)
        } catch (err) {
            console.error(`  ✗ ${label}\n      ${err.message}`)
        }
    }

    const existing = Object.fromEntries(
        (await api('GET', '/fields/posts')).data.map(f => [f.field, f]),
    )

    // 1. featured_file — the only schema change, additive and nullable.
    if (!existing.featured_file) {
        await run('tạo cột featured_file (uuid, nullable) + quan hệ tới directus_files', async () => {
            await api('POST', '/fields/posts', {
                field: 'featured_file',
                type: 'uuid',
                schema: { is_nullable: true },
                meta: POST_FIELDS.find(f => f.field === 'featured_file').meta,
            })
            await api('POST', '/relations', {
                collection: 'posts',
                field: 'featured_file',
                related_collection: 'directus_files',
                meta: { sort_field: null },
                schema: { on_delete: 'SET NULL' },
            })
        })
    } else {
        plan.push('featured_file đã có — bỏ qua')
    }

    // 2. categories — alias field, no database column is created.
    if (!existing.categories) {
        await run('tạo trường categories (alias m2m) trên posts', () =>
            api('POST', '/fields/posts', {
                field: 'categories',
                type: 'alias',
                meta: POST_FIELDS.find(f => f.field === 'categories').meta,
            }),
        )
    } else {
        plan.push('trường categories đã có — bỏ qua')
    }

    // 3. Point the existing junction relations at that alias so the admin
    //    renders a real many-to-many picker.
    //
    //    The junction came from raw foreign keys, so Directus knows the relations
    //    from schema introspection but has no directus_relations row for them.
    //    POST is refused ("already has an associated relationship") and a bare
    //    PATCH inserts a row with a null many_collection. Spelling out
    //    many_collection / many_field / one_collection makes that insert valid.
    await run('nối quan hệ M2M: posts_categories.posts_id ↔ posts.categories', () =>
        api('PATCH', '/relations/posts_categories/posts_id', {
            collection: 'posts_categories', field: 'posts_id', related_collection: 'posts',
            meta: {
                many_collection: 'posts_categories', many_field: 'posts_id',
                one_collection: 'posts', one_field: 'categories',
                junction_field: 'categories_id',
            },
        }),
    )
    await run('nối quan hệ M2M: posts_categories.categories_id → categories', () =>
        api('PATCH', '/relations/posts_categories/categories_id', {
            collection: 'posts_categories', field: 'categories_id', related_collection: 'categories',
            meta: {
                many_collection: 'posts_categories', many_field: 'categories_id',
                one_collection: 'categories', one_field: null,
                junction_field: 'posts_id',
            },
        }),
    )

    // 3b. Let the slug column accept null on the way in.
    //
    //     Directus checks NOT NULL before it runs the items.create filter hook,
    //     so a non-nullable slug is rejected before the flow that generates it
    //     ever sees the payload. The column stays UNIQUE, and `title` is still
    //     NOT NULL, so the flow always has something to derive a slug from.
    const slugField = await api('GET', '/fields/posts/slug')
    if (slugField.data.schema?.is_nullable === false) {
        await run('cho phép posts.slug null (flow sẽ điền trước khi ghi)', () =>
            api('PATCH', '/fields/posts/slug', { schema: { is_nullable: true } }),
        )
    } else {
        plan.push('posts.slug đã nullable — bỏ qua')
    }

    // 4. Interface metadata for every remaining field.
    for (const { field, meta } of POST_FIELDS) {
        if (field === 'categories' || field === 'featured_file') continue
        await run(`posts.${field} → ${meta.interface}`, () =>
            api('PATCH', `/fields/posts/${field}`, { meta }),
        )
    }
    for (const { field, meta } of CATEGORY_FIELDS) {
        await run(`categories.${field} → ${meta.interface}`, () =>
            api('PATCH', `/fields/categories/${field}`, { meta }),
        )
    }

    // 5. Collection display: show titles in the list, newest first.
    await run('posts: hiển thị tiêu đề trong danh sách, sắp xếp mới nhất trước', () =>
        api('PATCH', '/collections/posts', {
            meta: {
                display_template: '{{title}}',
                sort_field: 'date_created',
                icon: 'article',
                note: 'Bài viết blog trên vansao.com',
            },
        }),
    )
    await run('categories: hiển thị tên trong danh sách', () =>
        api('PATCH', '/collections/categories', {
            meta: { display_template: '{{name}}', icon: 'sell' },
        }),
    )
    await run('posts_categories: ẩn khỏi thanh điều hướng (bảng nối, không sửa tay)', () =>
        api('PATCH', '/collections/posts_categories', { meta: { hidden: true, icon: 'link' } }),
    )

    if (!apply) {
        console.log('Sẽ thực hiện:\n')
        for (const line of plan) console.log(`  · ${line}`)
        console.log('\nDry run. Thêm --apply để ghi vào Directus.')
    } else {
        console.log(`\nXong. Mở ${BASE}/admin/content/posts để kiểm tra.`)
    }
}

main().catch(err => {
    console.error(err.message)
    process.exit(1)
})
