'use client';

import * as React from 'react';
import { Button } from '@/components/shadcn/button';
import { Calendar } from '@/components/shadcn/calendar';
import { Field, FieldGroup, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/shadcn/popover';
import { format } from 'date-fns';
import { ChevronDownIcon, InfoIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/shadcn/tooltip';

interface DatePickerTimeProps {
    label: string;
    hint?: string;
    description?: string;
    error?: string;
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
}

export function DatePickerTime({ label, hint, description, error, value, onChange, minDate, maxDate, disabled }: DatePickerTimeProps) {
    const [open, setOpen] = React.useState(false);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = e.target.value;
        if (!time) return;
        const base = value ?? new Date();
        const [hours, minutes] = time.split(':').map(Number);
        const updated = new Date(base);
        updated.setHours(hours, minutes, 0, 0);
        onChange(updated);
    };

    const timeValue = value ? format(value, 'HH:mm') : '';

    return (
        <div className="flex flex-col gap-1">
        <FieldGroup className="max-w-xs flex-row">
            <Field>
                <FieldLabel className="flex items-center gap-1">
                    {label}
                    {description && (
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger type="button" tabIndex={-1}>
                                    <InfoIcon className="size-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="whitespace-pre-line">{description}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-32 justify-between font-normal"
                            disabled={disabled}
                        >
                            {value ? format(value, 'PPP') : 'Select date'}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={value}
                            captionLayout="dropdown"
                            defaultMonth={value ?? minDate}
                            startMonth={minDate}
                            endMonth={maxDate}
                            disabled={[
                                ...(minDate ? [{ before: minDate }] : []),
                                ...(maxDate ? [{ after: maxDate }] : []),
                            ]}
                            onSelect={(date) => {
                                if (!date) {
                                    onChange(undefined);
                                } else {
                                    const hours = value ? value.getHours() : 0;
                                    const minutes = value ? value.getMinutes() : 0;
                                    date.setHours(hours, minutes, 0, 0);
                                    onChange(date);
                                }
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </Field>
            <Field className="w-32">
                <FieldLabel>Time</FieldLabel>
                <Input
                    type="time"
                    value={timeValue}
                    onChange={handleTimeChange}
                    disabled={disabled}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
            </Field>
        </FieldGroup>
        {hint && (
            <p className="text-muted-foreground text-xs">{hint}</p>
        )}
        {error && (
            <p className="text-destructive text-sm">{error}</p>
        )}
        </div>
    );
}
