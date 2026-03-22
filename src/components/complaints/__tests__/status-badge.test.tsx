import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { StatusBadge } from '../status-badge';

describe('StatusBadge', () => {
  it('renders PENDING status correctly', () => {
    render(<StatusBadge status="PENDING" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders RESOLVED status correctly', () => {
    render(<StatusBadge status="RESOLVED" />);
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('renders IN_PROGRESS status correctly', () => {
    render(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders unknown status as-is', () => {
    render(<StatusBadge status="UNKNOWN" />);
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatusBadge status="PENDING" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
