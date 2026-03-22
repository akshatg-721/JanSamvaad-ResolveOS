import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { ComplaintCard } from '../complaint-card';
import { createMockComplaint } from '@/test/factories';

describe('ComplaintCard', () => {
  it('renders complaint title', () => {
    const complaint = createMockComplaint({ title: 'Test Complaint Title' });
    render(<ComplaintCard complaint={complaint} />);
    expect(screen.getByText('Test Complaint Title')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    const complaint = createMockComplaint({ status: 'PENDING' });
    render(<ComplaintCard complaint={complaint} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    const complaint = createMockComplaint({ category: 'ROADS' });
    render(<ComplaintCard complaint={complaint} />);
    expect(screen.getByText('Roads & Infrastructure')).toBeInTheDocument();
  });

  it('renders upvote count', () => {
    const complaint = createMockComplaint({
      _count: { upvotes: 42 },
    });
    render(<ComplaintCard complaint={complaint} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders user name', () => {
    const complaint = createMockComplaint({
      user: { id: '1', name: 'Rahul Sharma', email: 'rahul@test.com' },
    });
    render(<ComplaintCard complaint={complaint} />);
    expect(screen.getByText(/Rahul Sharma/)).toBeInTheDocument();
  });

  it('links to complaint detail page', () => {
    const complaint = createMockComplaint({ id: 'complaint-123' });
    const { container } = render(<ComplaintCard complaint={complaint} />);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/dashboard/complaints/complaint-123');
  });
});
