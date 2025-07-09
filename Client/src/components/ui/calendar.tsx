import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar(props: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  return (
    <DayPicker
      {...props}
      classNames={{
        ...defaultClassNames,
        selected: "bg-primary text-primary-foreground !important",
        range_start: "bg-primary text-primary-foreground !important",
        range_end: "bg-primary text-primary-foreground !important",
        range_middle: "bg-primary/20 text-primary-foreground !important",
      }}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
