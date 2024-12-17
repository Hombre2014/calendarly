import { useRef } from 'react';
import { CalendarState } from 'react-stately';
import { useCalendarCell, useFocusRing, mergeProps } from 'react-aria';
import {
  isToday,
  // isSameMonth,
  CalendarDate,
  getLocalTimeZone,
} from '@internationalized/date';

import { cn } from '@/lib/utils';

const CalendarCell = ({
  state,
  date,
  isUnavailable,
}: // currentMonth,
{
  date: CalendarDate;
  state: CalendarState;
  isUnavailable?: boolean;
  currentMonth: CalendarDate;
}) => {
  const ref = useRef(null);
  const {
    cellProps,
    isDisabled,
    isSelected,
    buttonProps,
    formattedDate,
    isOutsideVisibleRange,
  } = useCalendarCell({ date }, state, ref);

  const focusProps = useFocusRing();
  const { isFocusVisible } = useFocusRing();
  const isDateToday = isToday(date, getLocalTimeZone());
  const finallyIsDisabled = isDisabled || isUnavailable;
  // const isOutsideOfMount = !isSameMonth(date, currentMonth);

  return (
    <td
      {...cellProps}
      className={`px-0.5 py-0.5 relative ${isFocusVisible ? 'z-10' : 'z-0'}`}
    >
      <div
        ref={ref}
        hidden={isOutsideVisibleRange}
        {...mergeProps(buttonProps, focusProps)}
        className="size-10 sm:size-12 outline-none group rounded-md"
      >
        <div
          className={cn(
            'size-full flex items-center justify-center rounded-sm text-sm font-semibold',
            isSelected ? 'bg-primary text-white' : '',
            finallyIsDisabled ? 'text-muted-foreground cursor-not-allowed' : '',
            !isSelected && !finallyIsDisabled ? 'bg-secondary' : ''
          )}
        >
          {formattedDate}
          {isDateToday && (
            <div
              className={cn(
                'absolute bottom-3 border border-b w-4 border-primary rounded-full',
                isSelected && 'border-white'
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
};

export default CalendarCell;
