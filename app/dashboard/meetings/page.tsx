import { nylas } from '@/lib/nylas';
import { Video } from 'lucide-react';
import { format, fromUnixTime } from 'date-fns';

import prisma from '@/lib/db';
import { requireUser } from '@/lib/hooks';
import { Separator } from '@/components/ui/separator';
import EmptyState from '@/components/custom/EmptyState';
import { SubmitButton } from '@/components/custom/SubmitButtons';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

async function getData(userId: string) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantId: true,
      grantEmail: true,
    },
  });

  console.log('UserData:', userData);

  if (!userData?.grantId || !userData?.grantEmail) {
    return { data: [] };
  }

  try {
    const calendars = await nylas.calendars.list({
      identifier: userData.grantId,
    });

    const data = await nylas.events.list({
      identifier: userData.grantId,
      queryParams: {
        calendarId: calendars.data[0].id,
      },
    });

    return data;
  } catch (error) {
    console.log('Nylas Error:', error);
    return { data: [] };
  }
}

const MeetingsRoute = async () => {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  console.log('Data when:', data.data[0].when);

  return (
    <>
      {data.data.length < 1 ? (
        <EmptyState
          title="No Meetings Found"
          description="You have no meetings scheduled."
          buttonText="Create a new event type"
          href="/dashboard/new"
        />
      ) : (
        <Card className="w-2/3 mx-auto">
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              See the upcoming events which ere booked with you and see the
              event type link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.data.map((item) => {
              if (!item.when?.startTime) return null;

              const startDateTime = fromUnixTime(item.when.startTime);
              const endDateTime = fromUnixTime(item.when.endTime);

              return (
                <>
                  <>
                    <div
                      key={item.id}
                      className="grid grid-cols-3 justify-between items-center"
                      style={{
                        display: item.conferencing?.details?.url
                          ? 'grid'
                          : 'none',
                      }}
                    >
                      {item.conferencing?.details?.url ? (
                        <>
                          <div>
                            <p className="text-muted-foreground text-sm">
                              {format(startDateTime, 'EEEE, dd MMM')}
                            </p>
                            <p className="text-muted-foreground text-xs pt-1">
                              {format(startDateTime, 'hh:mm a')} -{' '}
                              {format(endDateTime, 'hh:mm a')}
                            </p>
                            <div className="flex items-center mt-1 mb-2">
                              <Video className="mr-2 size-4 text-primary" />

                              <a
                                className="text-xs text-primary underline underline-offset-4 cursor-pointer"
                                href={item.conferencing?.details?.url}
                                target="_blank"
                              >
                                Join Meeting
                              </a>
                            </div>
                          </div>
                          <div className="flex flex-col items-start">
                            <h2 className="text-sm font-medium">
                              {item.title}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                              You and {item.participants[0].name}
                            </p>
                          </div>
                          <SubmitButton
                            text="Cancel Event"
                            variant="destructive"
                            className="w-fit ml-auto flex"
                          />
                        </>
                      ) : null}
                    </div>
                    <Separator
                      className="my-3"
                      style={{
                        display: item.conferencing?.details?.url
                          ? 'block'
                          : 'none',
                      }}
                    />
                  </>
                </>
              );
            })}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MeetingsRoute;
