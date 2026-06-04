import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('fires onClick when clicked', () => {
    const handler = vi.fn();
    render(<Button variant="primary" onClick={handler}>Go</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('is disabled and shows spinner when loading=true', () => {
    render(<Button variant="primary" loading>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    // Children are replaced by spinner — text not visible
    expect(btn.textContent).not.toContain('Save');
    // Loader2 SVG should be present
    expect(btn.querySelector('svg')).toBeTruthy();
  });

  it('is disabled when disabled=true', () => {
    render(<Button variant="primary" disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', () => {
    const handler = vi.fn();
    render(
      <Button variant="primary" disabled onClick={handler}>
        No click
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('renders leftIcon before children', () => {
    render(
      <Button variant="primary" leftIcon={<span data-testid="icon-left" />}>
        Label
      </Button>,
    );
    expect(screen.getByTestId('icon-left')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Label/ })).toBeInTheDocument();
  });

  it('renders rightIcon after children', () => {
    render(
      <Button variant="primary" rightIcon={<span data-testid="icon-right" />}>
        Label
      </Button>,
    );
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
  });

  it('renders as <a> tag when asChild is true with a link child', () => {
    render(
      <Button variant="primary" asChild>
        <a href="/shop">Shop</a>
      </Button>,
    );
    // asChild renders the child element (anchor) directly
    expect(screen.getByRole('link', { name: 'Shop' })).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies danger variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('rose');
  });

  it('applies size=sm class', () => {
    render(<Button variant="primary" size="sm">Small</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('h-[38px]');
  });

  it('applies rounded=full class', () => {
    render(<Button variant="primary" rounded="full">Round</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('rounded-full');
  });

  it('type defaults to "button" — does not submit forms unexpectedly', () => {
    const submit = vi.fn();
    render(
      <form onSubmit={submit}>
        <Button variant="primary">Not Submit</Button>
      </form>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(submit).not.toHaveBeenCalled();
  });

  it('type="submit" submits the form', () => {
    const submit = vi.fn((e) => e.preventDefault());
    render(
      <form onSubmit={submit}>
        <Button variant="primary" type="submit">Submit</Button>
      </form>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(submit).toHaveBeenCalledOnce();
  });
});
