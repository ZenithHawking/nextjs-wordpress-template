'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchInput({ defaultValue = '' }) {
    const [value, setValue] = useState(defaultValue)
    const router = useRouter()
    const timer = useRef(null)

    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue])

    function navigate(q) {
        router.push(q ? `/blog?search=${encodeURIComponent(q)}` : '/blog')
    }

    function handleChange(e) {
        const q = e.target.value
        setValue(q)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => navigate(q.trim()), 400)
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            clearTimeout(timer.current)
            navigate(value.trim())
        }
    }

    function handleClear() {
        setValue('')
        clearTimeout(timer.current)
        navigate('')
    }

    return (
        <div className="relative w-52 shrink-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Tìm bài viết..."
                className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    )
}
