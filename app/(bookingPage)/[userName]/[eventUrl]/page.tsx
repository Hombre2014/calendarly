import { notFound } from 'next/navigation';
import { CalendarX2, Clock, VideoIcon } from 'lucide-react';

import prisma from '@/lib/db';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import RenderCalendar from '@/components/bookingForm/RenderCalendar';

async function getData(eventUrl: string, userName: string) {
  const data = await prisma.eventType.findFirst({
    where: {
      url: eventUrl,
      User: {
        userName: userName,
      },
      active: true,
    },
    select: {
      id: true,
      title: true,
      duration: true,
      description: true,
      videoCallSoftware: true,
      User: {
        select: {
          image: true,
          name: true,
          availability: {
            select: {
              day: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

const BookingFormRoute = async ({
  params,
  searchParams,
}: {
  params: { userName: string; eventUrl: string };
  searchParams: { date?: string };
}) => {
  const { userName, eventUrl } = await params;
  const data = await getData(eventUrl, userName);
  const selectedDate = searchParams.date
    ? new Date(searchParams.date)
    : new Date();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(selectedDate);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="max-w-[1000px] w-full mx-auto">
        <CardContent className="p-5 grid md:grid-cols-[1fr,auto,1fr] gap-4">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.User?.image ?? ''}
              alt="Profile image of the user"
              className="size-10 rounded-full"
            />
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {data.User?.name}
            </p>
            <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
            <p className="text-sm font-medium text-muted-foreground">
              {data.description}
            </p>
            <div className="mt-5 flex flex-col gap-y-3">
              <p className="flex items-center gap-x-2">
                <CalendarX2 className="size-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {formattedDate}
                </span>
              </p>
              <p className="flex items-center gap-x-2">
                <Clock className="size-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {data.duration} minutes
                </span>
              </p>
              <p className="flex items-center gap-x-2">
                <VideoIcon className="size-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {data.videoCallSoftware}
                </span>
              </p>
            </div>
          </div>
          <Separator
            orientation="vertical"
            className="hidden md:block h-full w-[1px]"
          />
          <RenderCalendar availability={data.User?.availability as never} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingFormRoute;
