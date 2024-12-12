import { Ban, PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  href: string;
  title: string;
  buttonText: string;
  description: string;
}

const EmptyState = ({
  href,
  title,
  buttonText,
  description,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col h-full flex-1 items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex items-center justify-center size-20 rounded-full bg-primary/10">
        <Ban className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">
        {title}
        <p className="mb-8 mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
          {description}
        </p>
        <Button asChild>
          <Link href={href}>
            <PlusCircle className="size-4 mr-2" />
            {buttonText}
          </Link>
        </Button>
      </h2>
    </div>
  );
};

export default EmptyState;
