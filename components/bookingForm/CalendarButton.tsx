import { useRef } from 'react';
import { mergeProps } from '@react-aria/utils';
import { useFocusRing } from '@react-aria/focus';
import { CalendarState } from '@react-stately/calendar';
import { useButton, AriaButtonProps } from '@react-aria/button';

import { Button } from '@/components/ui/button';

const CalendarButton = (
  props: AriaButtonProps<
    'button' & {
      state?: CalendarState;
      side?: 'left' | 'right';
    }
  >
) => {
  const ref = useRef(null);
  const { focusProps } = useFocusRing();
  const { buttonProps } = useButton(props, ref);

  return (
    <Button
      ref={ref}
      size="icon"
      variant="outline"
      disabled={props.isDisabled}
      {...mergeProps(buttonProps, focusProps)}
    >
      {props.children}
    </Button>
  );
};

export default CalendarButton;
