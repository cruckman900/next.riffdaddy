'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'

export type NextLinkComposedProps = Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'href'
> &
    Omit<LinkProps, 'href' | 'as' | 'onClick' | 'onMouseEnter'> & {
        to: LinkProps['href']
    }

const NextLinkComposed = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
    function NextLinkComposed(props, ref) {
        const { to, replace, scroll, shallow, prefetch, children, ...rest } = props

        return (
            <Link
                href={to}
                replace={replace}
                scroll={scroll}
                shallow={shallow}
                prefetch={prefetch}
                {...rest}
                ref={ref}
            >
                {children}
            </Link>
        )
    }
)

export default NextLinkComposed
