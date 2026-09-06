#!/usr/bin/env node
/**
 * Cut the star mascot sprite sheet into one transparent PNG per character.
 *
 * The sheet is a plain 5x4 grid, so each cell is sliced by arithmetic and then
 * trimmed to its own content box — the figures are not centred identically, and
 * an untrimmed cell leaves each mascot sitting at a different offset, which
 * shows up as drift when they are placed in equal-sized slots.
 *
 * Names describe what the character is doing, not where it sits in the grid, so
 * a layout change never means renaming files.
 *
 * Usage:
 *   node scripts/cut-mascot-sheet.mjs          # report what it would write
 *   node scripts/cut-mascot-sheet.mjs --write
 */

import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')
// Kept outside public/ so the 1.6MB source is not served or shipped in the image.
const SHEET = path.join(ROOT, 'assets/mascot-sprite-sheet.png')
const OUT = path.join(ROOT, 'public/mascot')

const COLS = 5
const ROWS = 4

// Row-major, matching the sheet.
const NAMES = [
    'co-ban',      'nhay-mat',   'an-mung',   'hao-hung',   'yeu-thich',
    'suy-nghi',    'ngac-nhien', 'buon',      'ngu',        'tuc-gian',
    'vay-tay',     'laptop',     'doc-sach',  'tim-kiem',   'tot-nghiep',
    'phu-thuy',    'bao-tri',    'dau-bep',   'sieu-nhan',  'vua',
]

/**
 * Bounding box of the largest connected figure in a cell.
 *
 * Two reasons this is not simply "the box around every opaque pixel":
 *
 * sharp's own .trim() keys off the top-left pixel and never finds this
 * transparent background — it either returns the cell untouched or, where the
 * figure reaches the cell edge, computes an invalid area and throws.
 *
 * And the grid is not clean: the tall hats in the bottom row rise past the row
 * boundary into the cell above, so a plain alpha bounding box swallows a slice
 * of the neighbour. Flood-filling and keeping only the biggest blob drops those
 * fragments, since they are not attached to the figure.
 */
function contentBox(data, width, height, channels, alphaMin = 8) {
    const opaque = new Uint8Array(width * height)
    for (let i = 0; i < width * height; i++) {
        opaque[i] = data[i * channels + 3] >= alphaMin ? 1 : 0
    }

    const seen = new Uint8Array(width * height)
    const queue = new Int32Array(width * height)
    const blobs = []

    for (let start = 0; start < opaque.length; start++) {
        if (!opaque[start] || seen[start]) continue

        // Iterative flood fill; recursion blows the stack at this image size.
        let head = 0, tail = 0
        queue[tail++] = start
        seen[start] = 1

        let count = 0
        let minX = width, minY = height, maxX = -1, maxY = -1

        while (head < tail) {
            const idx = queue[head++]
            const x = idx % width
            const y = (idx - x) / width

            count++
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y

            if (x > 0)          { const n = idx - 1;     if (opaque[n] && !seen[n]) { seen[n] = 1; queue[tail++] = n } }
            if (x < width - 1)  { const n = idx + 1;     if (opaque[n] && !seen[n]) { seen[n] = 1; queue[tail++] = n } }
            if (y > 0)          { const n = idx - width; if (opaque[n] && !seen[n]) { seen[n] = 1; queue[tail++] = n } }
            if (y < height - 1) { const n = idx + width; if (opaque[n] && !seen[n]) { seen[n] = 1; queue[tail++] = n } }
        }

        blobs.push({
            count,
            minX, minY, maxX, maxY,
            touchesEdge: minX === 0 || minY === 0 || maxX === width - 1 || maxY === height - 1,
        })
    }

    if (!blobs.length) return null

    // The figure is the biggest blob. Everything else is either its own
    // decoration — confetti, hearts, Zzz, motion ticks, all of which sit inside
    // the cell — or a slice of a neighbour bleeding in across a cell boundary.
    // Only the second kind runs into an edge, so that is what gets dropped.
    const main = blobs.reduce((a, b) => (b.count > a.count ? b : a))
    const kept = blobs.filter(b => b === main || !b.touchesEdge)

    const minX = Math.min(...kept.map(b => b.minX))
    const minY = Math.min(...kept.map(b => b.minY))
    const maxX = Math.max(...kept.map(b => b.maxX))
    const maxY = Math.max(...kept.map(b => b.maxY))

    return {
        left: minX, top: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        dropped: blobs.length - kept.length,
    }
}

async function main() {
    const write = process.argv.includes('--write')

    const meta = await sharp(SHEET).metadata()
    // Rounded per-index edges, so the fractional cell size does not drop a
    // column of pixels off the right and bottom of the sheet.
    const edge = (i, total, n) => Math.round((i * total) / n)

    console.log(`Sheet : ${meta.width}x${meta.height} (alpha=${meta.hasAlpha})`)
    console.log(`Lưới  : ${COLS}x${ROWS} = ${COLS * ROWS} nhân vật\n`)

    const results = []

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const name = NAMES[row * COLS + col]
            const dest = path.join(OUT, `ngoi-sao-${name}.png`)

            const left = edge(col, meta.width, COLS)
            const top = edge(row, meta.height, ROWS)
            const box = {
                left, top,
                width: edge(col + 1, meta.width, COLS) - left,
                height: edge(row + 1, meta.height, ROWS) - top,
            }

            const { data, info } = await sharp(SHEET)
                .extract(box)
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true })

            const content = contentBox(data, info.width, info.height, info.channels)
            if (!content) {
                console.log(`  ngoi-sao-${name}.png — ô trống, bỏ qua`)
                continue
            }

            const buf = await sharp(SHEET)
                .extract({
                    left: box.left + content.left,
                    top: box.top + content.top,
                    width: content.width,
                    height: content.height,
                })
                .png({ compressionLevel: 9 })
                .toBuffer()

            results.push({
                name, w: content.width, h: content.height,
                kb: Math.round(buf.length / 1024), dropped: content.dropped,
            })
            if (write) await fs.writeFile(dest, buf)
        }
    }

    for (const r of results) {
        const note = r.dropped ? `  (bỏ ${r.dropped} mảnh lấn từ ô bên cạnh)` : ''
        console.log(`  ngoi-sao-${r.name}.png`.padEnd(32) + `${r.w}x${r.h}`.padEnd(10) + `${r.kb}KB` + note)
    }

    const minH = Math.min(...results.map(r => r.h))
    console.log(`\nChiều cao nhỏ nhất: ${minH}px`)

    if (!write) console.log('\nDry run. Thêm --write để ghi file.')
    else console.log(`\nĐã ghi ${results.length} file vào public/mascot/`)
}

main().catch(err => {
    console.error(err.message)
    process.exit(1)
})
