import type { MDXComponents } from 'mdx/types';

import { cn } from '@/lib/utils';

export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="mt-8 text-4xl font-semibold" {...props} />,
  h2: (props) => <h2 className="mt-12 text-3xl font-semibold" {...props} />,
  h3: (props) => <h3 className="mt-8 text-2xl font-semibold" {...props} />,
  p: (props) => <p className="mt-4 leading-relaxed text-muted-foreground" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote className="mt-6 border-l-4 border-primary/40 bg-primary/5 p-4 italic text-muted-foreground" {...props} />
  ),
  a: ({ className, ...props }) => (
    <a className={cn('font-medium text-primary underline-offset-4 hover:underline', className)} {...props} />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        'mt-6 overflow-x-auto rounded-2xl border border-border bg-card p-4 text-sm shadow-md',
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code className={cn('rounded bg-muted/40 px-1.5 py-0.5 text-sm', className)} {...props} />
  ),
  img: ({ className, alt, ...props }) => (
    <span className="mt-8 block overflow-hidden rounded-3xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={alt ?? ''} className={cn('h-auto w-full', className)} loading="lazy" decoding="async" {...props} />
    </span>
  ),
};
