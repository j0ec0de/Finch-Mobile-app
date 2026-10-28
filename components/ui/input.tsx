import type { ComponentProps } from 'react';
import { Text, TextInput, View } from 'react-native';

import { cn } from '@/components/cn';
import { useTheme } from '@/hooks/use-theme';

type InputProps = ComponentProps<typeof TextInput> & {
  label: string;
  error?: string;
  className?: string;
};

export function Input({ label, error, className, ...props }: InputProps) {
  const { colors } = useTheme();

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.mutedForeground}
        maxFontSizeMultiplier={1.5}
        className={cn(
          'h-11 rounded-lg border bg-background px-3 text-base text-foreground focus:border-ring',
          error ? 'border-destructive' : 'border-input',
          className,
        )}
        {...props}
      />
      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}
    </View>
  );
}
