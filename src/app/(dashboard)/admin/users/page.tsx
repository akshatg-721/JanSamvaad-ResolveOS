'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/admin/users');
        const result = await response.json();
        if (result.success) setUsers(result.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Card className="shadow-xl border-0 rounded-2xl">
      <CardHeader><CardTitle>Users</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-10" />)}</div>
        ) : users.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Name</th><th className="text-left py-2">Email</th><th className="text-left py-2">Role</th><th className="text-left py-2">Complaints</th><th className="text-left py-2">Joined</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge className={user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : user.role === 'OFFICIAL' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>{user.role}</Badge>
                    </td>
                    <td>{user._count?.complaints || 0}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}