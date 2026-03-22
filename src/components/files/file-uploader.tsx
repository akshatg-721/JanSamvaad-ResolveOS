'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string;
}

interface FileUploaderProps {
  onUploadComplete: (files: UploadedFile[]) => void;
  maxFiles?: number;
  existingFiles?: UploadedFile[];
  onRemoveExisting?: (id: string) => void;
}

export function FileUploader({
  onUploadComplete,
  maxFiles = 5,
  existingFiles = [],
  onRemoveExisting,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const totalFiles = existingFiles.length + pendingFiles.length + acceptedFiles.length;

    if (totalFiles > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setPendingFiles((prev) => [...prev, ...acceptedFiles]);
  }, [existingFiles.length, pendingFiles.length, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    },
    maxSize: 5 * 1024 * 1024,
    disabled: uploading,
  });

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (pendingFiles.length === 0) return;

    setUploading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      pendingFiles.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setProgress(80);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      onUploadComplete(result.data);
      setPendingFiles([]);
      setProgress(100);
      toast.success('Files uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 400);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary',
          uploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Max {maxFiles} files, up to 5MB each (JPEG, PNG, WebP, GIF)
        </p>
      </div>

      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {existingFiles.map((file) => (
              <div key={file.id} className="relative group">
                <img
                  src={file.thumbnailUrl || file.url}
                  alt={file.filename}
                  className="w-full h-24 object-cover rounded-lg"
                />
                {onRemoveExisting && (
                  <button
                    onClick={() => onRemoveExisting(file.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Ready to Upload</p>
          <div className="space-y-2">
            {pendingFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => removePendingFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full"
            type="button"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {pendingFiles.length} file{pendingFiles.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      )}

      {uploading && progress > 0 && (
        <Progress value={progress} className="w-full" />
      )}
    </div>
  );
}
