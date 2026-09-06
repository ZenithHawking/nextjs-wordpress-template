import Image from 'next/image'

/**
 * The Vạn Sao star mascot.
 *
 * Cut from assets/mascot-sprite-sheet.png by scripts/cut-mascot-sheet.mjs, so
 * every file is the figure trimmed to its own content box — sizing here is by
 * height, and the width follows the artwork rather than a fixed box.
 *
 * `motion` picks an idle animation; every mascot also reacts on hover when it
 * sits inside an element carrying `.mascot-host`. All of it is disabled under
 * prefers-reduced-motion.
 */

export const MASCOTS = {
    coBan: 'co-ban',
    nhayMat: 'nhay-mat',
    anMung: 'an-mung',
    haoHung: 'hao-hung',
    yeuThich: 'yeu-thich',
    ngacNhien: 'ngac-nhien',
    buon: 'buon',
    ngu: 'ngu',
    vayTay: 'vay-tay',
    timKiem: 'tim-kiem',
    totNghiep: 'tot-nghiep',
    phuThuy: 'phu-thuy',
    baoTri: 'bao-tri',
    sieuNhan: 'sieu-nhan',
    vua: 'vua',
}

export default function Mascot({
    name,
    alt = '',
    size = 160,
    motion = 'float',
    priority = false,
    className = '',
}) {
    return (
        <span
            className={`vs-mascot vs-mascot-${motion} ${className}`}
            style={{ '--mascot-size': `${size}px` }}
        >
            <Image
                src={`/mascot/ngoi-sao-${name}.png`}
                alt={alt}
                width={size}
                height={size}
                priority={priority}
                // Decorative unless the caller gives it a label.
                aria-hidden={alt ? undefined : true}
                draggable={false}
            />
        </span>
    )
}
