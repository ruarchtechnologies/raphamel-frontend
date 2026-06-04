import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input, Textarea } from '@/components/ui/Input';

// ── Input ─────────────────────────────────────────────────────────────────────

describe('Input', () => {
  it('renders without label when label prop is omitted', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders a label linked to the input via htmlFor/id', () => {
    render(<Input label="Email address" />);
    const label = screen.getByText('Email address');
    expect(label.tagName).toBe('LABEL');
    const input = screen.getByLabelText('Email address');
    expect(input).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<Input label="Phone" error="Please enter a valid number" />);
    expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();
  });

  it('does not show error paragraph when error is undefined', () => {
    render(<Input label="Phone" />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('applies error border styling when error is provided', () => {
    render(<Input label="Field" error="Bad input" />);
    const input = screen.getByLabelText('Field');
    expect(input.className).toContain('rose');
  });

  it('renders leftIcon when provided', () => {
    render(<Input label="Search" leftIcon={<span data-testid="search-icon" />} />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('renders rightIcon when provided', () => {
    render(<Input label="Password" rightIcon={<span data-testid="eye-icon" />} />);
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });

  it('applies filled styling when filled=true', () => {
    render(<Input filled placeholder="Search" />);
    const input = screen.getByPlaceholderText('Search');
    expect(input.className).toContain('bg-gray-100');
  });

  it('forwards onChange to the input element', () => {
    const onChange = vi.fn();
    render(<Input label="Name" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ade' } });
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('respects the type attribute', () => {
    render(<Input label="Password" type="password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('uses id prop when provided instead of derived id', () => {
    render(<Input label="My Field" id="custom-id" />);
    const input = screen.getByLabelText('My Field');
    expect(input).toHaveAttribute('id', 'custom-id');
  });
});

// ── Textarea ──────────────────────────────────────────────────────────────────

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea label="Message" />);
    const ta = screen.getByLabelText('Message');
    expect(ta.tagName).toBe('TEXTAREA');
  });

  it('shows error message when error prop is provided', () => {
    render(<Textarea label="Notes" error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('forwards onChange', () => {
    const onChange = vi.fn();
    render(<Textarea label="Body" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Body'), {
      target: { value: 'hello' },
    });
    expect(onChange).toHaveBeenCalledOnce();
  });
});
