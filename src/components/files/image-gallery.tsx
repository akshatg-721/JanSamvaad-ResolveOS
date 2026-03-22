'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageGalleryProps {
  images: {
    id: string;
    url: string;
    thumbnailUrl?: string;
    filename: string;
  }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
            onClick={() => openLightbox(index)}
            type="button"
          >
            <Image
              src={image.thumbnailUrl || image.url}
              alt={image.filename}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          {selectedIndex !== null && (
            <div className="relative">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
                type="button"
              >
                <X className="h-6 w-6" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300"
                    type="button"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300"
                    type="button"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}

              <div className="relative aspect-video">
                <Image
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].filename}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
