import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { CategoryBadge } from '../category-badge';

describe('CategoryBadge', () => {
  it('renders ROADS category correctly', () => {
    render(<CategoryBadge category="ROADS" />);
    expect(screen.getByText('Roads & Infrastructure')).toBeInTheDocument();
  });

  it('renders WATER category correctly', () => {
    render(<CategoryBadge category="WATER" />);
    expect(screen.getByText('Water Supply')).toBeInTheDocument();
  });

  it('renders ELECTRICITY category correctly', () => {
    render(<CategoryBadge category="ELECTRICITY" />);
    expect(screen.getByText('Electricity')).toBeInTheDocument();
  });

  it('renders unknown category as-is', () => {
    render(<CategoryBadge category="UNKNOWN" />);
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });
});
