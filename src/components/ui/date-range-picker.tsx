"use client";

import {
  endOfMonth,
  endOfToday,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfDay,
  startOfMonth,
  subDays,
} from "date-fns";
import { CalendarRange, X } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DateRangePreset = {
  label: string;
  range: DateRange;
};

type DateRangePickerProps = {
  value?: DateRange;
  onChange: (value?: DateRange) => void;
  className?: string;
  placeholder?: string;
  id?: string;
};

function formatCompactRange(range?: DateRange): string {
  if (!range?.from) {
    return "";
  }

  const { from, to } = range;

  if (!to) {
    return format(from, "d MMM");
  }

  if (isSameYear(from, to)) {
    if (isSameMonth(from, to)) {
      return `${format(from, "d")}–${format(to, "d MMM yy")}`;
    }

    return `${format(from, "d MMM")}–${format(to, "d MMM yy")}`;
  }

  return `${format(from, "d MMM yy")}–${format(to, "d MMM yy")}`;
}

function getPresets(): DateRangePreset[] {
  const today = endOfToday();

  return [
    {
      label: "7d",
      range: { from: subDays(today, 6), to: today },
    },
    {
      label: "30d",
      range: { from: subDays(today, 29), to: today },
    },
    {
      label: "Month",
      range: { from: startOfMonth(today), to: endOfMonth(today) },
    },
  ];
}

function isSameRange(a?: DateRange, b?: DateRange): boolean {
  const aFrom = a?.from?.getTime();
  const aTo = a?.to?.getTime();
  const bFrom = b?.from?.getTime();
  const bTo = b?.to?.getTime();

  return aFrom === bFrom && aTo === bTo;
}

function isRangeComplete(range?: DateRange): range is Required<DateRange> {
  return Boolean(range?.from && range?.to);
}

function normalizeRange(
  range: { from: Date; to: Date },
  maxDate: Date,
): { from: Date; to: Date } | undefined {
  const from = startOfDay(range.from);
  const to = startOfDay(range.to);

  if (isAfter(from, maxDate) || isAfter(to, maxDate) || isAfter(from, to)) {
    return undefined;
  }

  return { from, to };
}

export function DateRangePicker({
  value,
  onChange,
  className,
  placeholder = "Dates",
  id,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [pendingRange, setPendingRange] = React.useState<DateRange | undefined>(
    value,
  );

  React.useEffect(() => {
    if (!open) {
      setPendingRange(value);
    }
  }, [open, value]);

  const committedLabel = formatCompactRange(value);
  const pendingLabel = formatCompactRange(pendingRange);
  const hasValue = isRangeComplete(value);
  const today = React.useMemo(() => endOfToday(), []);
  const presets = React.useMemo(() => getPresets(), []);

  const canApply = React.useMemo(() => {
    if (!pendingRange?.from || !pendingRange?.to) {
      return false;
    }

    return Boolean(
      normalizeRange({ from: pendingRange.from, to: pendingRange.to }, today),
    );
  }, [pendingRange, today]);

  const disabledDays = React.useCallback(
    (date: Date) => {
      const day = startOfDay(date);

      if (isAfter(day, today)) {
        return true;
      }

      if (pendingRange?.from && !pendingRange?.to) {
        return isBefore(day, startOfDay(pendingRange.from));
      }

      return false;
    },
    [pendingRange, today],
  );

  function applyRange(range?: DateRange) {
    if (range?.from && range?.to) {
      const normalized = normalizeRange(
        { from: range.from, to: range.to },
        today,
      );

      if (!normalized) {
        return;
      }

      onChange(normalized);
      setPendingRange(normalized);
      setOpen(false);
      return;
    }

    onChange(undefined);
    setPendingRange(undefined);
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setPendingRange(value);
    }

    setOpen(nextOpen);
  }

  function handleClear(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    applyRange(undefined);
  }

  function handlePresetSelect(range: DateRange) {
    applyRange(range);
  }

  function handleCalendarSelect(nextRange?: DateRange) {
    setPendingRange((current) => {
      if (!nextRange?.from) {
        return undefined;
      }

      const from = startOfDay(nextRange.from);
      const to = nextRange.to ? startOfDay(nextRange.to) : undefined;

      if (isAfter(from, today) || (to && isAfter(to, today))) {
        return current;
      }

      const awaitingEndDate = Boolean(current?.from && !current?.to);

      // react-day-picker sets from + to to the same day on the first click.
      if (to && isSameDay(from, to) && !awaitingEndDate) {
        return { from, to: undefined };
      }

      if (to && isBefore(to, from)) {
        return { from: to, to: from };
      }

      return to ? { from, to } : { from, to: undefined };
    });
  }

  function handleApply() {
    if (!isRangeComplete(pendingRange)) {
      return;
    }

    applyRange(pendingRange);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        id={id}
        render={
          <Button
            variant="outline"
            className={cn(
              "h-10 shrink-0 gap-1.5 rounded-lg px-2.5 font-normal shadow-none",
              hasValue
                ? "border-primary/25 bg-primary/5 text-foreground"
                : "bg-background/80 text-muted-foreground",
              className,
            )}
          />
        }
      >
        <CalendarRange
          className={cn(
            "size-3.5 shrink-0",
            hasValue ? "text-primary" : "text-muted-foreground",
          )}
          aria-hidden
        />
        <span className="max-w-[7.5rem] truncate text-xs sm:max-w-[8.5rem] sm:text-sm">
          {committedLabel || placeholder}
        </span>
        {hasValue ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date range"
            className="ml-0.5 flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={handleClear}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                applyRange(undefined);
              }
            }}
          >
            <X className="size-3" aria-hidden />
          </span>
        ) : null}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-[17.5rem] max-w-none overflow-hidden rounded-xl border-border/80 bg-popover p-0 shadow-lg"
      >
        <div className="border-b border-border/60 bg-muted/50 px-3 py-2.5">
          <p className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
            Quick range
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {presets.map((preset) => {
              const isActive = isSameRange(pendingRange, preset.range);

              return (
                <Button
                  key={preset.label}
                  type="button"
                  size="xs"
                  variant={isActive ? "default" : "outline"}
                  className={cn(
                    "h-7 min-w-11 rounded-lg px-2.5",
                    !isActive && "bg-background/80",
                  )}
                  onClick={() => handlePresetSelect(preset.range)}
                >
                  {preset.label}
                </Button>
              );
            })}
            <Button
              type="button"
              size="xs"
              variant="ghost"
              className="h-7 rounded-lg px-2.5 text-muted-foreground"
              onClick={() => setPendingRange(undefined)}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="flex h-[18.5rem] w-full items-start justify-center bg-popover px-2 py-2.5">
          <Calendar
            mode="range"
            resetOnSelect
            showOutsideDays={false}
            endMonth={today}
            disabled={disabledDays}
            defaultMonth={pendingRange?.from ?? value?.from ?? today}
            selected={pendingRange}
            onSelect={handleCalendarSelect}
            numberOfMonths={1}
            className="bg-popover [--cell-size:2rem]"
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/40 px-3 py-2">
          <p className="min-w-0 truncate text-xs text-muted-foreground">
            {pendingRange?.from && !pendingRange?.to
              ? `${format(pendingRange.from, "d MMM yyyy")} — pick end date (today or earlier)`
              : pendingLabel || "Select start date, then end date"}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            {pendingRange?.from ? (
              <Button
                type="button"
                size="xs"
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => setPendingRange(undefined)}
              >
                Reset
              </Button>
            ) : null}
            <Button
              type="button"
              size="xs"
              disabled={!canApply}
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
