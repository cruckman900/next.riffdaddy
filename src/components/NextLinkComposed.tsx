/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/NextLinkComposed.tsx
'use client'

import React from 'react'
import Link, { LinkProps } from 'next/link'

type Props = LinkProps & { children?: React.ReactNode; className?: string; style?: React.CSSProperties }

const NextLinkComposed = React.forwardRef<HTMLAnchorElement, Props>(function NextLinkComposed(props, ref) {
    const { href, children, ...rest } = props
    return (
        <Link href={href as string} legacyBehavior={false}>
            <a ref={ref} {...(rest as any)}>
                {children}
            </a>
        </Link>
    )
})

export default NextLinkComposed
