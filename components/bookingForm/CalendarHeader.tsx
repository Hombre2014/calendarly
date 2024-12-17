import { CalendarState } from 'react-stately';
import { useDateFormatter } from '@react-aria/i18n';
import { type AriaButtonProps } from '@react-aria/button';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { FocusableElement, DOMAttributes } from '@react-types/shared';

import CalendarButton from './CalendarButton';

const CalendarHeader = ({
  state,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
}: {
  state: CalendarState;
  prevButtonProps: AriaButtonProps<'button'>;
  nextButtonProps: AriaButtonProps<'button'>;
  calendarProps: DOMAttributes<FocusableElement>;
}) => {
  const monthDateFormatter = useDateFormatter({
    month: 'short',
    year: 'numeric',
    timeZone: state.timeZone,
  });

  const [monthName, _, year] = monthDateFormatter
    .formatToParts(state.visibleRange.start.toDate(state.timeZone))
    .map((part) => part.value);

  return (
    <div className="flex items-center pb-4">
      <VisuallyHidden>
        <h2 id="calendar-heading">{calendarProps['aria-label']}</h2>
      </VisuallyHidden>
      <h2 className="font-semibold flex-1">
        {monthName}{' '}
        <span className="text-muted-foreground text-sm font-medium">
          {year}
        </span>
      </h2>
      <div className="flex items-center gap-2">
        <CalendarButton {...prevButtonProps}>
          <ChevronLeftIcon size={4} />
        </CalendarButton>
        <CalendarButton {...nextButtonProps}>
          <ChevronRightIcon size={4} />
        </CalendarButton>
      </div>
    </div>
  );
};

export default CalendarHeader;
