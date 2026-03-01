import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface SatisfactionPopupProps {
  open: boolean;
  onYes: () => void;
  onNo: () => void;
  title?: string;
  description?: string;
}

export default function SatisfactionPopup({
  open,
  onYes,
  onNo,
  title = 'Your Feedback',
  description = 'Are you satisfied with this package?',
}: SatisfactionPopupProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md animate-in fade-in zoom-in-95 duration-300"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={onYes}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex items-center gap-2 transition-all duration-200 hover:scale-105"
            size="lg"
          >
            <ThumbsUp className="h-5 w-5" />
            Yes
          </Button>
          <Button
            onClick={onNo}
            variant="outline"
            className="border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 flex items-center gap-2 transition-all duration-200 hover:scale-105"
            size="lg"
          >
            <ThumbsDown className="h-5 w-5" />
            No
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
