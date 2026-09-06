import Mascot, { MASCOTS } from '@/components/Mascot'

/** Shown while a route's server components fetch their data. */
export default function Loading() {
    return (
        <main className="vs-state" aria-busy="true">
            <div className="inner">
                <span className="vs-mascot-loading">
                    <Mascot name={MASCOTS.coBan} size={120} motion="breathe" priority />
                </span>
                <p className="desc" role="status">Đang tải nội dung…</p>
            </div>
        </main>
    )
}
