import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="text-center max-w-md">
        <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-7xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <div className="flex justify-center gap-4">
          <Link href="/"><Button size="lg"><Home className="mr-2 h-4 w-4" /> Home</Button></Link>
          <Link href="/dashboard"><Button size="lg" variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Dashboard</Button></Link>
        </div>
      </div>
    </div>
  );
}
