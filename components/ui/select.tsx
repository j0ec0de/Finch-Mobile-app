import { Check, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/components/cn';
import { useTheme } from '@/hooks/use-theme';

export type SelectOption<T extends string | number> = { value: T; label: string };

type SelectProps<T extends string | number> = {
  label: string;
  value: T | null | undefined;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

/** A field that looks like an Input and opens a bottom list sheet. */
export function Select<T extends string | number>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select',
  error,
  disabled,
}: SelectProps<T>) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: selected?.label ?? placeholder }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={cn(
          'h-11 flex-row items-center justify-between rounded-lg border bg-background px-3',
          error ? 'border-destructive' : 'border-input',
          disabled && 'opacity-50',
        )}>
        <Text
          maxFontSizeMultiplier={1.5}
          numberOfLines={1}
          className={cn('flex-1 text-base', selected ? 'text-foreground' : 'text-muted-foreground')}>
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDown size={16} color={colors.mutedForeground} />
      </Pressable>
      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable
          accessibilityLabel="Close"
          className="flex-1 justify-end bg-black/40"
          onPress={() => setOpen(false)}>
          <Pressable
            style={{ paddingBottom: insets.bottom + 8, maxHeight: '70%' }}
            className="rounded-t-xl border border-border bg-card pt-2">
            <Text accessibilityRole="header" className="px-4 py-3 text-base font-medium text-foreground">
              {label}
            </Text>
            <FlatList
              data={options as SelectOption<T>[]}
              keyExtractor={(o) => String(o.value)}
              ListEmptyComponent={
                <Text className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Nothing to choose from yet.
                </Text>
              }
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: item.value === value }}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className="min-h-12 flex-row items-center justify-between px-4 active:bg-muted">
                  <Text className="text-base text-foreground">{item.label}</Text>
                  {item.value === value ? <Check size={20} color={colors.foreground} /> : null}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
