'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { uploadSingleFile } from '@/lib/api/upload';

interface FileUploadProps {
  onUploadComplete: (attachmentId: string) => void;
  maxFiles?: number;
  className?: string;
}

export function FileUpload({ onUploadComplete, maxFiles = 5, className }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setProgress(0);

    for (const file of acceptedFiles) {
      try {
        const uploaded = await uploadSingleFile(file);
        if (uploaded?.id) {
          onUploadComplete(uploaded.id);
          toast.success(`Uploaded ${file.name}`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch {
        toast.error(`Network error uploading ${file.name}`);
      }
    }

    setUploading(false);
    setProgress(100);
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    },
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center text-center',
          isDragActive ? 'border-accent bg-accent/5' : 'border-white/10 bg-white/5 hover:bg-white/10',
          uploading && 'opacity-50 pointer-events-none'
        )}
      >
        <input {...getInputProps()} />

        <div className="bg-accent/10 p-4 rounded-full mb-4">
          <Upload className="w-8 h-8 text-accent" />
        </div>

        <p className="text-white font-medium mb-1">
          {isDragActive ? 'Drop files here' : 'Click or drag files to upload'}
        </p>
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold">
          Images up to 5MB (Max {maxFiles})
        </p>

        {uploading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 animate-in fade-in">
            <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
            <p className="text-white font-bold mb-2">UPLOADING...</p>
            <Progress value={progress} className="w-full h-1 bg-white/10" />
          </div>
        )}
      </div>
    </div>
  );
}

