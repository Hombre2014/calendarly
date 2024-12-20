import Link from 'next/link';
import { NylasResponse } from 'nylas';
import {
  parse,
  format,
  isAfter,
  isBefore,
  addMinutes,
  fromUnixTime,
} from 'date-fns';

import prisma from '@/lib/db';
import { nylas } from '@/lib/nylas';
import { Prisma } from '@prisma/client';
import { Button } from '@/components/ui/button';

interface TimeTableProps {
  userName: string;
  duration: number;
  selectedDate: Date;
}

async function getData(userName: string, selectedDate: Date) {
  const currentDay = format(selectedDate, 'EEEE');
  const startOfDay = new Date(selectedDate);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);
  startOfDay.setHours(0, 0, 0, 0);

  const data = await prisma.availability.findFirst({
    where: {
      day: currentDay as Prisma.EnumDayFilter,
      User: {
        userName: userName,
      },
    },
    select: {
      id: true,
      fromTime: true,
      tillTime: true,
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

  return {
    data,
    nylasCalendarData,
  };
}

// From Codi AI, not in the original code from the tutorial
interface TimeSlot {
  object: string;
  status: string;
  endTime: number;
  startTime: number;
}

interface FreeBusyData {
  email: string;
  object: string;
  timeSlots: TimeSlot[];
}
// From Codi AI, not in the original code from the tutorial

function calculateAvailableTimeSlots(
  date: string,
  dbAvailability: {
    fromTime: string | undefined;
    tillTime: string | undefined;
  },
  nylasData: NylasResponse<FreeBusyData[]>,
  duration: number
) {
  const now = new Date();

  const availableFrom = parse(
    `${date} ${dbAvailability.fromTime}`,
    'yyyy-MM-dd HH:mm',
    new Date()
  );

  const availableTill = parse(
    `${date} ${dbAvailability.tillTime}`,
    'yyyy-MM-dd HH:mm',
    new Date()
  );

  // From Codi AI, not in the original code from the tutorial
  const busySlots = nylasData.data[0].timeSlots.map((slot) => ({
    start: fromUnixTime(slot.startTime),
    end: fromUnixTime(slot.endTime),
  }));

  const allSlots = [];
  let currentSlot = availableFrom;
  // Create all the slots between availableFrom and availableTill with the particular duration
  while (isBefore(currentSlot, availableTill)) {
    allSlots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, duration);
  }

  const freeSlots = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, duration);

    return (
      isAfter(slot, now) && // Ensure the slot is after the current time
      !busySlots.some(
        (busy: { start: Date; end: Date }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
      )
    );
  });

  return freeSlots.map((slot) => format(slot, 'HH:mm'));
}

const TimeTable = async ({
  selectedDate,
  userName,
  duration,
}: TimeTableProps) => {
  const { data, nylasCalendarData } = await getData(userName, selectedDate);
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const dbAvailability = {
    fromTime: data?.fromTime,
    tillTime: data?.tillTime,
  };

  const availableSlots = nylasCalendarData
    ? calculateAvailableTimeSlots(
        formattedDate,
        dbAvailability,
        nylasCalendarData as NylasResponse<FreeBusyData[]>,
        duration
      )
    : [];

  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, 'EEE')}{' '}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, 'MMM. d')}
        </span>
      </p>
      <div className="mt-3 max-h-[350px] overflow-y-auto">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <Link
              href={`?date=${format(selectedDate, 'yyyy-MM-dd')}&time=${slot}`}
              key={index}
            >
              <Button className="w-full mb-2" variant="outline">
                {slot}
              </Button>
            </Link>
          ))
        ) : (
          <p>no slots available</p>
        )}
      </div>
    </div>
  );
};

export default TimeTable;
