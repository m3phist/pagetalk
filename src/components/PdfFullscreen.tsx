'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import {
  ChevronDown,
  ChevronUp,
  Expand,
  Loader2,
  RotateCw,
  Search,
} from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { Document, Page } from 'react-pdf';
import { toast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';

import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface PdfFullscreenProps {
  fileUrl: string;
}

export const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();

  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant="ghost" className="gap-1.5" aria-label="fullscreen">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
          {/* top bar */}
          <div className="h-10 w-full border-b border-zinc-200 flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-1.5" aria-label="zoom" variant="ghost">
                    <Search className="h-4 w-4" />
                    {scale * 100}%<ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setScale(0.75)}>
                    75%
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setScale(1)}>
                    100%
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setScale(1.5)}>
                    150%
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setScale(2)}>
                    200%
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => setRotation((prev) => prev + 90)}
                variant="ghost"
                aria-label="rotate 90 degrees"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full max-h-screen">
            <SimpleBar
              autoHide={false}
              className="max-h-[calc(100vh-10rem)] mt-6"
            >
              <div ref={ref}>
                <Document
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  onLoadError={() => {
                    toast({
                      title: 'Error loading PDF',
                      description: 'Please try again later.',
                      variant: 'destructive',
                    });
                  }}
                  file={fileUrl}
                  className="max-h-full"
                >
                  {numPages !== undefined &&
                    new Array(numPages)
                      .fill(0)
                      .map((_, i) => (
                        <Page
                          key={i}
                          width={width ? width : 1}
                          pageNumber={i + 1}
                          scale={scale}
                          rotate={rotation}
                        />
                      ))}
                </Document>
              </div>
            </SimpleBar>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
