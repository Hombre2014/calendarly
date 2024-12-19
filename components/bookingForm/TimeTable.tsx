import { format } from 'date-fns';
import { Prisma } from '@prisma/client';

import prisma from '@/lib/db';
import { nylas } from '@/lib/nylas';

interface TimeTableProps {
  userName: string;
  selectedDate: Date;
}

async function getData(userName: string, selectedDate: Date) {
  const currentDay = format(selectedDate, 'EEEE');
  const startOfDay = new Date(selectedDate);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);
  startOfDay.setHours(0, 0, 0, 0);

  const user = await prisma.user.findFirst({
    where: {
      userName: userName,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });
  console.log('Direct user query:', user);

  const data = await prisma.availability.findFirst({
    where: {
      day: currentDay as Prisma.EnumDayFilter,
      User: {
        userName: userName,
      },
    },
    select: {
      fromTime: true,
      tillTime: true,
      id: true,
      User: {
        select: {
          grantId: true,
          grantEmail: true,
        },
      },
    },
  });

  if (!data?.User?.grantEmail || !data?.User?.grantId) {
    return {
      data,
      nylasCalendarData: null,
    };
  }

  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: data.User.grantId as string,
    requestBody: {
      startTime: Math.floor(startOfDay.getTime() / 1000),
      endTime: Math.floor(endOfDay.getTime() / 1000),
      emails: [data.User.grantEmail],
    },
  });

  // const nylasCalendarData = await nylas.calendars.getFreeBusy({
  //   identifier: data?.User?.grantId as string,
  //   requestBody: {
  //     startTime: Math.floor(startOfDay.getTime() / 1000),
  //     endTime: Math.floor(endOfDay.getTime() / 1000),
  //     emails: data?.User?.grantEmail ? [data.User.grantEmail] : [],
  //   },
  // });

  return {
    data,
    nylasCalendarData,
  };
}

const TimeTable = async ({ selectedDate, userName }: TimeTableProps) => {
  const { data, nylasCalendarData } = await getData(userName, selectedDate);
  console.log('Data: ', data);
  console.log('Nylas Calendar Data: ', nylasCalendarData);

  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, 'EEE')}{' '}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, 'MMM. d')}
        </span>
      </p>
    </div>
  );
};

export default TimeTable;
