// src/lib/print/printScore.ts
//
// "Print Score" — pre-paginates the Score Preview's printable "sheet"
// (metadata header + rendered stave/tab rows) using Paged.js before handing
// off to the browser's native print dialog. Real browsers don't implement
// the CSS Paged Media spec (no working @page margin-box counters), so
// plain Ctrl+P can't produce real "Page X of Y" numbers — Paged.js is a
// polyfill that lays the content out into actual page-sized boxes with the
// page numbers already generated as plain text, sidestepping that
// limitation entirely. See public/print.css for the @page rules it reads.
//
// Regular Ctrl+P still works reasonably as a fallback (see the print:hidden
// classes + .score-print-row/@page rules in globals.css) — it just won't
// have real page numbers.
//
// Paged.js is loaded from a vendored copy of its UMD browser build (see
// public/vendor/pagedjs/paged.js) via a plain <script> tag rather than an
// npm import: the package's "main"/"import" export condition resolves to
// its uncompiled src/index.js, which pulls in Node-only deep imports
// (`es5-ext/array/#/remove`) that don't exist in a browser bundle, and its
// package.json "exports" map blocks importing the working prebuilt ESM
// file directly by subpath. A <script> tag sidesteps bundler module
// resolution entirely — this is also how Paged.js's own docs recommend
// using it in a plain web page.

const ROOT_ID = 'print-preview-root'
const PAGEDJS_SRC = '/vendor/pagedjs/paged.js'

interface PagedNamespace {
    Previewer: new () => {
        preview(content: Node, stylesheets: string[], renderTo: Element): Promise<unknown>
    }
}

declare global {
    interface Window {
        Paged?: PagedNamespace
    }
}

let pagedLoadPromise: Promise<PagedNamespace> | null = null

function loadPagedJs(): Promise<PagedNamespace> {
    if (window.Paged) return Promise.resolve(window.Paged)
    if (pagedLoadPromise) return pagedLoadPromise

    pagedLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = PAGEDJS_SRC
        script.onload = () => {
            if (window.Paged) resolve(window.Paged)
            else reject(new Error('Paged.js loaded but window.Paged is missing'))
        }
        script.onerror = () => reject(new Error('Failed to load Paged.js'))
        document.head.appendChild(script)
    })
    // Don't cache a failed load — let the next print attempt retry the
    // script fetch instead of rejecting forever.
    pagedLoadPromise.catch(() => { pagedLoadPromise = null })
    return pagedLoadPromise
}

function buildButton(label: string, primary: boolean): HTMLButtonElement {
    const btn = document.createElement('button')
    btn.textContent = label
    btn.type = 'button'
    Object.assign(btn.style, {
        padding: '6px 18px',
        borderRadius: '999px',
        border: primary ? 'none' : '1px solid #888',
        background: primary ? '#00c2ff' : 'transparent',
        color: primary ? '#00131a' : '#fff',
        cursor: 'pointer',
        fontWeight: '600',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '14px',
    })
    return btn
}

export async function printScore(sheetElement: HTMLElement) {
    // Guard against opening a second preview if one is already up.
    if (document.getElementById(ROOT_ID)) return

    document.body.classList.add('print-preview-active')

    const root = document.createElement('div')
    root.id = ROOT_ID
    root.setAttribute('data-print-preview-root', 'true')

    const toolbar = document.createElement('div')
    toolbar.className = 'print:hidden'
    Object.assign(toolbar.style, {
        position: 'sticky',
        top: '0',
        zIndex: '1',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        background: '#1f1f1f',
        color: '#fff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '14px',
    })

    const status = document.createElement('span')
    status.textContent = 'Preparing print preview…'

    const printBtn = buildButton('Print', true)
    printBtn.disabled = true
    const closeBtn = buildButton('Close', false)

    toolbar.append(status, printBtn, closeBtn)

    const pagesContainer = document.createElement('div')

    root.append(toolbar, pagesContainer)
    document.body.appendChild(root)

    // Paged.js sets up a ResizeObserver per rendered page; if we just yank
    // the DOM out from under it, a late resize callback can still fire and
    // throw (reading properties off nodes that no longer exist). Destroying
    // the chunker first lets it disconnect those observers cleanly — this
    // still doesn't catch every in-flight async callback (an occasional
    // harmless console error can slip through), but it's the documented
    // teardown path and avoids leaking observers on repeated Print use.
    let chunkerRef: { destroy?: () => void } | undefined
    const cleanup = () => {
        document.removeEventListener('keydown', onKeyDown)
        try {
            chunkerRef?.destroy?.()
        } catch {
            // Best-effort — the preview is being torn down regardless.
        }
        root.remove()
        document.body.classList.remove('print-preview-active')
    }
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') cleanup()
    }
    document.addEventListener('keydown', onKeyDown)
    closeBtn.addEventListener('click', cleanup)
    printBtn.addEventListener('click', () => window.print())

    try {
        const { Previewer } = await loadPagedJs()
        const previewer = new Previewer()
        chunkerRef = (previewer as unknown as { chunker?: { destroy?: () => void } }).chunker

        // Build a FLAT container — just the header (if any) and each stave/
        // tab row as direct siblings — instead of cloning the sheet's actual
        // nested DOM (Box > renderer's own wrapper Box > row divs). Paged.js
        // has to recursively decide how to split every ancestor container
        // around content that doesn't fit a page, and with two extra levels
        // of wrapper <div>s in the way it was mis-measuring how much of the
        // first page was actually free, dropping every row onto page 2+ and
        // leaving page 1 with only the header. Flat siblings sidestep that
        // container-splitting logic entirely — Paged.js just flows each one
        // into whatever page has room.
        const printRoot = document.createElement('div')
        const headerSrc = sheetElement.querySelector('[data-print-header]')
        if (headerSrc) printRoot.appendChild(headerSrc.cloneNode(true))
        sheetElement.querySelectorAll('.score-print-row').forEach((row) => {
            printRoot.appendChild(row.cloneNode(true))
        })

        // Each stave/tab row is a VexFlow SVG sized in pixels to whatever
        // the on-screen Score Preview panel happened to be — often much
        // wider than a physical page's printable area. Resize every row to
        // an explicit pixel width/height up front (rather than a CSS
        // percentage) matching print.css's page content box (Letter, 12mm
        // margins) — Paged.js measures each row exactly once during its
        // initial layout pass, and a size that only resolves after a later
        // layout/reflow (as a `width: 100%` would) was tripping up its
        // internal "did this element's size change?" resize-recovery path,
        // intermittently dropping whole rows off the page entirely.
        const PAGE_CONTENT_WIDTH_PX = 700
        printRoot.querySelectorAll('svg').forEach((svg) => {
            const originalWidth = Number(svg.getAttribute('width')) || svg.getBoundingClientRect().width
            const originalHeight = Number(svg.getAttribute('height')) || svg.getBoundingClientRect().height
            if (!originalWidth || !originalHeight) return
            const scale = PAGE_CONTENT_WIDTH_PX / originalWidth
            const scaledHeight = Math.round(originalHeight * scale)
            svg.setAttribute('width', String(PAGE_CONTENT_WIDTH_PX))
            svg.setAttribute('height', String(scaledHeight))
            svg.style.width = `${PAGE_CONTENT_WIDTH_PX}px`
            svg.style.height = `${scaledHeight}px`
            svg.style.display = 'block'
        })

        await previewer.preview(printRoot, ['/print.css'], pagesContainer)
        status.textContent = 'Ready — review the pages below, then Print.'
        printBtn.disabled = false
    } catch (err) {
        status.textContent = 'Could not prepare the print preview.'
        console.error('printScore: Paged.js preview failed', err)
    }
}
