import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// ── Next.js navigation ────────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
}));

// ── Next.js Image — render as plain <img> ─────────────────────────────────────
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className, priority: _p, ...rest }: Record<string, unknown>) => {
    const { createElement } = require('react');
    return createElement('img', { src, alt, width, height, className, ...rest });
  },
}));

// ── Next.js Link — render as plain <a> ───────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, className, ...rest }: Record<string, unknown>) => {
    const { createElement } = require('react');
    return createElement('a', { href, onClick, className, ...rest }, children);
  },
}));

// ── Framer Motion — strip all animation props ─────────────────────────────────
vi.mock('framer-motion', async () => {
  const { forwardRef, createElement } = await import('react');

  const strip = (props: Record<string, unknown>) => {
    const {
      initial, animate, exit, transition, variants,
      whileInView, whileHover, whileTap, viewport,
      layoutId, layout,
      ...rest
    } = props;
    return rest;
  };

  const make = (tag: string) =>
    forwardRef((props: Record<string, unknown>, ref: unknown) =>
      createElement(tag as any, { ...strip(props), ref })
    );

  return {
    motion: {
      div: make('div'),
      ul: make('ul'),
      li: make('li'),
      span: make('span'),
      p: make('p'),
      h1: make('h1'),
      h2: make('h2'),
      section: make('section'),
      button: make('button'),
      form: make('form'),
      nav: make('nav'),
    },
    AnimatePresence: ({ children }: { children: unknown }) => children,
    useAnimation: () => ({ start: vi.fn() }),
    useInView: () => true,
  };
});

// ── Sonner toasts ─────────────────────────────────────────────────────────────
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn(),
  },
  Toaster: () => null,
}));

// ── Global resets between tests ───────────────────────────────────────────────
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
