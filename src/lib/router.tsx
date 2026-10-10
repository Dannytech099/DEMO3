import { useSyncExternalStore, type AnchorHTMLAttributes, type ReactNode } from 'react'

/**
 * Tiny hash router. Hash URLs (#/shop) work on any static host with no
 * rewrite rules, which keeps demo deployments to Vercel/Netlify trivial.
 */
function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getSnapshot = () => window.location.hash.slice(1) || '/'

export function useLocation() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => '/')
  const [path, qs = ''] = raw.split('?')
  return { path: path || '/', params: new URLSearchParams(qs), raw }
}

export function navigate(to: string, opts?: { replace?: boolean }) {
  if (opts?.replace) {
    history.replaceState(null, '', '#' + to)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    window.location.hash = to
  }
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
  children: ReactNode
}

export function Link({ to, children, ...rest }: LinkProps) {
  return (
    <a href={'#' + to} {...rest}>
      {children}
    </a>
  )
}
