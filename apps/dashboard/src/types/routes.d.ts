// Disable strict typed routes from Next.js 14
declare module 'next/link' {
  import { LinkProps as OriginalLinkProps } from 'next/dist/client/link';
  import { AnchorHTMLAttributes, ReactNode } from 'react';

  export interface LinkProps
    extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof OriginalLinkProps>,
      Omit<OriginalLinkProps, 'href'> {
    href: string;
    children?: ReactNode;
  }

  export default function Link(props: LinkProps): JSX.Element;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    refresh: () => void;
    back: () => void;
    forward: () => void;
    prefetch: (href: string) => void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams<T extends Record<string, string>>(): T;
  export function redirect(url: string): never;
  export function notFound(): never;
}
