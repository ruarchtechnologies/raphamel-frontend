import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/ui/Modal';

// framer-motion is mocked globally in setup.ts

describe('Modal', () => {
  it('renders nothing when open=false', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Test">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('renders children when open=true', () => {
    render(
      <Modal open onClose={vi.fn()}>
        <p>Modal body</p>
      </Modal>,
    );
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('renders the title in the header when provided', () => {
    render(
      <Modal open onClose={vi.fn()} title="Confirm Action">
        <p>Are you sure?</p>
      </Modal>,
    );
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Modal">
        <p>Content</p>
      </Modal>,
    );
    // The backdrop is the first motion.div (the dark overlay)
    // It has an onClick that calls onClose
    const backdrop = document.querySelector('[class*="bg-black"]');
    if (backdrop) fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Modal">
        <p>Content</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the × button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Close me">
        <p>Content</p>
      </Modal>,
    );
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does NOT call onClose when clicking inside the panel', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Modal">
        <button>Inner button</button>
      </Modal>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Inner button' }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders children in the scrollable body area', () => {
    render(
      <Modal open onClose={vi.fn()} title="Form Modal">
        <input data-testid="form-input" />
      </Modal>,
    );
    expect(screen.getByTestId('form-input')).toBeInTheDocument();
  });

  it('applies max-w-sm for size="sm"', () => {
    render(
      <Modal open onClose={vi.fn()} title="Small" size="sm">
        <p>Content</p>
      </Modal>,
    );
    const panel = document.querySelector('.max-w-sm');
    expect(panel).toBeTruthy();
  });

  it('applies max-w-lg for size="lg"', () => {
    render(
      <Modal open onClose={vi.fn()} title="Large" size="lg">
        <p>Content</p>
      </Modal>,
    );
    const panel = document.querySelector('.max-w-lg');
    expect(panel).toBeTruthy();
  });
});
