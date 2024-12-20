import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const SuccessRoute = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="max-w-[400px] w-full mx-auto">
        <CardContent className="p-6 flex flex-col w-full items-center">
          <div className="size-16 bg-green-500/10 rounded-full flex items-center justify-center">
            <Check className="size-8 text-green-500" />
          </div>
          <h1 className="mt-4 font-semibold text-2xl">
            This event is scheduled
          </h1>
          <p className="text-center text-muted-foreground mt-2 text-sm">
            We emailed you a calendar invitation with all the details and video
            call link.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/" passHref>
              Close this page
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessRoute;
