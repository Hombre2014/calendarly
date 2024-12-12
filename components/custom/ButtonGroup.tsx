'use client';

import { Children, cloneElement, ReactElement } from 'react';

import { cn } from '@/lib/utils';
import { ButtonProps } from '@/components/ui/button';

interface ButtonGroupProps {
  className?: string;
  children: ReactElement<ButtonProps>[];
}

const ButtonGroup = ({ className, children }: ButtonGroupProps) => {
  const totalButtons = Children.count(children);

  return (
    <div className={cn('flex w-full', className)}>
      {children.map((child, index) => {
        const isFirstItem = index === 0;
        const isLastItem = index === totalButtons - 1;

        return cloneElement(child, {
          className: cn(
            {
              'border-l-0': !isFirstItem,
              'rounded-r-none': !isLastItem,
              'rounded-l-none': !isFirstItem,
            },
            child.props.className
          ),
        });
      })}
    </div>
  );
};

export default ButtonGroup;
