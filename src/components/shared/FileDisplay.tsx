'use client';

import React from 'react';
import { FileText, Image as ImageIcon, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Attachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

interface FileDisplayProps {
  attachments: Attachment[];
  className?: string;
}

export function FileDisplay({ attachments, className }: FileDisplayProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
      {attachments.map((file) => {
        const isImage = file.mimeType.startsWith('image/');
        
        return (
          <div 
            key={file.id}
            className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all flex items-center p-3"
          >
            <div className="bg-accent/10 p-2 rounded-lg mr-3">
              {isImage ? (
                <ImageIcon className="w-5 h-5 text-accent" />
              ) : (
                <FileText className="w-5 h-5 text-accent" />
              )}
            </div>
            
            <div className="flex-1 min-w-0 mr-2">
              <p className="text-sm font-medium text-white truncate" title={file.filename}>
                {file.filename}
              </p>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-tight">
                {(file.size / 1024).toFixed(1)} KB • {file.mimeType.split('/')[1]}
              </p>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white/60 hover:text-white" asChild>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
