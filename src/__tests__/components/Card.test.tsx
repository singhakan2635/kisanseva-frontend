import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '@/components/common/Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Hello Card</Card>);
    expect(screen.getByText('Hello Card')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="test-class">Content</Card>);
    expect(container.firstElementChild?.className).toContain('test-class');
  });

  it('renders title when provided', () => {
    render(<Card title="My Title">Content</Card>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<Card title="Title" subtitle="My Subtitle">Content</Card>);
    expect(screen.getByText('My Subtitle')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<Card footer={<span>Footer content</span>}>Body</Card>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstElementChild?.className).toContain('shadow-lg');
  });

  it('applies flat variant classes', () => {
    const { container } = render(<Card variant="flat">Content</Card>);
    const cls = container.firstElementChild?.className || '';
    expect(cls).not.toContain('shadow-lg');
    expect(cls).toContain('border');
  });

  it('applies elevated variant classes', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    expect(container.firstElementChild?.className).toContain('shadow-xl');
  });

  it('handles onClick and sets button role', () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Clickable</Card>);
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('handles keyboard Enter to trigger onClick', () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Keyboard</Card>);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('removes padding when noPadding is true', () => {
    const { container } = render(<Card noPadding>No pad</Card>);
    // The content div should not have padding classes
    const contentDiv = container.querySelector('.px-5');
    expect(contentDiv).toBeNull();
  });
});
