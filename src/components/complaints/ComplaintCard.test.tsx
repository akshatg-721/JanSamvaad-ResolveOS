import React from 'react';
import { render } from '@testing-library/react';
import { ComplaintCard } from './ComplaintCard';
import { COMPLAINT_STATUS, COMPLAINT_CATEGORY } from '@/constants/complaint.constants';

describe('ComplaintCard Component', () => {
  const mockComplaint = {
    id: 'test-123',
    title: 'Water Leakage in Main Pipe',
    description: 'Huge water leak near the metro pillar.',
    category: COMPLAINT_CATEGORY.WATER,
    status: COMPLAINT_STATUS.PENDING,
    location: { address: 'Sector 4, Rohini', city: 'Delhi', state: 'Delhi', pincode: '110085' } as any,
    priority: 2,
    userId: 'user-1',
    assignedToId: null,
    resolvedAt: null,
    deletedAt: null,
    createdAt: new Date('2026-01-01T10:00:00Z'),
    updatedAt: new Date('2026-01-01T10:00:00Z'),
    _count: { comments: 5, upvotes: 12, attachments: 0 }
  };

  it('renders complaint title and description correctly', () => {
    const { getByText } = render(<ComplaintCard complaint={mockComplaint as any} />);
    
    expect(getByText('Water Leakage in Main Pipe')).toBeInTheDocument();
    expect(getByText('Huge water leak near the metro pillar.')).toBeInTheDocument();
  });

  it('renders the correct badges', () => {
    const { getByText } = render(<ComplaintCard complaint={mockComplaint as any} />);
    
    // Status Badge
    expect(getByText('Pending')).toBeInTheDocument();
    
    // Priority Badge
    expect(getByText('HIGH Priority')).toBeInTheDocument();
  });

  it('renders upvotes and comments count', () => {
    const { getByText } = render(<ComplaintCard complaint={mockComplaint as any} />);
    
    expect(getByText('5')).toBeInTheDocument(); // comments
    expect(getByText('12')).toBeInTheDocument(); // upvotes
  });
});
