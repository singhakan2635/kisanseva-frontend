import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/common/Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Full Name" />);
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });

  it('generates id from label when no id provided', () => {
    render(<Input label="Full Name" />);
    const input = screen.getByLabelText('Full Name');
    expect(input.id).toBe('input-full-name');
  });

  it('uses provided id', () => {
    render(<Input label="Name" id="custom-id" />);
    const input = screen.getByLabelText('Name');
    expect(input.id).toBe('custom-id');
  });

  it('shows error message', () => {
    render(<Input label="Email" error="Email is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
  });

  it('applies error styling when error is present', () => {
    render(<Input label="Email" error="Required" />);
    const input = screen.getByLabelText('Email');
    expect(input.className).toContain('border-severity-severe');
  });

  it('renders phone variant with +91 prefix', () => {
    render(<Input label="Phone" variant="phone" />);
    expect(screen.getByText('+91')).toBeInTheDocument();
  });

  it('phone variant sets type to tel and maxLength to 10', () => {
    render(<Input label="Phone" variant="phone" />);
    const input = screen.getByLabelText('Phone');
    expect(input).toHaveAttribute('type', 'tel');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('shows hint text', () => {
    render(<Input label="Name" hint="Enter your full name" />);
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  it('does not show hint when error is present', () => {
    render(<Input label="Name" hint="Enter your name" error="Required" />);
    expect(screen.queryByText('Enter your name')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('calls onChange handler', () => {
    const onChange = vi.fn();
    render(<Input label="Name" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('passes through placeholder prop', () => {
    render(<Input label="Name" placeholder="Type here..." />);
    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
  });
});
