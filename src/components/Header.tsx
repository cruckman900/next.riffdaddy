"use client"

import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-black text-white px-6 py-3 flex items-center justify-between shadow-md print:hidden">
            <Link href="/" className="flex items-center gap-3">
                <Image
                    src="/NEXTRiff_Badge.png"
                    alt="NEXTRiff Logo"
                    width={40}
                    height={40}
                    className="drop-shadow-[0_0_8px_#00ff80]"
                />
            </Link>
            <span className="nextriff-title print:hidden">NEXTRiff</span>
            <span className="powered-by print:hidden">Powered By <span className="linear-descent">LinearDescent</span></span>
        </header>
    )
}
