import Link from 'next/link';
import Image from 'next/image';
import { CalendarCheck2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import VideoGif from '@/public/work-is-almost-over-happy.gif';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

const OnboardingRouteTwo = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>You are almost Done!</CardTitle>
          <CardDescription>
            Now we have to connect your calendar to your account.
          </CardDescription>
          <Image
            src={VideoGif}
            alt="Work is almost over"
            className="w-full rounded-lg"
          />
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/api/auth">
              <CalendarCheck2 className="size-4 mr-2" />
              Connect Calendar to your account
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingRouteTwo;
