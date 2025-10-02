import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="w-full bg-black text-white px-r py-3 flex items-center justify-between shadow-md">
            <Link href="/" className="flex items-center gap-3">
                <Image
                    src="/NEXTRiff_Badge.png"
                    alt="NEXTRiff Logo"
                    width={40}
                    height={40}
                    className="drop-shadow-[0_0_8px_#00ff80]"
                />
            </Link>
            <span className="text-lg font-bold tracking-wide">fanTABulous</span>
        </header>
    )
}
