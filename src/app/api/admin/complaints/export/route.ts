import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-wrapper';
import { complaintService } from '@/services/complaint.service';

export const GET = withAuth(async (req: NextRequest, ctx: any) => {
  const user = ctx.user;
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Get full unpaginated dump for CSV export (Simplified)
  const result = await complaintService.getComplaints({}, { page: 1, limit: 10000 });
  
  // Transform to CSV string
  const headers = ['ID', 'Title', 'Status', 'Category', 'Severity', 'CreatedAt'];
  const csvRows = [headers.join(',')];
  
  for (const row of result.data) {
    csvRows.push([
      row.id,
      `"${row.title.replace(/"/g, '""')}"`,
      row.status,
      row.category,
      row.severity,
      new Date(row.createdAt).toISOString()
    ].join(','));
  }

  return new NextResponse(csvRows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="complaints_export.csv"',
    }
  });
});
