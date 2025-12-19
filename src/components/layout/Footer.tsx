'use client'

import YearClient from "../helpers/YearClient"

export default function Footer() {
    return (
        <footer className="sticky bottom-0 z-40 w-full bg-black text-white text-center py-4 mt-auto print:hidden">
            {/* <div className="absolute left-4 bottom-4 text-xs font-mono text-white opacity-80">
                <span className="powered-by">Powered By <span className="linear-descent">LinearDescent</span></span>
            </div> */}
            <div className="footer-core text-[#b366ff] font-bold tracking-wide drop-shadow-[0_0_8px_#b366ff]">
                &copy; <YearClient /> NEXTRiff · riff-ready tab parsing for expressive musicians
            </div>
        </footer>
    )
}
