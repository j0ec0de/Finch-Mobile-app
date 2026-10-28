import { Pressable, Text, View } from 'react-native';

import { cn } from '@/components/cn';

export type SegmentOption<T extends string> = { value: T; label: string };

type SegmentedControlProps<T extends string> = {
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
  label?: string;
};

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <View accessibilityRole="tablist" accessibilityLabel={label} className="flex-row rounded-lg bg-muted p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            className={cn(
              'h-9 flex-1 items-center justify-center rounded-md',
              active && 'bg-background',
            )}>
            <Text
              maxFontSizeMultiplier={1.5}
              className={cn(
                'text-sm font-medium',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
