import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '../../lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'inline-flex items-center !p-0 w-4 h-2 rounded-full border border-transparent transition-colors cursor-pointer peer shrink-0 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-1 w-1 rounded-full bg-white ring-0 transition-transform data-[state=checked]:translate-x-[8px] data-[state=unchecked]:translate-x-[2px]'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
