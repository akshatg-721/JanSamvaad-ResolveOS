'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createComplaintSchema } from '@/lib/validators/complaint.validator';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COMPLAINT_CATEGORY } from '@/constants/complaint.constants';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Paperclip } from 'lucide-react';

type ComplaintFormValues = z.infer<typeof createComplaintSchema>;

export function CreateComplaintForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedAttachments, setUploadedAttachments] = useState<string[]>([]);

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(createComplaintSchema),
    defaultValues: {
      title: '',
      description: '',
      category: COMPLAINT_CATEGORY.OTHER,
      location: {
        address: '',
      },
      attachmentIds: []
    }
  });

  const handleUploadComplete = (id: string) => {
    const newAttachments = [...uploadedAttachments, id];
    setUploadedAttachments(newAttachments);
    form.setValue('attachmentIds', newAttachments);
  };

  async function onSubmit(data: ComplaintFormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) throw new Error('Failed to submit complaint');
      
      toast({
        title: "Complaint Registered",
        description: "Your complaint has been successfully submitted.",
      });
      form.reset();
      setUploadedAttachments([]);
      onSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "There was a problem submitting your complaint. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Broken streetlight on main road" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(COMPLAINT_CATEGORY).map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide detailed information about the issue..."
                  className="resize-none min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location / Address</FormLabel>
              <FormControl>
                <Input placeholder="Full address or landmark" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel className="flex items-center gap-2 text-sm font-medium">
            <Paperclip className="w-4 h-4" />
            Evidence & Attachments
          </FormLabel>
          <FileUpload 
            onUploadComplete={handleUploadComplete} 
            maxFiles={5}
          />
          {uploadedAttachments.length > 0 && (
            <p className="text-xs text-muted-foreground italic">
              {uploadedAttachments.length} file(s) attached to this complaint.
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </Button>
      </form>
    </Form>
  );
}
