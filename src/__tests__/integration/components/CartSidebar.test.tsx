import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CART, EMPTY_CART } from '../../fixtures';

// ── Mock dependencies before importing the component ─────────────────────────

vi.mock('@/features/cart/hooks/useCart', () => ({
  useCart: vi.fn(),
  useUpdateCartItem: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useRemoveCartItem: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock('@/stores/ui.store', () => ({
  useUIStore: vi.fn(() => ({
    cartOpen: true,
    setCartOpen: vi.fn(),
  })),
}));

// Simplify Drawer to just render children when open
vi.mock('@/components/layout/Drawer', () => ({
  Drawer: ({ children, open, footer, title }: any) =>
    open ? (
      <div data-testid="drawer">
        <div data-testid="drawer-title">{title}</div>
        <div data-testid="drawer-content">{children}</div>
        {footer && <div data-testid="drawer-footer">{footer}</div>}
      </div>
    ) : null,
}));

import * as cartHooks from '@/features/cart/hooks/useCart';
import * as uiStore from '@/stores/ui.store';
import { CartSidebar } from '@/components/layout/CartSidebar';

const mockUseCart          = vi.mocked(cartHooks.useCart);
const mockUseUpdateItem    = vi.mocked(cartHooks.useUpdateCartItem);
const mockUseRemoveItem    = vi.mocked(cartHooks.useRemoveCartItem);
const mockUseUIStore       = vi.mocked(uiStore.useUIStore);

beforeEach(() => {
  vi.clearAllMocks();
  // Default: sidebar is open
  mockUseUIStore.mockReturnValue({ cartOpen: true, setCartOpen: vi.fn() } as any);
  mockUseUpdateItem.mockReturnValue({ mutate: vi.fn(), isPending: false } as any);
  mockUseRemoveItem.mockReturnValue({ mutate: vi.fn(), isPending: false } as any);
});

// ── Loading state ─────────────────────────────────────────────────────────────

describe('CartSidebar — loading state', () => {
  it('shows skeleton pulse blocks while cart is loading', () => {
    mockUseCart.mockReturnValue({ data: undefined, isLoading: true } as any);

    render(<CartSidebar />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

// ── Empty state ───────────────────────────────────────────────────────────────

describe('CartSidebar — empty cart', () => {
  it('shows "Your cart is empty" when cart has no items', () => {
    mockUseCart.mockReturnValue({ data: EMPTY_CART, isLoading: false } as any);

    render(<CartSidebar />);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Shop Now/ })).toBeInTheDocument();
  });

  it('does not render the checkout footer when cart is empty', () => {
    mockUseCart.mockReturnValue({ data: EMPTY_CART, isLoading: false } as any);

    render(<CartSidebar />);

    expect(screen.queryByRole('link', { name: /Checkout/i })).not.toBeInTheDocument();
  });
});

// ── Cart with items ───────────────────────────────────────────────────────────

describe('CartSidebar — with items', () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue({ data: CART, isLoading: false } as any);
  });

  it('renders the line item title', () => {
    render(<CartSidebar />);
    expect(screen.getByText('Nitrile Examination Gloves')).toBeInTheDocument();
  });

  it('renders the item quantity', () => {
    render(<CartSidebar />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders the subtotal in the footer', () => {
    render(<CartSidebar />);
    // subtotal is 9000 — formatPrice(9000) should appear
    const footer = screen.getByTestId('drawer-footer');
    expect(footer.textContent).toContain('9,000');
  });

  it('renders the checkout link in the footer', () => {
    render(<CartSidebar />);
    expect(screen.getByRole('link', { name: /Proceed to Checkout/i })).toBeInTheDocument();
  });

  it('calls updateItem mutation when + button is clicked', () => {
    const mutate = vi.fn();
    mockUseUpdateItem.mockReturnValue({ mutate, isPending: false } as any);

    render(<CartSidebar />);

    const plusButtons = screen.getAllByRole('button').filter((b) =>
      b.querySelector('svg'), // icon buttons
    );
    // The + button is the second stepper button
    const plusBtn = screen.getAllByRole('button').find(
      (b) => !b.textContent && b.querySelector('[class*="Plus"]'),
    );

    // Click the increment button (last icon button before trash)
    const allButtons = screen.getAllByRole('button');
    // buttons: [−, +, trash] for each item
    fireEvent.click(allButtons[1]); // + button

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 3 }), // 2 + 1
    );
  });

  it('calls removeItem mutation when trash button is clicked', () => {
    const mutate = vi.fn();
    mockUseRemoveItem.mockReturnValue({ mutate, isPending: false } as any);

    render(<CartSidebar />);

    // Trash is the last button in the item row
    const allButtons = screen.getAllByRole('button');
    fireEvent.click(allButtons[allButtons.length - 1]);

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        cartId: 'cart_test_01',
        lineItemId: 'item_test_01',
      }),
    );
  });

  it('disables stepper and trash buttons when a mutation is pending', () => {
    mockUseUpdateItem.mockReturnValue({ mutate: vi.fn(), isPending: true } as any);

    render(<CartSidebar />);

    const allButtons = screen.getAllByRole('button');
    const disabledButtons = allButtons.filter((b) => b.hasAttribute('disabled'));
    expect(disabledButtons.length).toBeGreaterThan(0);
  });

  it('renders the drawer title with item count', () => {
    render(<CartSidebar />);
    expect(screen.getByTestId('drawer-title').textContent).toContain('1'); // 1 item
  });
});

// ── Closed state ──────────────────────────────────────────────────────────────

describe('CartSidebar — closed', () => {
  it('renders nothing when cartOpen=false', () => {
    mockUseUIStore.mockReturnValue({ cartOpen: false, setCartOpen: vi.fn() } as any);
    mockUseCart.mockReturnValue({ data: CART, isLoading: false } as any);

    render(<CartSidebar />);
    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
  });
});
