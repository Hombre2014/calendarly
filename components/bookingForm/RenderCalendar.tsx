'use client';

import { today, getLocalTimeZone, DateValue } from '@internationalized/date';

import Calendar from './Calendar';

interface RenderCalendarProps {
  availability: {
    day: string;
    isActive: boolean;
  }[];
}

const RenderCalendar = ({ availability }: RenderCalendarProps) => {
  const isDateUnavailable = (date: DateValue) => {
    const dayOfWeek = date.toDate(getLocalTimeZone()).getDay();
    const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    return !availability[adjustedIndex].isActive;
  };

  return (
    <Calendar
      minValue={today(getLocalTimeZone())}
      isDateUnavailable={isDateUnavailable}
    />
  );
};

export default RenderCalendar;
