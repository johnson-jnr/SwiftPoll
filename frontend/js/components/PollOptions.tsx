'use client';

import { Button } from '@/components/shadcn/button';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from './shadcn/input-group';

interface Props {
    options: string[];
    onChange: (options: string[]) => void;
}

export default function PollOptions({ options, onChange }: Props) {
    const maxOptions = 10;

    const addOption = () => onChange([...options, '']);
    const removeOption = (targetIndex: number) => {
        onChange(options.filter((_, index) => index !== targetIndex));
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        targetIndex: number,
    ) => {
        onChange(
            options.map((option, index) =>
                index === targetIndex ? e.target.value : option,
            ),
        );
    };
    const isOptionsMax = maxOptions === options.length;

    return (
        <div>
            <label>
                Options:
                <div className="space-y-2">
                    {options.map((option, index) => (
                        <InputGroup className="mt-2" key={index}>
                            <InputGroupInput
                                name="options"
                                value={option}
                                onChange={(e) => handleChange(e, index)}
                                placeholder={`Option ${index + 1}`}
                            />
                            {options.length > 1 && (
                                <InputGroupAddon align="inline-end">
                                    <X
                                        className="cursor-pointer"
                                        onClick={() => removeOption(index)}
                                    />
                                </InputGroupAddon>
                            )}
                        </InputGroup>
                    ))}
                </div>
            </label>
            <Button
                className={cn('mt-2', {
                    'disabled:pointer-events-none disabled:opacity-50':
                        isOptionsMax,
                })}
                type="button"
                onClick={addOption}
                variant="outline"
                size="sm"
                disabled={isOptionsMax}
            >
                <Plus /> Add Option
            </Button>
        </div>
    );
}
