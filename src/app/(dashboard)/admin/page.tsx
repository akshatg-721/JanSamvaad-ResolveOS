import { requireAdmin } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="destructive">ADMIN ACCESS</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Manage Users</CardTitle></CardHeader><CardContent><Link href="/admin/users"><Button>Open</Button></Link></CardContent></Card>
        <Card><CardHeader><CardTitle>All Complaints</CardTitle></CardHeader><CardContent><Link href="/dashboard/complaints"><Button variant="outline">Open</Button></Link></CardContent></Card>
        <Card><CardHeader><CardTitle>Analytics</CardTitle></CardHeader><CardContent><Button variant="outline" disabled>Coming Soon</Button></CardContent></Card>
      </div>
    </div>
  );
}