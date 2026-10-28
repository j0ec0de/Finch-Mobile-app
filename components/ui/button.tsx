import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { cn } from '@/components/cn';
import { useTheme } from '@/hooks/use-theme';

type Variant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
type Size = 'default' | 'sm';

const container: Record<Variant, string> = {
  default: 'bg-primary',
  outline: 'border border-input bg-background',
  secondary: 'bg-secondary',
  ghost: '',
  destructive: 'bg-destructive',
  link: '',
};

const label: Record<Variant, string> = {
  default: 'text-primary-foreground',
  outline: 'text-foreground',
  secondary: 'text-secondary-foreground',
  ghost: 'text-foreground',
  destructive: 'text-white',
  link: 'text-foreground underline',
};

type ButtonProps = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
};

export function Button({
  title,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const spinnerColor = variant === 'default' ? colors.primaryForeground : colors.foreground;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      hitSlop={size === 'sm' ? 4 : 0}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-lg px-4 active:opacity-80',
        size === 'sm' ? 'h-9' : 'h-11',
        container[variant],
        isDisabled && 'opacity-50',
        className,
      )}
      {...props}>
      {loading ? <ActivityIndicator size="small" color={spinnerColor} /> : null}
      <Text className={cn('text-base font-medium', label[variant])}>{title}</Text>
    </Pressable>
  );
}
